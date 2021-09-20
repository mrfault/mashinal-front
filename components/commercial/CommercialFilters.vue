<template>
  <div class="commercial-filters">
    <div class="row">
      <slot name="before" />
      <div :class="['mb-2 mb-lg-3', filter.type.includes('buttons') ? 'col-12 col-lg-4' : 'col-6 col-lg-2']" v-for="filter in filters" :key="filter.key">
        <template v-if="filterExists(filter)">
          <template v-if="filter.type === 'form-numeric-input-group'">
            <form-select :label="filter.placeholder" custom :suffix="filter.suffix"
              :values="{from: form[`${filter.key}_from`], to: form[`${filter.key}_to`], suffix: filter.suffix, showLabel: filter.showLabel }"
              @clear="form[`${filter.key}_from`] = '', form[`${filter.key}_to`] = '', changeFilter(`${filter.key}_from`, ''), changeFilter(`${filter.key}_to`, '')"
            >
              <div class="form-merged">
                <form-numeric-input :placeholder="$t('from')" v-model="form[`${filter.key}_from`]" 
                  @change="changeFilter(`${filter.key}_from`, $event)" />
                <form-numeric-input :placeholder="$t('to')" v-model="form[`${filter.key}_to`]" 
                  @change="changeFilter(`${filter.key}_to`, $event)" />
              </div>
            </form-select>
          </template>
          <template v-else-if="filter.type === 'form-select-group'">
            <form-select :label="filter.placeholder" custom :suffix="filter.suffix"
              :values="{from: form[`${filter.key}_from`], to: form[`${filter.key}_to`] }"
              @clear="form[`${filter.key}_from`] = '', form[`${filter.key}_to`] = '', changeFilter(`${filter.key}_from`, ''), changeFilter(`${filter.key}_to`, '')"
            >
              <div class="form-merged">
                <form-select :label="$t('from')" v-model="form[`${filter.key}_from`]" 
                  :options="filter.options" :show-label-on-select="false" :clear-option="false" in-select-menu :suffix="filter.suffix"
                  @change="changeFilter(`${filter.key}_from`, $event)" />
                <form-select :label="$t('to')" v-model="form[`${filter.key}_to`]"
                  :options="filter.options" :show-label-on-select="false" :clear-option="false" in-select-menu :suffix="filter.suffix"
                  @change="changeFilter(`${filter.key}_to`, $event)" />
              </div>
            </form-select>
          </template>
          <template v-else-if="filter.type === 'form-select'">
            <form-select :label="filter.placeholder" v-model="form[filter.key]" :suffix="filter.suffix"
              :options="filter.options" :multiple="filter.multiple" :name-in-value="filter.multiple" 
              @change="changeFilter(filter.key, $event)" />
          </template>
          <template v-else-if="filter.type === 'form-buttons'">
            <form-buttons :options="filter.options" v-model="form[filter.key]"
              @change="changeFilter(filter.key, $event)" />
          </template>
        </template>
      </div>
      <slot name="after" />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  props: {
    values: {}
  },
  data() {
    return {
      form: {}
    }
  },
  computed: {
    ...mapGetters(['commercialSearchFilters']),

    filters() {
      return this.commercialSearchFilters.map(filter => {
        let modifiedFilter = { key: filter.search_key };
        // options
        let values = JSON.parse(filter.values);
        if (['exhaust_class'].includes(filter.search_key)) 
          values[values.length - 1].name = this.$t(values[values.length - 1].name);
        modifiedFilter.options = values instanceof Array 
          ? values
          : Object.keys(values).map((key,index) => ({ key: index, name: values[key][this.locale] || values[key] }));
        // placeholder
        modifiedFilter.placeholder = this.$t(filter.type_key.replace('engine', 'fuel'));
        modifiedFilter.showLabel = filter.type_key.includes('seat_count');
        // suffix
        let suffix = '';
        switch(filter.type_key) {
          case 'capacity': suffix = this.$t('char_litre'); break;
          case 'power': suffix = this.$t('char_h_power'); break;
          case 'mileage': suffix = this.$t('char_kilometre'); break;
          case 'loading': suffix = this.$t('char_kilogramm'); break;
          case 'working_hours': suffix = this.$t('char_hour'); break;
          case 'arrow_radius': suffix = this.$t('char_metre'); break;
          default: suffix = ''; break;
        }
        modifiedFilter.suffix = suffix;
        // single or multiple select
        let singleSelectGroup = ['steering_wheel'];
        modifiedFilter.multiple = !singleSelectGroup.includes(filter.search_key);
        // input type
        let type = '';
        if (filter.type_key === 'capacity') type = 'form-select-group';
        else if (filter.component === 'select-menu') type = 'form-select';
        else if (filter.component === 'input-buttons') type = 'form-buttons';
        else if (filter.component === 'input-component') type = 'form-numeric-input-group';
        modifiedFilter.type = type;

        return modifiedFilter;
      });
    }
  },
  methods: {
    changeFilter(key, value) {
      this.$emit('change-filter', key, value);
    },
    filterExists(filter) {
      let key = filter.key;
      let isUndefined = filter.type.includes('group') 
        ? (this.form[`${key}_from`] === undefined || this.form[`${key}_to`] === undefined)
        : this.form[key] === undefined;
      return !isUndefined;
    },
    setValues() {
      this.filters.map(filter => {
        let hasValue = key => this.values.hasOwnProperty(key);
        let key = filter.key;
        if (filter.type.includes('-group')) {
          this.$set(this.form, `${key}_from`, hasValue(`${key}_from`) ? this.values[`${key}_from`] : '');
          this.changeFilter(key, this.form[`${key}_from`]);
          this.$set(this.form, `${key}_to`, hasValue(`${key}_to`) ? this.values[`${key}_to`] : '');
          this.changeFilter(key, this.form[`${key}_to`]);
        } else {
          this.$set(this.form, key, hasValue(key) ? this.values[key] : []);
          this.changeFilter(key, this.form[key]);
        }
      });
    }
  },
  created() {
    this.setValues();
    this.$nuxt.$on('change-commercial-filters', this.setValues);
  },
  beforeDestroy() {
    this.$nuxt.$off('change-commercial-filters', this.setValues);
  }
}
</script>