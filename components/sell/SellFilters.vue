<template>
  <div class="sell-filters">
    <div v-for="(item, index) in filteredComponents" :key="index" v-if="index !== 'power'">
      <h2 class="title-with-line mt-2 mt-lg-3" :id="`anchor-${getKey(item)}`">
        <span>{{ index === 'volume' ? $t('obem_sm3_and_power') : getPlaceholder(item) }} <span class="star" v-if="item.required"> *</span></span>
      </h2>
      <div class="row">
        <template v-if="getType(item) === 'input-radio'">
          <div class="col-lg-4 mb-2 mb-lg-3" v-for="(input, index) in getValues(item)" :key="index">
            <form-radio
              v-model="form[getKey(item)]"
              :invalid="hasError(item)"
              :input-name="getKey(item)"
              :radio-value="$notUndefined(input.id,input.key)"
              :label="input.name[locale] || $t(input.name)"
              @change="selectOption(getKey(item), $event)"
            />
          </div>
        </template>
        <template v-else-if="getType(item) === 'select-menu'">
          <div class="col-lg-4 mb-2 mb-lg-3">
            <form-select
              v-model="form[getKey(item)]"
              :invalid="hasError(item)"
              :label="getPlaceholder(item)"
              :options="getValues(item)"
              :name-in-value="true"
              @change="selectOption(getKey(item), $event)"
            />
          </div>
        </template>
        <template class="form-group" :class="getError(item)" v-else-if="getType(item) === 'input-numeric'">
          <div class="col-lg-4 mb-2 mb-lg-3">
            <form-numeric-input
              v-model="form[getKey(item)]"
              :invalid="hasError(item)"
              :placeholder="`${getPlaceholder(item)}${getSuffix(getKey(item), ', ')}`"
              :suffix="getSuffix(getKey(item))"
              @change="selectOption(getKey(item), $event)"
            />
          </div>
          <div class="col-lg-4 mb-2 mb-lg-3"  v-if="index === 'volume'">
            <form-numeric-input
              v-model="form[getKey(filteredComponents['power'])]"
              :invalid="hasError(filteredComponents['power'])"
              :placeholder="`${getPlaceholder(filteredComponents['power'])}${getSuffix(getKey(filteredComponents['power']), ', ')}`"
              :suffix="getSuffix(getKey(filteredComponents['power']))"
              @change="selectOption(getKey(filteredComponents['power']), $event)"
            />
          </div>
        </template>
      </div>
    </div>
    <div class="mt-2 mt-lg-3 car-filters_row">
      <div class="d-flex mb-2 mb-lg-3" @click="collapsed = !collapsed;">
        <h2 class="title-with-line full-width">
          <span>{{ $t('other_options') }}</span>
        </h2>
        <icon :name="collapsed ? 'chevron-up' : 'chevron-down'" class="cursor-pointer" />
      </div>
    </div>
    <transition-expand>
      <div v-if="collapsed">
        <div v-for="(item, index) in filteredOtherComponents" :key="index+100">
        <h2 class="title-with-line" :id="`anchor-${getKey(item)}`">
          <span>{{ getPlaceholder(item) }} <span class="star" v-if="item.required"> *</span></span>
        </h2>
        <div class="row">
          <template v-if="getType(item) === 'input-radio'">
            <div class="col-lg-4 mb-2 mb-lg-3" v-for="(input, index) in getValues(item)" :key="index">
              <form-radio
                v-model="form[getKey(item)]"
                :invalid="hasError(item)"
                :input-name="getKey(item)"
                :radio-value="$notUndefined(input.id,input.key)"
                :label="input.name[locale] || $t(input.name)"
                @change="selectOption(getKey(item), $event)"
              />
            </div>
          </template>
          <template v-else-if="getType(item) === 'select-menu'">
            <div class="col-lg-4">
              <form-select
                v-model="form[getKey(item)]"
                :invalid="hasError(item)"
                :label="getPlaceholder(item)"
                :options="getValues(item)"
                :name-in-value="true"
                @change="selectOption(getKey(item), $event)"
              />
            </div>
          </template>
          <template class="form-group" :class="getError(item)" v-else-if="getType(item) === 'input-numeric'">
            <div class="col-lg-4">
              <form-numeric-input
                v-model="form[getKey(item)]"
                :invalid="hasError(item)"
                :placeholder="`${getPlaceholder(item)}${getSuffix(getKey(item), ', ')}`"
                :suffix="getSuffix(getKey(item))"
                @change="selectOption(getKey(item), $event)"
              />
            </div>
          </template>
        </div>
      </div>
    </div>
   </transition-expand>
  </div>
