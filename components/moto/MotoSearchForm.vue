<template>
  <div class="moto-search-form form" ref="searchForm">
    <div class="card pt-2 pt-lg-4 mb-2">
      <div class="row">
        <div class="col-lg-4 mb-2 mb-lg-3">
          <form-buttons :options="getMileageOptions" :group-by="3" v-model="form.announce_type" />
        </div>
      </div>
      <div class="row" v-for="(key, index) in (isMobileBreakpoint ? [0] : rows)" :key="key">
        <div class="col-12 col-lg-4 mb-2" v-if="!category.id">
          <form-select :label="$t('type_of_motos')" :options="motoTypes" v-model="form.additional_brands[key]['category']"
            @change="setCategory($event, key)" has-search/>
        </div>
        <div class="col-6 col-lg-4 mb-2">
          <form-select :label="$t('mark')" :options="brands(category.id || form.additional_brands[key]['category'])" v-model="form.additional_brands[key]['brand']"
            @change="setBrand($event, key)" :disabled="(category.id || form.additional_brands[key]['category']) && !brands(category.id || form.additional_brands[key]['category']).length" has-search
            :img-key="isMobileBreakpoint ? 'transformed_media' : ''" :img-placeholder="`/logos/moto-${colorMode}.svg`" />
        </div>
        <div class="col-6 col-lg-4 mb-2 mb-lg-3">
          <div :class="['row', {'has-add-btn': canAddRow(index), 'has-remove-btn': canRemoveRow()}]">
            <div :class="['col', {'col-12': isMobileBreakpoint}]">
              <form-select :label="$t('model')" :options="models(category.id || form.additional_brands[key]['category'])[key]" v-model="form.additional_brands[key]['model']"
                :disabled="form.additional_brands[key]['brand'] && !models(category.id || form.additional_brands[key]['category'])[key].length" has-search />
            </div>
            <div class="col-auto" v-if="!isMobileBreakpoint">
              <div class="form-counter">
                <div class="form-info" v-if="canAddRow(index)" @click="addSearchRow(key)">
                  <!-- <icon name="plus" />/ -->
                  <inline-svg src="/new-icons/plus.svg" :height="14" />
                </div>
                <div class="form-info" v-if="canRemoveRow()" @click="removeSearchRow(key)">
                  <icon name="minus" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <component :is="isMobileBreakpoint ? 'transition-expand' : 'div'">
        <div class="row" v-if="!isMobileBreakpoint || !collapsed">
          <div class="col-6 col-lg-2 mb-2 mb-lg-3">
            <form-select :label="$t('years')" custom 
              :values="{from: form.min_year, to: form.max_year, read: false }"
              @clear="form.min_year = '', form.max_year = ''"
            >
              <div class="form-merged">
                <form-select :label="$t('from')" :options="getYearOptions(false, form.max_year)" v-model="form.min_year" 
                  :show-label-on-select="false" :clear-option="false" in-select-menu />
                <form-select :label="$t('to')" :options="getYearOptions(form.min_year, false)" v-model="form.max_year"
                  :show-label-on-select="false" :clear-option="false" in-select-menu />
              </div>
            </form-select>
          </div>
          <div class="col-6 col-lg-2 mb-2 mb-lg-3">
            <form-select :label="$t('price')" custom :suffix="getOptionValue('Currency', form.currency)"
              :values="{from: form.price_from, to: form.price_to, suffix: form.currency === 2 ? '$' : '₼' }"
              @clear="form.price_from = '', form.price_to = ''"
            >
              <div class="form-merged">
                <form-numeric-input :placeholder="$t('from')" v-model="form.price_from" />
                <form-numeric-input :placeholder="$t('to')" v-model="form.price_to" />
                <form-select :label="'AZN'" :options="getCurrencyOptions" v-model="form.currency"
                  :allow-clear="false" :clear-option="false" in-select-menu />
              </div>
            </form-select>
          </div>
          <div class="col-6 col-lg-2 mb-2 mb-lg-3" v-if="!isMobileBreakpoint">
            <form-select :label="$t('city')" :options="sellOptions.regions" v-model="form.region" has-search />
          </div>
          <div class="col-6 col-lg-2 mb-2 mb-lg-3">
            <form-checkbox :label="$t('barter')" v-model="form.exchange_possible" 
              input-name="exchange_possible" icon-name="barter" />
          </div>
          <div class="col-6 col-lg-2 mb-2 mb-lg-3">
            <form-checkbox :label="$t('credit')" v-model="form.credit" 
              input-name="credit" icon-name="percent" />
          </div>
          <div class="col-6 col-lg-2 mb-2 mb-lg-3" v-if="!isMobileBreakpoint">
            <div class="form-info text-green">
              {{ $readPlural(totalCount, $t('plural_forms_announcements')) }}
            </div>
          </div>
          <div class="col-12" >
            <component :is="!isMobileBreakpoint ? 'transition-expand' : 'div'">
              <div class="row" v-if="isMobileBreakpoint || !collapsed">
                <div class="col-6 col-lg-2 mb-2 mb-lg-3" v-if="isMobileBreakpoint">
                  <form-select :label="$t('city')" :options="sellOptions.regions" v-model="form.region" has-search />
                </div>
                <div class="col-6 col-lg-2 mb-2 mb-lg-3">
                  <form-select :label="$t('mileage')" custom anchor="right" :suffix="$t('char_kilometre')"
                    :values="{from: form.mileage_from, to: form.mileage_to }"
                    @clear="form.mileage_from = '', form.mileage_to = ''"
                  >
                    <div class="form-merged">
                      <form-numeric-input :placeholder="$t('from')" v-model="form.mileage_from" :suffix="$t('char_kilometre')" />
                      <form-numeric-input :placeholder="$t('to')" v-model="form.mileage_to" :suffix="$t('char_kilometre')" />
                    </div>
                  </form-select>
                </div>
                <div class="col-6 col-lg-2 mb-2 mb-lg-3">
                  <form-select :label="$t('capacity')" custom :suffix="$t('char_sm_cube')"
                    :values="{ from: getOptionValue('MotoCapacity', form.capacity_from), to: getOptionValue('MotoCapacity', form.capacity_to) }"
                    @clear="form.capacity_from = '', form.capacity_to = ''"
                  >
                    <div class="form-merged">
                      <form-select :label="$t('from')" v-model="form.capacity_from" 
                        :options="getMotoCapacityOptions" 
                        :show-label-on-select="false" :clear-option="false" in-select-menu />
                      <form-select :label="$t('to')" v-model="form.capacity_to"
                        :options="getMotoCapacityOptions" 
                        :show-label-on-select="false" :clear-option="false" in-select-menu />
                    </div>
                  </form-select>
                </div>
                <div class="col-6 col-lg-2 mb-2 mb-lg-3">
                  <form-select :label="$t('power')" custom :suffix="$t('char_h_power')"
                    :values="{from: form.power_from, to: form.power_to }"
                    @clear="form.power_from = '', form.power_to = ''"
                  >
                    <div class="form-merged">
                      <form-numeric-input :placeholder="$t('from')" v-model="form.power_from" :suffix="$t('char_h_power')" />
                      <form-numeric-input :placeholder="$t('to')" v-model="form.power_to" :suffix="$t('char_h_power')" />
                    </div>
                  </form-select>
                </div>
                <div :class="['col-6 mb-2 mb-lg-3', ['cylinders','sum_cylinders'].includes(key) ? 'col-lg-3' : 'col-lg-2']"  v-for="(select, key) in getMotoSelectGroup" :key="key">
                  <form-select
                    v-model="form[key]" 
                    :options="motoOptions.config[select].values.filter(value => value.key !== 0)" 
                    :multiple="motoOptions.config[select].multiple && !motoOptions.config[select].not_foreach && key !== 'tacts'" 
                    :name-in-value="motoOptions.config[select].multiple && !motoOptions.config[select].not_foreach && key !== 'tacts'"
                    :label="$t(motoOptions.config[select].placeholder)" 
                    :translate-options="true"
                  />
                </div>
                <div class="col-12 mb-2 mb-lg-0">
                  <color-options v-model="form.colors" hide-matt />
                </div>
              </div>
            </component>
          </div>
        </div>
      </component>
      <div class="row mb-1 mb-lg-0">
        <div class="col-12">
          <div class="row">
            <div class="col-lg-4 offset-lg-8">
              <div class="row">
                <div class="col-6">
                  <button type="button" :class="['btn','full-width','btn--red-outline',{'pointer-events-none': pending}]" @click="resetForm(true)">
                    <icon name="reset" /> {{ $t('clear_search') }}
                  </button>
                </div>
                <div class="col-6">
                  <button type="button" :class="['btn','full-width','btn--green',{pending}]" @click="submitForm">
                    <icon name="search" /> {{ $t('find') }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="collapse-toggle">
        <button type="button" class="btn" @click="collapsed = !collapsed">
          <span>{{ $t(`search_${collapsed ? 'more' : 'less'}`) }}</span>
          <icon :name="`chevron-${collapsed ? 'down' : 'up'}`" />
        </button>
      </div>
    </div>
    <div class="announcements-sorting" v-show="routeName !== 'index' && totalCount">
      <div class="row">
        <div class="col-6 col-lg-auto mt-3 mt-lg-5 mb-n6 mb-lg-n1">
          <div class="form-info no-bg text-green" v-if="isMobileBreakpoint">
            {{ $readPlural(totalCount, $t('plural_forms_announcements')) }}
          </div>
        </div>
        <div class="col-6 col-lg-auto mt-3 mt-lg-5 mb-n6 mb-lg-n1">
          <form-select :label="$t('sorting')" :options="getSortingOptions" v-model="form.sorting"
            @change="submitForm" :allow-clear="false" :clear-option="false" skip-select-first has-no-bg />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

import { SearchMixin } from '~/mixins/search';

import ColorOptions from '~/components/options/ColorOptions';

export default {
  components: { 
    ColorOptions
  },
  mixins: [SearchMixin],
  props: {
    totalCount: {
      type: Number,
      default: 0
    },
    pending: Boolean,
    category: {}
  },
  data() {
    return {
      rows: ['0'],
      form: {
        sorting: 'created_at_desc',
        additional_brands: { 0: {}, 1: {}, 2: {}, 3: {}, 4: {} },
        announce_type: 0,
        currency: 1,
        box: [],
        engine: [],
        drive: [],
        colors: [],
        cylinders: [],
        sum_cylinders: [],
        tacts: [],
        type: [],
        capacity_from: '',
        capacity_to: '',
        min_year: '',
        max_year: '',
        price_from: '',
        price_to: '',
        mileage_from: '',
        mileage_to: '',
        power_to: '',
        power_from: '',
        status: '',
        customs: '',
        region: '',
        exchange_possible: false,
        credit: false
      }
    }
  },
  computed: {
    ...mapGetters(['motoOptions', 'motorcycleModels', 'scooterModels', 'atvModels', 'sellOptions']),

    // meta data
    meta() {
      return {
        type: 'moto',
        path: this.category.type ? '/moto/'+this.$t('slug_'+this.category.type) : '/moto',
        param: 'filter'
      }
    },
    // options
    motoTypes() {
      return [
        { key: 1, name: this.$t('motorcycles') },
        { key: 2, name: this.$t('scooters') },
        { key: 3, name: this.$t('atvs') }
      ]
    },
    // static data
    getMotoSelectGroup() {
      let group = { 
        engine: 'engine', 
        box: 'box',
        drive: 'drive', 
        tacts: 'number_of_vehicles', 
        sum_cylinders: 'cylinders', 
        cylinders: 'cylinder_placement', 
        status: 'used_ones', 
        customs: 'customed_ones' 
      }
      for(let key in group) {
        if (this.category.id) {
          let categories = this.motoOptions.config[group[key]].category;
          if (categories && categories[0] && categories.indexOf(this.category.id) === -1) 
            delete group[key];
        } else {
          if (['drive','tacts','sum_cylinders','cylinders'].includes(key)) 
            delete group[key];
        }
      }
      return group;
    },
    getMotoCapacityOptions() {
      return this.motoOptions?.config.volume.values.map(o => ({
        key: parseInt(o.name), 
        name: o.name.replace(' см³', '')
      }));
    }
  },
  methods: {
    ...mapActions(['getMotoModels']),

    async setCategory(id, index) {
      this.$set(this.form.additional_brands[index], 'category', id);
      this.$set(this.form.additional_brands[index], 'brand', '');
      this.$set(this.form.additional_brands[index], 'model', '');
    },
    async setBrand(id, index) {
      this.$set(this.form.additional_brands[index], 'brand', id);
      this.$set(this.form.additional_brands[index], 'model', '');
      if (id) await this.getMotoModels({ category: this.category.id || this.form.additional_brands[index]['category'], id, index });
    },

    brands(category) {
      return {
        1: this.motoOptions.brands,
        2: this.motoOptions.scooter_brands,
        3: this.motoOptions.atv_brands
      }[parseInt(category) || 1];
    },
    models(category) {
      return {
        1: this.motorcycleModels,
        2: this.scooterModels,
        3: this.atvModels
      }[parseInt(category) || 1];
    },
  }
}
</script>