<template>
  <div class="car-filters">
    <div class="car-filters_row" v-for="(options, index) in carFilterOptions" :key="index">
      <div class="d-flex mb-2 mb-lg-3" @click="$set(collapsed, index, !collapsed[index])">
        <h2 class="title-with-line full-width">
          <span v-if="popular">{{ $t('popular_options') }}</span>
          <span v-else>{{ getTitle(index) }}</span>
        </h2>
        <icon :name="`chevron-${collapsed[index] ? 'down' : 'up'}`" class="cursor-pointer" />
      </div>
      <transition-expand>
        <div class="row" v-if="!collapsed[index]">
          <div class="col-12 col-lg-4 mb-2 mb-lg-3" v-for="(input, index) in options" :key="index">
            <template v-if="form.hasOwnProperty(input.name)">
              <form-select 
                v-if="input.type === 'select'" 
                v-model="form[input.name]" 
                :label="$t(input.placeholder)" 
                :options="input.options" 
                :multiple="isMultiple(input)" 
                :name-in-value="isMultiple(input) && !!nameInValue"
                :translate-options="true"
                @change="changeFilter(input.name, $event)"
              />
              <form-checkbox  
                v-else-if="input.type === 'checkbox'"
                v-model="form[input.name]" 
                :label="$t(input.label)"
                :id="`${popular ? 'popular_' : ''}${input.name}${input.selected_key || ''}`"
                :input-name="input.name"  
                @change="changeFilter(input.name, $event, input.selected_key)"
              />
            </template>
          </div>
        </div>
      </transition-expand>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  props: {
    values: {},
    nameInValue: Boolean,
    collapsedByDefault: Boolean,
    popular: Boolean
  },
  data() {
    return {
      form: {},
      selectMultiple: [
        'p_seats','s_ventilation','h_seats','p_windows','s_w_adjustment',
        'p_assist_system','airbags','isofix_mounting_system','a_systems','suspension'
      ],
      collapsed: {},
      titles: [
        this.$t('accordeon_view'),
        this.$t('accordeon_exterior_elements'),
        this.$t('accordeon_theft_protection'),
        this.$t('accordeon_multimedia'),
        this.$t('accordeon_cabin'),
        this.$t('accordeon_comfort'),
        this.$t('accordeon_security'),
        this.$t('accordeon_other')
      ]
    }
  },
  computed: {
    ...mapGetters(['allSellOptions', 'allSellOptions2', 'popularOptions']),

    carFilterOptions() {
      if (this.popular)
        return [this.popularOptions];
      else if (this.nameInValue)
        return this.allSellOptions2.detailed;
      return this.allSellOptions;
    }
  },
  methods: {
    isMultiple(input) {
      return this.selectMultiple.includes(input.name);
    },
    getTitle(index) {
      let title = this.titles[index] || '';
      let count = 0;
      this.carFilterOptions[index].map(input => {
        let value = this.form[input.name];
        if ((value instanceof Array && value?.length) || (value === true) || (typeof value === 'number')) {
          count++;
        }
      });
      return count ? `${title} (${count})` : title;
    },
    getValue(input, values) {
      return values.hasOwnProperty(input.name) 
        ? (input.selected_key ? (this.isMultiple(input) ? values[[input.name]].includes(input.selected_key) : input.selected_key == values[[input.name]]) : values[[input.name]])
        : (input.selected_key ? false : (this.isMultiple(input) ? [] : (input.type === 'select' ? '' : false)));
    },
    changeFilter(key, value, selected_key) {
      if (selected_key) {
        if (this.selectMultiple.includes(key)) {
          let selected = this.values[key] || [];
          let index = selected.findIndex(v => v == selected_key);
          value = value ? [...selected, selected_key] : (index === -1 ? [] : selected.filter((_, i) => i !== index));
        } else {
          value = value ? selected_key : '';
        }
      }
      this.$emit('change-filter', key, value);
    },
    setValues() {
      this.carFilterOptions.map(options => {
        options.map(input => {
          this.$set(this.form, input.name, this.getValue(input, this.values));
        });
      });
    }
  },
  created() {
    this.setValues();
    this.$nuxt.$on('change-car-filters', this.setValues);
    if (this.collapsedByDefault) {
      this.carFilterOptions.map((_, index) => {
        this.$set(this.collapsed, index, true);
      });
    }
  },
  beforeDestroy() {
    this.$nuxt.$off('change-car-filters', this.setValues);
  }
}
</script>