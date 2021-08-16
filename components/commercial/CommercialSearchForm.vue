<template>
  <div class="commercial-search-form form">
    <div class="card pt-2 pt-lg-4">
      <div class="row">
        <div class="col-lg-4 mb-2 mb-lg-3">
          <form-buttons :options="getMileageOptions" :group-by="3" v-model="form.announce_type" />
        </div>
      </div>
      <div class="row" v-for="(key, index) in rows" :key="key">
        <div class="col-6 col-lg-4 mb-2">
          <form-select :label="$t('mark')" :options="commercialBrands" v-model="form.additional_brands[key]['brand']"
            @change="setBrand($event, key)" has-search/>
        </div>
        <div class="col-6 col-lg-4 mb-2 mb-lg-3">
          <div class="row">
            <div :class="['col', {'col-12': isMobileBreakpoint}]">
              <form-select :label="$t('model')" :options="commercialModels[key]" v-model="form.additional_brands[key]['model']"
                :disabled="form.additional_brands[key]['brand'] && !commercialModels[key].length" has-search />
            </div>
            <div class="col-auto" v-if="!isMobileBreakpoint">
              <div class="form-counter">
                <div class="form-info" v-if="rows.length < 5 && index === rows.length - 1" @click="addSearchRow(key)">
                  <icon name="plus" />
                </div>
                <div class="form-info" v-if="rows.length > 1" @click="removeSearchRow(key)">
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
              :values="{from: form.year_from, to: form.year_to, read: false }"
              @clear="form.year_from = '', form.year_to = ''"
            >
              <div class="form-merged">
                <form-select :label="$t('from')" :options="getYearOptions" v-model="form.year_from" 
                  :show-label-on-select="false" :clear-option="false" in-select-menu />
                <form-select :label="$t('to')" :options="getYearOptions" v-model="form.year_to"
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
          <div class="col-12">
            <component :is="!isMobileBreakpoint ? 'transition-expand' : 'div'">
              <div class="row" v-if="isMobileBreakpoint || !collapsed">
                <div class="col-12">
                  <commercial-filters :values="form" @change-filter="setCommercialFilter">
                    <div class="col-6 col-lg-2 mb-2 mb-lg-3" v-if="isMobileBreakpoint">
                      <form-select :label="$t('city')" :options="sellOptions.regions" v-model="form.region" has-search />
                    </div>
                  </commercial-filters>
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
        <button type="button" class="btn btn-circle" @click="collapsed = !collapsed">
          <icon :name="`chevron-${collapsed ? 'down' : 'up'}`" />
        </button>
      </div>
    </div>
    <div class="announcements-sorting" v-show="!isStarterPage && totalCount">
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

import CommercialFilters from '~/components/commercial/CommercialFilters';
import ColorOptions from '~/components/options/ColorOptions';

export default {
  components: { 
    CommercialFilters,
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
    let brand = { 
      brand: '', 
      model: ''
    };
    return {
      rows: ['0'],
      form: {
        sorting: 'created_at_desc',
        additional_brands: {
          0: {...brand}, 
          1: {...brand}, 
          2: {...brand}, 
          3: {...brand}, 
          4: {...brand}
        },
        com_type: this.category.id,
        announce_type: 0,
        currency: 1,
        year_from: '',
        year_to: '',
        price_from: '',
        price_to: '',
        colors: [],
        customs: '',
        status: '',
        region: '',
        exchange_possible: false,
        credit: false
      }
    }
  },
  computed: {
    ...mapGetters(['commercialBrands', 'commercialModels', 'sellOptions']),

    // meta data
    meta() {
      return {
        type: 'commercial',
        path: '/commercial/'+this.$t('slug_'+this.category.type),
        param: 'filter'
      }
    }
  },
  methods: {
    ...mapActions(['getCommercialModels']),

    async setBrand(id, index) {
      this.$set(this.form.additional_brands[index], 'brand', id);
      this.$set(this.form.additional_brands[index], 'model', '');
      if (id) await this.getCommercialModels({ category: this.category.id, id, index });
    },
    setCommercialFilter(key, value) {
      if (value === false || value === '' || (typeof value === 'object' && !Object.keys(value).length)) {
        this.$delete(this.form, key);
      } else this.$set(this.form, key, value);
    }
  }
}
</script>