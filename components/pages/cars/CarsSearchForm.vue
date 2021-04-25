<template>
  <form class="form" @submit.prevent="submitForm" novalidate>
    <div class="row">
      <div class="col-lg-4"></div>
      <div class="col-lg-4">
        <div class="row mb-3">
          <div class="col-6"></div>
          <div class="col-6">
            <form-checkbox :label="$t('barter')" input-name="exchange_possible" icon-name="barter" v-model="form.exchange_possible" />
          </div>
        </div>
      </div>
      <div class="col-lg-4">
        <div class="row mb-3">
          <div class="col-6">
            <form-checkbox :label="$t('credit')" input-name="credit" icon-name="percent" v-model="form.credit" />
          </div>
          <div class="col-6"></div>
        </div>
      </div>
      <div class="col-lg-8">
      </div>
      <div class="col-lg-4">
        <div class="row">
          <div class="col-6"></div>
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
  data() {
    let brand = { 
      brand: '', 
      brand_slug: '', 
      model: '', 
      model_slug: '', 
      generation: '' 
    };
    return {
      searchType: 'cars',
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
    resetForm() {
      this.setFormData({});
      this.submitForm();
    },
    submitForm() {
      // tracking
      this.fbTrack('Search Api');
      this.gtagTrack('AW-600951956/Qeu4CILAyPIBEJSZx54C');
      // update route query params and search announcements
      let queryUrl = `${this.$localePath('/cars')}?car_filter=${encodeURI(JSON.stringify(this.getFormData()))}`;
      this.$router.push(queryUrl);
      this.$emit('submit');
    }
  },
  created() {
    this.setFormData(JSON.parse(this.$route.query.car_filter || '{}'));
  }
}
</script>