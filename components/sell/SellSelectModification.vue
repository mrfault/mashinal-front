<template>
  <div class="sell_select-modification">
    <transition-group name="fade2">
      <div :key="1" class="mt-3 mt-lg-0 mb-3" v-if="form.year && sellBody.length" ref="sell-car_body_type">
        <h2 class="title-with-line full-width">
          <span>{{ $t('carcase') }}</span>
        </h2>
        <form-buttons v-model="form.car_body_type" :options="sellBody" 
          :btn-class="'primary-outline'" :group-by="isMobileBreakpoint ? 2 : 5" 
          @change="handleChange($event, 'getSellGenerations', ['car_body_type'], ['sellGenerations','sellEngines','sellGearing','sellTransmissions','sellModifications'], 'generation_id')" />
      </div>
      <div :key="2" class="mb-3" v-if="form.car_body_type && sellGenerations.length" ref="sell-generation_id">
        <h2 class="title-with-line full-width">
          <span>{{ $t('generation') }}</span>
        </h2>
        <form-buttons v-model="form.generation_id" :options="sellGenerations" 
          :btn-class="'primary-outline'" :group-by="isMobileBreakpoint ? 2 : 5"
          @change="handleChange($event, 'getSellEngines', ['car_body_type','generation_id'], ['sellEngines','sellGearing','sellTransmissions','sellModifications'], 'gearing')" />
      </div>
      <div :key="3" class="mb-3" v-if="form.generation_id && sellEngines.length" ref="sell-gearing">
        <h2 class="title-with-line full-width">
          <span>{{ $t('engine') }}</span>
        </h2>
        <form-buttons v-model="form.gearing" 
          :options="sellEngines.map(o => ({ name: $t('engine_values')[o.engine], key: o.engine }))" 
          :btn-class="'primary-outline'" :group-by="isMobileBreakpoint ? 1 : 5"
          @change="handleChange($event, 'getSellGearing', ['car_body_type','generation_id','gearing'], ['sellGearing','sellTransmissions','sellModifications'], 'transmission')" />
        <div class="mt-2 mt-lg-3">
          <form-checkbox :label="$t('gas_equipment')" v-model="form.autogas" transparent input-name="autogas" 
            @change="$emit('update-form', { key: 'autogas', value: $event })" />
        </div>
      </div>
      <div :key="4" class="mb-3" v-if="form.gearing && sellGearing.length" ref="sell-transmission">
        <h2 class="title-with-line full-width">
          <span>{{ $t('type_of_drive') }}</span>
        </h2>
        <form-buttons v-model="form.transmission" 
          :options="sellGearing.map(o => ({ name: $t('type_of_drive_values')[o.type_of_drive], key: o.type_of_drive }))" 
          :btn-class="'primary-outline'" :group-by="isMobileBreakpoint ? 1 : 5"
          @change="handleChange($event, 'getSellTransmissions', ['car_body_type','generation_id','gearing','transmission'], ['sellTransmissions','sellModifications'], 'modification')" />
      </div>
      <div :key="5" class="mb-3" v-if="form.transmission && sellTransmissions.length" ref="sell-modification">
        <h2 class="title-with-line full-width">
          <span>{{ $t('box') }}</span>
        </h2>
        <form-buttons v-model="form.modification" 
          :options="sellTransmissions.map(o => ({ name: $t('box_values')[o.box], key: o.box }))" 
          :btn-class="'primary-outline'" :group-by="isMobileBreakpoint ? 1 : 5"
          @change="handleChange($event, 'getSellModifications', ['car_body_type','generation_id','gearing','transmission','modification'], ['sellModifications'], 'car_catalog_id')" />
      </div>
      <div :key="6" class="mb-3" v-if="form.modification && sellModifications.length" ref="sell-car_catalog_id">
        <h2 class="title-with-line full-width">
          <span>{{ $t('modification') }}</span>
        </h2>
        <form-buttons v-model="form.car_catalog_id" 
          :options="sellModifications.map(o => ({ name: getModificationName(o), key: o.id }))" 
          :btn-class="'primary-outline'" :group-by="isMobileBreakpoint ? 1 : 3"
          @change="handleChange($event, false, ['car_catalog_id'], [])" />
      </div>
    </transition-group>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  props: {
    form: {}
  },
  computed: {
    ...mapGetters(['sellBody','sellGenerations','sellEngines','sellGearing','sellTransmissions','sellModifications']),
  },
  methods: {
    ...mapActions(['getSellBody','getSellGenerations','getSellEngines','getSellGearing','getSellTransmissions','getSellModifications']),

    getFormValues(keys) {
      let form = {};
      keys.map(key => {
        let formKey = key
          .replace('car_body_type','body')
          .replace('generation_id','generation')
          .replace('gearing','engine')
          .replace('transmission','gearing')
          .replace('modification','transmission');
        form[formKey] = this.form[key]
      });
      return form;
    },
    getModificationName(o) {
      let generation = this.sellGenerations.find(o => o.id === this.form.generation_id);
      let name = `${o.power} ${this.$t('char_h_power')}/${o.capacity} ${this.$t('box_mode_values')[o.box]}/${generation.start_year} - ${generation.end_year || this.currentYear}`;
      if (o.complect_type) name += `/${o.complect_type}`;
      return name;
    },
    async handleChange(value, action, keys, props, nextKey) {
      // clean store props
      props.map(property => { this.mutate({ property, value: [] }); });
      // update form prop
      this.$emit('update-form', { key: keys[keys.length - 1], value });
      // skip step for the last input
      if (!action) return;
      // clean form props
      ['car_body_type','generation_id','gearing','transmission','modification','car_catalog_id'].map(key => {
        if (!keys.includes(key)) this.$emit('update-form', { key, value: '' });
      });
      // get values for the next input
      let values = this.getFormValues([...keys,'brand','model','year']);
      await this[action](values);
      // move next if only one option available
      this.$nextTick(() => {
        let options = this[action.replace('getSell', 'sell')];
        if (options.length === 1) {
          let nextValue = options[0].engine || options[0].type_of_drive || options[0].box || options[0].id;
          this.$emit('update-form', { key: nextKey, value: nextValue });
        }
      });
    }
  },
  async fetch() {
    if (!this.sellBody.length)
      await this.getSellBody(this.getFormValues(['brand','model','year']));
  }
}
</script>