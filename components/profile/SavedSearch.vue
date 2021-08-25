<template>
  <div class="templates-item card mb-2 mb-lg-3">
    <div class="d-flex align-items-center justify-content-between" @click="toggleCollapse">
      <div class="ml-n2" @click.stop>
        <form-checkbox class="fw-500" :label="title" v-model="checkedValue" :input-name="`saved-search-${item.id}`" 
          transparent label-click @label-click="goToSearch" />
      </div>
      <div class="toggle">
        <span class="text-dark-blue-3">{{ setting.selected_name }}</span>
        <span :class="['cursor-pointer', {'disabled-ui': !params.length}]" @click.stop="toggleCollapse">
          <icon :name="`chevron-${collapsed ? 'down' : 'up'}`" />
        </span>
      </div>
    </div>
    <transition-expand>
      <div class="templates-item_params" v-if="!collapsed && params.length">
        <hr />
        <div class="row">
          <template v-for="(param, i) in params">
            <div class="full-width mb-2" v-if="i > 0 && i % 5 === 0" :key="i"></div>
            <div class="col-auto"  :key="i+'_param'">
              <div class="param d-flex flex-column">
                <span class="text-dark-blue-3">{{ param.title }}</span>
                <span>{{ param.value }}</span>
              </div>
            </div>
          </template>
        </div>
      </div>
    </transition-expand>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  props: {
    item: Object,
    checked: {},
    notificationOptions: Array
  },
  data() {
    return { 
      filter: JSON.parse(this.item.search_filter), 
      collapsed: true
    }
  },
  computed: {
    ...mapGetters(['brands', 'colors', 'sellOptions', 'allSellOptions', 'bodyOptions']),

    checkedValue: {
      get() {
        return this.checked;
      },
      set(value) {
        this.$emit('change', this.item.id, value);
      }
    },
    title() {
      let models = Object.keys(this.filter.additional_brands)
        .map(key => {
          let title = '';
          let data = this.filter.additional_brands[key];
          if (data.brand) title = this.brands.find(brand => brand.id == data.brand).name;
          const slugToTitle = slug => slug.replace(/_| /g, '-').split('-').map(w => w ? (w[0].toUpperCase() + w.slice(1)) : '').join(' ')
          if (data.model_name) title += (' ' + this.$translateHard(data.model_name));
          else if (data.model_slug) title += (' ' + slugToTitle(data.model_slug));
          if (data.generation_name) title += (' ' + this.$translateHard(data.generation_name));
          else if (data.generation_slug) title += (' ' + slugToTitle(data.generation_slug));
          return title;
        })
        .filter(title => title);
      
      return models.length ? models.join(', ') : this.$t('all_car_brands');
    },
    params() {
      let data = [
        {name: 'year', title: this.$t('prod_year'), range: true},
        {name: 'price', title: this.$t('price'), range: true, suffix: this.filter.currency === 2 ? 'USD' : 'AZN'},
        {name: 'region', title: this.$t('city'), options: this.sellOptions.regions, key: 'key'},
        {name: 'mileage', title: this.$t('mileage'), range: true, suffix: this.$t('char_kilometre')},
        {name: 'capacity', title: this.$t('capacity'), range: true, suffix: this.$t('char_litre')},
        {name: 'engine_type', title: this.$t('engine'), list: true},
        {name: 'korobka', title: this.$t('box'), list: true},
        {name: 'body', title: this.$t('com_light_type'), options: this.bodyOptions.main.default_options.body.values, body_options: true },
        {name: 'gearing', title: this.$t('gearing'), list: true},
        {name: 'colors', title: this.$t('color'), options: this.colors, key: 'id', list: this.filter.colors instanceof Array},
        {name: 'is_matte', title: this.$t('matt'), boolean: true},
        {name: 'n_of_seats', title: this.$t('kolichestvo-mest'), list: true},
        {name: 'credit', title: this.$t('credit'), boolean: true},
        {name: 'exchange_possible', title: this.$t('barter'), boolean: true},
        {name: 'damage', title: this.$t('damage'), options: [{name: this.$t('without_beaten'), key: 1},{name: this.$t('broken'), key: 2}]},
        {name: 'customs', title: this.$t('customs'), options: [{name: this.$t('cleared'), key: 1},{name: this.$t('not_cleared'), key: 2}]},
        {name: 'in_garanty', title: this.$t('in_garanty'), boolean: true},
        {name: 'with_video', title: this.$t('with_video'), boolean: true}
      ];
      // add values
      return data.map(param => {
        let key = param.name;
        let value = '';
        if (param.range) {
          let minValue, maxValue;
          let read = !['year','capacity'].includes(key);
          if ('min_' + key in this.filter) minValue = this.filter['min_' + key];
          else if (key + '_from' in this.filter) minValue = this.filter[key + '_from'];
          if ('max_' + key in this.filter) maxValue = this.filter['max_' + key];
          else if (key + '_to' in this.filter) maxValue = this.filter[key + '_to'];
          if (minValue && maxValue) value = minValue === maxValue
            ? `${read ? this.$readNumber(minValue) : minValue} ${param.suffix || ''}`
            : `${read ? this.$readNumber(minValue) : minValue} - ${read ? this.$readNumber(maxValue) : maxValue} ${param.suffix || ''}`;
          else if (minValue) value = this.$t('from')  +` ${read ? this.$readNumber(minValue) : minValue} ${param.suffix || ''}`;
          else if (maxValue) value = this.$t('to')  +` ${read ? this.$readNumber(maxValue) : maxValue} ${param.suffix || ''}`;
        } else if (param.list && key in this.filter) {
          value = param.options
            ? param.options
                .filter(option => this.filter[key].includes(option[param.key || 'key']))
                .map(option => option.name[this.locale] || option.name).join(', ')
            : this.filter[key].map(option => this.$t(option.name)).join(', ');
        } else if (param.boolean && key in this.filter) {
          value = this.filter[key] ? (['exchange_possible','credit'].includes(key) ? this.$t('is_possible') : '✓') : '✕';
        } else if (param.options && key in this.filter) {
          value = (this.filter[key] instanceof Array ? this.filter[key] : [this.filter[key]])
            .map(selected => {
              let paramKey = param.key || 'key';
              let option = param.options.find(option => option[paramKey] == (selected[paramKey] || selected));
              return option.name[this.locale] || option.name;
            }).join(', ');
        }
        return {...param, value}
      })
        .filter(param => param.value)
        .concat(this.allSellOptions
          .reduce((allOptions, options) => ([...allOptions, ...options]), [])
          .filter(({ name }) => (this.filter.all_options[name] !== undefined))
          .map(({ name, type, label, options, placeholder }) => {
            let title, value;
            if (type === 'select') {
              let optionValue = this.filter.all_options[name];
              if (optionValue instanceof Array && optionValue.length > 0) {
                let selected = [];
                for (let i in optionValue) {
                  let option = options.find(option => option.key == optionValue[i].key);
                  selected[i] = option && this.$t(option.name);
                }
                value = selected.filter(i => i).join(', ');
              } else if (options.find(option => option.key === optionValue)) {
                value = this.$t(options.find(option => option.key === optionValue).name);
              } else {
                value = this.$t(options[1].name);
              }
              title = this.$t(placeholder);
            } else {
              title = this.$t(label);
              value = '✓';
            }
            return { name, value, title }
          })
        );
    },
    setting() {
      let selected = this.item.notification_interval || 0;
      return this.notificationOptions.find(option => option.key === selected);
    }
  },
  methods: {
    getOptionName(value, options, key = 'key') {
      const option = options.find(option => option[key] == value);
      return option.name[this.locale] || option.name;
    },
    toggleCollapse() {
      if (!this.params.length) return;
      this.collapsed = !this.collapsed;
    },
    goToSearch() {
      let search_url = this.item.search_url
        .replace('/cars', this.$localePath('/cars'));
      this.$router.push(search_url);
    },
  }
}
</script>