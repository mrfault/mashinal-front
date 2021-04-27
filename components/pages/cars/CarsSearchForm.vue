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
      <div class="col-6 col-lg-2 mb-2 mb-lg-3">
        <form-select :label="$t('years')" custom 
          :values="{from: form.min_year, to: form.max_year, read: false }"
          @clear="form.min_year = '', form.max_year = ''"
        >
          <div class="form-merged">
            <form-select :label="$t('from')" :options="getYearOptions" v-model="form.min_year" 
              :show-label-on-select="false" />
            <form-select :label="$t('to')" :options="getYearOptions" v-model="form.max_year"
              :show-label-on-select="false" />
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
              :allow-clear="false" />
          </div>
        </form-select>
      </div>
      <div class="col-6 col-lg-2 mb-2 mb-lg-3">
        <form-select :label="$t('city')" :options="sell_options.regions" v-model="form.region"
          :clear-option="true" />
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
      </div>
      <div class="col-lg-4">
        <div class="row">
          <div class="col-6">
            <button type="submit" class="btn full-width btn--red">
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
  }
}
</script>