</template>

<script>
  const formReducer = (form, key, data) => {
    return { ...form,  [key]: data.hasOwnProperty(key) && data[key] ? data[key] : '' }
  }
  export default {
    props: ['selected', 'nameInValue', 'errors', 'type'],
    data() {
      let filters = {}, options = false;
      if (this.type === 'commercial') {
        options = this.$clone(this.$store.getters.commercialAllOptions);
        filters = this.$clone(this.$store.getters.commercialFilters);
      } else if (this.type === 'moto') {
        filters = {
          ...this.$clone(this.$store.getters.motoOptions.config),
          power: {
            placeholder: this.$t('power'),
            component: 'animated-input'
          }
        };
      }
      return {
        collapsed: false,
        options,
        filters,
        form: filters instanceof Array
          ? filters.reduce((form, item) => formReducer(form, item.search_key, this.selected), {})
          : Object.keys(filters).reduce((form, key) => formReducer(form, key, this.selected), {})
      }
    },
    methods: {
      selectOption(key, value) {
        this.$emit('update-sell-filter', key, value);
        this.$emit('remove-error', key);
      },
      getKey(item) {
        return item.search_key || item.field;
      },
      getValues(item) {
        let options = this.options && this.options[item.type_key];
        let sell_values = item.sell_values && item.sell_values[parseInt(this.selected.category)];
        let values = options || sell_values || item.values;//this.$sortBy(options || sell_values || item.values, a => a.name[this.locale] || this.$t(a.name));
        return this.type === 'commercial' && this.getType(item) === 'input-radio' && !item.required
          ? [...values, { key: 0, name: this.$t('not_set') }]
          : values;
      },
      getPlaceholder(item) {
        return this.$t(item.placeholder) || this.$t(item.type_key.replace('engine', 'fuel'));
      },
      hasError(item) {
        let field = this.getKey(item);
        return this.errors.includes(field);
      },
      getSuffix(field, sep = '') {
        switch(field) {
          case 'volume': return sep + this.$t('char_sm_cube');
          case 'power': return sep + this.$t('char_h_power');
          case 'capacity': return sep + this.$t('char_sm_cube');
          case 'mileage': return sep + this.$t('char_kilometre');
          case 'weight': return sep + this.$t('char_kilogramm');
          default: return '';
        }
      },
      getType(item) {
        switch(item.component_add || item.component) {
          case 'select-checkbox':
          case 'any-type-selector':
          case 'truck-types':
            return 'input-radio';
          case 'animated-input':
          case 'input-component':
            return 'input-numeric';
        }
      }
    },
    computed: {
      filteredComponents() {
        if (this.filters instanceof Array)
          return this.filters.filter(item => ['capacity','power'].includes(item.type_key));
        let filters = {};
        for(let i in this.filters) {
          if(this.otherOptions.includes(i)) continue;
          let item = this.filters[i];
          if (!item.category || item.category.includes(parseInt(this.selected.category)))
            filters[i] = {...item, field: i};
        }
        return filters;
      },
      filteredOtherComponents() {
        if (this.filters instanceof Array)
          return this.filters.filter(item => !['capacity','power'].includes(item.type_key));
        let filters = {};
        for(let i in this.filters) {
          if(!this.otherOptions.includes(i)) continue;
          let item = this.filters[i];
          if (!item.category || item.category.includes(parseInt(this.selected.category)))
            filters[i] = {...item, field: i};
        }
        return filters;
      },
      otherOptions() {
        return ['number_of_vehicles', 'engine', 'cylinders', 'box','fuel_type','drive'];
      }
    },
    created() {
      for(let i in this.filteredComponents) {
        let item = this.filteredComponents[i];
        let key = this.getKey(item);
        let type = this.getType(item);
        let value = this.selected.hasOwnProperty(key) && this.selected[key];
        if (type === 'input-radio')
          this.form[key] = value || 0;
        else if (type === 'input-numeric')
          this.form[key] = value || '';
      }
      for(let i in this.filteredOtherComponents) {
        let item = this.filteredOtherComponents[i];
        let key = this.getKey(item);
        let type = this.getType(item);
        let value = this.selected.hasOwnProperty(key) && this.selected[key];
        if (type === 'input-radio')
          this.form[key] = value || 0;
        else if (type === 'input-numeric')
          this.form[key] = value || '';
      }
      this.$emit('add-form-keys', this.form);
    }
  }
</script>
