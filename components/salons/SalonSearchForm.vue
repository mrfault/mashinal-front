<template>
  <div :class="['salon-search-form form', { short, 'has-sticky-screen-bottom': isMobileBreakpoint }]">
    <div class="card-left-offset"></div>
    <div class="card with-btns">
      <div class="card-btns">
        <form-buttons :options="getMileageOptions" :group-by="3" v-model="form.announce_type" 
          :btn-class="!isMobileBreakpoint ? 'pale-red-outline btn--merged' : 'pale-red-outline'" 
          :row-class="!isMobileBreakpoint ? 'no-gutters' : ''" @change="searchAutosalons()" />
      </div>
      <div class="row mb-n2 mb-lg-n3">
        <template v-if="where === 'transport'">
          <div class="col-12 col-lg-1-5 mb-2 mb-lg-3">
            <form-select :label="$t('mark')" :options="brands" v-model="form.brand_id"
              :clear-option="!isMobileBreakpoint" :popular-options="isMobileBreakpoint ? [129,483,8,1,767,117] : undefined" 
              :img-key="isMobileBreakpoint ? 'transformed_media' : ''" @change="setBrand($event, 0), searchAutosalons()" has-search />
          </div>
          <div class="col-12 col-lg-1-5 mb-2 mb-lg-3">
            <form-select :label="$t('model')" :options="carModels[0]" v-model="form.model_id"
              :disabled="form.brand_id && !carModels[0].length" @change="setModel($event, 0), searchAutosalons()" has-search />
          </div>
          <div class="col-12 col-lg-1-5 mb-2 mb-lg-3">
            <form-select :label="$t('generation')" :options="carGenerations[0]" v-model="form.generation_id"
              :disabled="form.model_id && !carGenerations[0].length" has-search @change="searchAutosalons()" />
          </div>
          <div class="col-12 col-lg-2-5 mb-2 mb-lg-3">
            <div :class="['row', {'checkbox-row': short}]">
              <div class="col-6 col-lg-6">
                <form-checkbox :label="$t('barter')" v-model="form.barter" 
                  input-name="barter" icon-name="barter" @change="searchAutosalons()" :has-tooltip="short" :transparent="isMobileBreakpoint"/>
              </div>
              <div class="col-6 col-lg-6">
                <form-checkbox :label="$t('credit')" v-model="form.credit" 
                  input-name="credit" icon-name="percent" @change="searchAutosalons()" :has-tooltip="short" :transparent="isMobileBreakpoint"/>
              </div>
            </div>
          </div>
        </template>
        <template v-else-if="where === 'parts'">
          <div class="col-12 col-lg-4-5 mb-2 mb-lg-3">
            <form-text-input 
              v-model="form.text" 
              icon-name="search" 
              block-class="placeholder-lighter"
              :placeholder="$t('parts_name')"
              @change="searchAutosalons()" 
            />
          </div>
          <div class="col-12 col-lg-1-5 mb-2 mb-lg-3">
            <form-select :label="$t('price')" custom :suffix="'AZN'"
              :values="{from: form.price_from, to: form.price_to, suffix: '₼' }"
              @clear="form.price_from = '', form.price_to = '', searchAutosalons()"
            >
              <div class="form-merged">
                <form-numeric-input :placeholder="$t('from')" v-model="form.price_from" 
                  @change="searchAutosalons()"/>
                <form-numeric-input :placeholder="$t('to')" v-model="form.price_to" 
                  @change="searchAutosalons()"/>
              </div>
            </form-select>
          </div>
        </template>
      </div>
    </div>
    <div class="stick-to-screen-bottom" v-if="isMobileBreakpoint">
      <button :class="['btn full-width btn--green', { pending }]" @click="searchAutosalons(true)">{{ $t('find') }}</button>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  props: {
    short: Boolean,
    where: {
      type: String,
      default: 'transport'
    }
  },
  data() {
    return {
      pending: false,
      searchAgain: false,
      form: {
        part: this.where === 'parts',
        brand_id: '',
        model_id: '',
        generation_id: '',
        announce_type: 1,
        barter: false,
        credit: false,
        text: '',
        price_from: '',
        price_to: ''
      }
    }
  },
  computed: {
    ...mapGetters(['brands', 'carModels', 'carGenerations', 'salonsSearchFilters']),

    getMileageOptions() {
      return [
        { name: this.$t('all'), key: 1 },
        { name: this.$t('new'), key: 2 },
        { name: this.$t(this.where === 'parts' ? 'S_H' : 'with_mileage'), key: 3 }
      ];
    },
    showResetBtn() {
      return this.$queryParams(this.form, true).split('&').length > (this.form.announce_type == 1 ? 1 : 0);
    }
  },
  methods: {
    ...mapActions(['getModelsArray', 'getModelGenerationsArray', 'getSalonsList', 'updateSalonsSearchFilters']),

    async searchAutosalons(runOnMobile = false) {
      if (this.isMobileBreakpoint && !runOnMobile) return;
      this.updateSalonsSearchFilters({...this.form});
      this.searchAgain = false;
      if (this.pending) {
        this.searchAgain = true;
        return;
      }
      this.pending = true;
      try {
        await this.getSalonsList(this.$queryParams(this.form, true));
        this.$nuxt.$emit('search-salons', runOnMobile);
        this.pending = false;
        if (this.searchAgain) {
          await this.searchAutosalons(runOnMobile);
        }
      } catch(err) {
        this.pending = false;
      }
    },
    async setBrand(id, index = 0) {
      this.$set(this.form, 'generation_id', '');
      this.$set(this.form, 'model_id', '');
      let slug = this.brands.find(option => option.id == id)?.slug || '';
      if (id) await this.getModelsArray({ value: slug, index });
    },
    async setModel(id, index = 0) {
      this.$set(this.form, 'generation_id', '');
      let slug = this.carModels[index].find(option => option.id == id)?.slug || '';
      let brand_slug = this.brands.find(option => option.id == this.form.brand_id)?.slug || '';
      if (id) await this.getModelGenerationsArray({ value: slug, brand_slug, index });
    }
  },
  created() {
    for (let key in this.salonsSearchFilters)
      this.$set(this.form, key, this.salonsSearchFilters[key]);
  }
}
</script>