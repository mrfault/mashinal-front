<template>
  <form class="form" @submit.prevent="submitForm" novalidate>
    <div class="row">
      <div class="col-lg-4 mb-2 mb-lg-3">
        <form-buttons :options="getMileageOptions" :group-by="3" v-model="form.announce_type" />
      </div>
      <div class="col-lg-4 offset-md-4 mb-2 mb-lg-3 d-none d-lg-block">
        <div class="row">
          <div class="col-6">
            <nuxt-link class="btn btn--pale-red full-width" :to="$localePath('/')">
              <icon name="options" /> {{ $t('detailed_search') }}
            </nuxt-link>
          </div>
          <div class="col-6">
            <nuxt-link class="btn btn--pale-red full-width" :to="$localePath('/')">
              <icon name="flag" /> {{ $t('helper_search') }}
            </nuxt-link>
          </div>
        </div>
      </div>
      <template v-if="isMobileBreakpoint">
        <div class="col-6 mb-2">
          <form-select :label="$t('mark')" :options="brands" v-model="form.additional_brands[counter[0]]['brand']"
            @change="setBrand($event, counter[0])" />
        </div>
        <div class="col-6 mb-2">
          <form-select :label="$t('model')" :options="array_models[counter[0]]" v-model="form.additional_brands[counter[0]]['model']"
            :disabled="form.additional_brands[counter[0]]['brand'] && !array_models[counter[0]].length" @change="setModel($event, counter[0])" />
        </div>
        <div class="col-6 mb-2">
          <form-select :label="$t('generation')" :options="array_generations[counter[0]]" v-model="form.additional_brands[counter[0]]['generation']"
            :disabled="form.additional_brands[counter[0]]['model'] && !array_generations[counter[0]].length" />
        </div>
      </template>
      <template v-else>
        <div class="col-12 mb-3" v-for="(key, index) in counter" :key="key">
          <div class="row">
            <div class="col-4">
              <form-select :label="$t('mark')" :options="brands" v-model="form.additional_brands[key]['brand']"
                @change="setBrand($event, key)" />
            </div>
            <div class="col-4">
              <form-select :label="$t('model')" :options="array_models[key]" v-model="form.additional_brands[key]['model']"
                :disabled="form.additional_brands[key]['brand'] && !array_models[key].length" @change="setModel($event, key)" />
            </div>
            <div class="col-4">
              <div class="row">
                <div class="col">
                  <form-select :label="$t('generation')" :options="array_generations[key]" v-model="form.additional_brands[key]['generation']"
                    :disabled="form.additional_brands[key]['model'] && !array_generations[key].length" />
                </div>
                <div class="col-auto">
                  <div class="form-counter">
                    <div class="form-info" v-if="counter.length < 5 && index === counter.length - 1" @click="addSearchRow(key)">
                      <icon name="plus" />
                    </div>
                    <div class="form-info" v-if="counter.length > 1" @click="removeSearchRow(key)">
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
              :show-label-on-select="false" :in-select-menu="true" :clear-option="false" />
            <form-select :label="$t('to')" :options="getYearOptions" v-model="form.max_year"
              :show-label-on-select="false" :in-select-menu="true" :clear-option="false" />
          </div>
        </form-select>
      </div>
      <div class="col-6 col-lg-2 mb-2 mb-lg-3">
        <form-select :label="$t('price')" custom 
          :values="{from: form.price_from, to: form.price_to, suffix: getOptionValue('Currency', form.currency) }"
          @clear="form.price_from = '', form.price_to = ''"
        >
          <div class="form-merged">
            <form-numeric-input :placeholder="$t('from')" v-model="form.price_from" />
            <form-numeric-input :placeholder="$t('to')" v-model="form.price_to" />
            <form-select :label="'AZN'" :options="getCurrencyOptions" v-model="form.currency"
              :allow-clear="false" :in-select-menu="true" :clear-option="false" />
          </div>
        </form-select>
      </div>
      <div class="col-6 col-lg-2 mb-2 mb-lg-3">
        <form-select :label="$t('city')" :options="sell_options.regions" v-model="form.region" />
      </div>
      <div class="col-6 col-lg-2 mb-2 mb-lg-3">
        <form-checkbox :label="$t('barter')" v-model="form.exchange_possible" 
          input-name="exchange_possible" icon-name="barter" />
      </div>
      <div class="col-6 col-lg-2 mb-2 mb-lg-3">
        <form-checkbox :label="$t('credit')" v-model="form.credit" 
          input-name="credit" icon-name="percent" />
      </div>
      <div class="col-6 col-lg-2 mb-2 mb-lg-3 d-none d-lg-block">
        <div class="form-info text-green">
          {{ $readPlural(totalCount, $t('plural_forms_announcements')) }}
        </div>
      </div>
      <div class="col-lg-8">
        <div class="row">
          <div class="col-lg-4 mb-2 mb-lg-0">
            <form-checkbox :label="$t('search_save' + (saved ? 'd' : ''))" v-model="saved" input-name="saved" transparent />
          </div>
        </div>
      </div>
      <div class="col-lg-4">
        <div class="row">
          <div class="col-6">
            <button type="submit" class="btn full-width btn--red-outline">
              <icon name="reset" /> {{ $t('clear_search') }}
            </button>
          </div>
          <div class="col-6">
            <button type="submit" class="btn full-width btn--green">
              <icon name="search" /> {{ $t('find') }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </form>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

import { SearchMixin } from '~/mixins/search';

export default {
  mixins: [SearchMixin],
  props: {
    totalCount: {
      type: Number,
      default: 0
    }
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
      saved: false,
      counter: ['0'],
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
        body: [],
        korobka: [],
        engine_type: [],
        gearing: [],
        n_of_seats: [],
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
    ...mapGetters(['brands', 'body_options', 'array_models', 'array_generations', 'sell_options', 'all_sell_options2', 'colors'])
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
      let slug = this.array_models[index].find(option => option.id == id)?.slug || '';
      let brand_slug = this.form.additional_brands[index].brand_slug
      this.$set(this.form.additional_brands[index], 'model', id);
      this.$set(this.form.additional_brands[index], 'model_slug', slug);
      this.$set(this.form.additional_brands[index], 'generation', '');
      await this.getModelGenerationsArray({ value: slug, brand_slug, index });
    }
  }
}
</script>