<template>
  <div class="form">
    <div class="card pt-0 pt-lg-4">
      <div class="row">
        <div class="col-lg-4 mb-2 mb-lg-3">
          <form-buttons :options="getMileageOptions" :group-by="3" v-model="form.announce_type" />
        </div>
        <div class="col-lg-4 offset-md-4 mb-2 mb-lg-3 d-none d-lg-block">
          <div class="row">
            <div class="col-6">
              <nuxt-link custom :to="$localePath('/cars/advanced-search')" v-slot="{ href, isActive }">
                <a :href="href" class="btn btn--pale-red full-width" :class="{'active': isActive}" @click.prevent="goToSearch(href)">
                  <icon name="options" /> {{ $t('advanced_search') }}
                </a>
              </nuxt-link>
            </div>
            <div class="col-6">
              <nuxt-link class="btn btn--pale-red full-width" :to="$localePath('/cars/assistant')">
                <icon name="flag" /> {{ $t('helper_search') }}
              </nuxt-link>
            </div>
          </div>
        </div>
        <template v-if="isMobileBreakpoint">
          <div class="col-6 mb-2">
            <form-select :label="$t('mark')" :options="brands" v-model="form.additional_brands[rows[0]]['brand']"
              @change="setBrand($event, rows[0])" has-search/>
          </div>
          <div class="col-6 mb-2">
            <form-select :label="$t('model')" :options="carModels[rows[0]]" v-model="form.additional_brands[rows[0]]['model']"
              :disabled="form.additional_brands[rows[0]]['brand'] && !carModels[rows[0]].length" @change="setModel($event, rows[0])" has-search />
          </div>
          <div class="col-6 mb-2">
            <form-select :label="$t('generation')" :options="carGenerations[rows[0]]" v-model="form.additional_brands[rows[0]]['generation']"
              :disabled="form.additional_brands[rows[0]]['model'] && !carGenerations[rows[0]].length" has-search />
          </div>
        </template>
        <template v-else>
          <div class="col-12 mb-3" v-for="(key, index) in rows" :key="key">
            <div class="row">
              <div class="col-4">
                <form-select :label="$t('mark')" :options="brands" v-model="form.additional_brands[key]['brand']"
                  @change="setBrand($event, key)" has-search />
              </div>
              <div class="col-4">
                <form-select :label="$t('model')" :options="carModels[key]" v-model="form.additional_brands[key]['model']"
                  :disabled="form.additional_brands[key]['brand'] && !carModels[key].length" @change="setModel($event, key)" has-search />
              </div>
              <div class="col-4">
                <div class="row">
                  <div class="col">
                    <form-select :label="$t('generation')" :options="carGenerations[key]" v-model="form.additional_brands[key]['generation']"
                      :disabled="form.additional_brands[key]['model'] && !carGenerations[key].length" has-search />
                  </div>
                  <div class="col-auto">
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
          </div>
        </template>
        <div class="col-6 col-lg-2 mb-2 mb-lg-3">
          <form-select :label="$t('years')" custom 
            :values="{from: form.min_year, to: form.max_year, read: false }"
            @clear="form.min_year = '', form.max_year = ''"
          >
            <div class="form-merged">
              <form-select :label="$t('from')" :options="getYearOptions" v-model="form.min_year" 
                :show-label-on-select="false" :clear-option="false" in-select-menu />
              <form-select :label="$t('to')" :options="getYearOptions" v-model="form.max_year"
                :show-label-on-select="false" :clear-option="false" in-select-menu />
            </div>
          </form-select>
        </div>
        <div class="col-12 col-lg-8">
          <component :is="isMobileBreakpoint && !advanced ? 'transition-expand' : 'div'">
            <div class="row" v-if="!isMobileBreakpoint || advanced || !collapsed">
              <div class="col-6 col-lg-3 mb-2 mb-lg-3">
                <form-select :label="$t('price')" custom 
                  :values="{from: form.price_from, to: form.price_to, suffix: getOptionValue('Currency', form.currency) }"
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
              <div class="col-6 col-lg-3 mb-2 mb-lg-3">
                <form-select :label="$t('city')" :options="sellOptions.regions" v-model="form.region" />
              </div>
              <div class="col-6 col-lg-3 mb-2 mb-lg-3">
                <form-checkbox :label="$t('barter')" v-model="form.exchange_possible" 
                  input-name="exchange_possible" icon-name="barter" />
              </div>
              <div class="col-6 col-lg-3 mb-2 mb-lg-3">
                <form-checkbox :label="$t('credit')" v-model="form.credit" 
                  input-name="credit" icon-name="percent" />
              </div>
            </div>
          </component>
        </div>
        <template v-if="advanced">
          <div class="col-6 col-lg-2 mb-2 mb-lg-3">
            <form-select :label="$t('mileage')" custom anchor="right"
              :values="{from: form.mileage_from, to: form.mileage_to, suffix: $t('char_kilometre') }"
              @clear="form.mileage_from = '', form.mileage_to = ''"
            >
              <div class="form-merged">
                <form-numeric-input :placeholder="$t('from')" v-model="form.price_from" :suffix="$t('char_kilometre')" />
                <form-numeric-input :placeholder="$t('to')" v-model="form.price_to" :suffix="$t('char_kilometre')" />
              </div>
            </form-select>
          </div>
          <div class="col-6 col-lg-2 mb-2 mb-lg-3">
            <form-select :label="$t('dvigatel')" v-model="form.engine_type" 
              :options="bodyOptions.main.default_options['tip-dvigatelya'].values"
              multiple name-in-value translate-options />
          </div>
          <div class="col-6 col-lg-2 mb-2 mb-lg-3">
            <form-select :label="$t('korobka')" v-model="form.korobka" 
              :options="bodyOptions.main.default_options['korobka'].values"
              multiple name-in-value translate-options />
          </div>
          <div class="col-6 col-lg-2 mb-2 mb-lg-3">
            <form-select :label="$t('carcase')" v-model="form.body" 
              :options="bodyOptions.main.default_options['body'].values"
              multiple name-in-value translate-options />
          </div>
          <div class="col-6 col-lg-2 mb-2 mb-lg-3">
            <form-select :label="$t('privod')" v-model="form.gearing" 
              :options="bodyOptions.main.default_options['privod'].values"
              multiple name-in-value translate-options />
          </div>
          <div class="col-6 col-lg-2 mb-2 mb-lg-3">
            <form-select :label="$t('damage')" v-model="form.damage" :options="getDamageOptions"
              :show-label-on-select="false" />
          </div>
          <div class="col-6 col-lg-2 mb-2 mb-lg-3">
            <form-select :label="$t('customs')" v-model="form.customs" :options="getCustomsOptions"
              :show-label-on-select="false" />
          </div>
          <div class="col-6 col-lg-2 mb-2 mb-lg-3">
            <form-select :label="$t('capacity')" custom 
              :values="{from: form.min_capacity, to: form.max_capacity, suffix: $t('char_litre'), showLabel: true }"
              @clear="form.min_capacity = '', form.max_capacity = ''"
            >
              <div class="form-merged">
                <form-select :label="$t('from')" v-model="form.min_capacity" 
                  :options="bodyOptions.main.custom_options['capacity'].values" 
                  :show-label-on-select="false" :clear-option="false" in-select-menu :suffix="$t('char_litre')" />
                <form-select :label="$t('to')" v-model="form.max_capacity"
                  :options="bodyOptions.main.custom_options['capacity'].values" 
                  :show-label-on-select="false" :clear-option="false" in-select-menu :suffix="$t('char_litre')" />
              </div>
            </form-select>
          </div>
          <div class="col-6 col-lg-2 mb-2 mb-lg-3">
            <form-select :label="$t(allSellOptions2.n_of_seats.placeholder)" v-model="form.n_of_seats" 
              multiple name-in-value translate-options :options="allSellOptions2.n_of_seats.options" />
          </div>
          <div class="col-6 col-lg-2 mb-2 mb-lg-3">
            <form-checkbox :label="$t('in_garanty')" v-model="form.in_garanty" 
              input-name="in_garanty" />
          </div>
          <div class="col-6 col-lg-2 mb-2 mb-lg-3">
            <form-checkbox :label="$t('with_video')" v-model="form.with_video" 
              input-name="with_video" />
          </div>
          <div class="col-12">
            <color-options v-model="form.colors" :matt="form.is_matte" @changeMatt="form.is_matte = $event" />
          </div>
        </template>
        <div class="col-6 col-lg-2 mb-2 mb-lg-3 d-none d-lg-block" v-if="!advanced && !assistant">
          <div class="form-info text-green">
            {{ $readPlural(totalCount, $t('plural_forms_announcements')) }}
          </div>
        </div>
        <div class="col-12">
          <div class="row flex-column-reverse flex-lg-row">
            <div class="col-lg-8">
              <div class="row" v-show="searchApplied">
                <div class="col-lg-4 mt-2 mt-lg-0">
                  <form-checkbox :label="$t('search_save')" v-model="savedSearch" 
                    input-name="savedSearch" transparent :disabled="!loggedIn" @try="$nuxt.$emit('login-popup', 'saved-search')" />
                </div>
              </div>
            </div>
            <div class="col-lg-4">
              <div :class="['row', {'mb-1 mb-lg-0': !searchApplied && !(advanced || assistant)}]">
                <div class="col-6">
                  <button type="button" :class="['btn','full-width','btn--red-outline',{'pointer-events-none': pending}]" @click="resetForm(!(advanced || assistant))">
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
      <div class="collapse-toggle" v-if="isMobileBreakpoint && !(advanced || assistant)">
        <button type="button" class="btn btn-circle" @click="collapsed = !collapsed">
          <icon :name="`chevron-${collapsed ? 'down' : 'up'}`" />
        </button>
      </div>
    </div>
    <div class="announcements-sorting" v-show="!isStarterPage && totalCount && !(advanced || assistant)">
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
    advanced: Boolean,
    assistant: Boolean
  },
  data() {
    let brand = { 
      brand: '', 
      brand_slug: '', 
      model: '', 
      model_slug: '', 
      generation: '' 
    };
    return {
      meta: {
        type: 'cars',
        path: '/cars',
        param: 'car_filter'
      },
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
        all_options: {},
        announce_type: 1,
        currency: 1,
        min_capacity: '',
        max_capacity: '',
        min_year: '',
        max_year: '',
        price_from: '',
        price_to: '',
        mileage_from: '',
        mileage_to: '',
        region: '',
        damage: '',
        customs: '',
        body: [],
        korobka: [],
        engine_type: [],
        gearing: [],
        n_of_seats: [],
        colors: [],
        is_matte: false,
        in_garanty: false,
        with_video: false,
        exchange_possible: false,
        credit: false
      }
    }
  },
  computed: {
    ...mapGetters(['brands', 'carModels', 'carGenerations', 'bodyOptions', 'sellOptions', 'allSellOptions2'])
  },
  methods: {
    ...mapActions(['getModelsArray', 'getModelGenerationsArray']),

    async setBrand(id, index) {
      let slug = this.brands.find(option => option.id == id)?.slug || '';
      this.$set(this.form.additional_brands[index], 'brand', id);
      this.$set(this.form.additional_brands[index], 'brand_slug', slug);
      this.$set(this.form.additional_brands[index], 'model', '');
      this.$set(this.form.additional_brands[index], 'model_slug', '');
      this.$set(this.form.additional_brands[index], 'generation', '');
      await this.getModelsArray({ value: slug, index });
    },
    async setModel(id, index) {
      let slug = this.carModels[index].find(option => option.id == id)?.slug || '';
      let brand_slug = this.form.additional_brands[index].brand_slug
      this.$set(this.form.additional_brands[index], 'model', id);
      this.$set(this.form.additional_brands[index], 'model_slug', slug);
      this.$set(this.form.additional_brands[index], 'generation', '');
      await this.getModelGenerationsArray({ value: slug, brand_slug, index });
    }
  },
  created() {
    if(this.routeName === 'index') 
      this.$nuxt.$on('logo-click', this.resetForm);
    if(!this.advanced) {
      ['min_capacity','max_capacity','mileage_from','mileage_to','damage','customs']
        .map(key => { this.$set(this.form, key, ''); });
      ['body','korobka','engine_type','gearing','n_of_seats','colors']
        .map(key => { this.$set(this.form, key, []); });
      ['is_matte','in_garanty','with_video']
        .map(key => { this.$set(this.form, key, false); });
      ['all_options']
        .map(key => { this.$set(this.form, key, {}); });
    }
  },
  beforeDestroy() {
    if(this.routeName === 'index') 
      this.$nuxt.$off('logo-click', this.resetForm);
  }
}
</script>