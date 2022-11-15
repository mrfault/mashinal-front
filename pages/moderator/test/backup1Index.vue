<template>
  <div class="container">
    <h1>Moderator</h1>
    <div class="card mb-2">
      <model-options
        key="model"
        :options="brands"
        :title="$t('mark')"
        :status-title="$t('select_model')"
        :input-title="$t('model_name')"
        :value="form.brand"
        :sort-alphabetically="true"
        :img-key="'transformed_media'"
        :img-placeholder="`/logos/car-${colorMode}.svg`"
        :considerPopular="false"
        highlightSelected
      />
    </div>
    <div class="card mb-2">
      <model-options
        key="model"
        :options="models"
        :title="$t('model')"
        :status-title="$t('select_model')"
        :input-title="$t('model_name')"
        :value="form.model"
        :sort-alphabetically="false"
        highlightSelected
      />
    </div>
    <div class="card mb-2">
      <year-options
        :years="sellYears"
        :title="$t('prod_year')"
        :value="form.year"
      />
    </div>
    <div class="card mb-2">
      <sell-select-modification disableScroll :form="form" />
    </div>
    <div class="card mb-2">
      <!-- <color-options v-model="form.color" hide-matt/> -->
    </div>
    <!-- ././././././././././././././ -->
    <div class="card mb-2">
      <h2 class="title-with-line full-width">
        <span>{{ $t('mileage') }}</span>
      </h2>
      <div class="row flex-nowrap">
        <div class="col-auto flex-grow-1">
          <form-text-input
            :placeholder="$t('mileage')"
            v-model="form.mileage"
            type="number"
          />
        </div>
        <div class="col-auto">
          <form-switch
            :options="getMileageOptions"
            v-model="form.mileage_measure"
            @change="updatePreview('mileage_measure')"
          />
        </div>
        <div class="col-auto">
          <div class="col-lg-auto mb-2 mb-lg-0">
            <div class="d-flex flex-wrap flex-lg-nowrap">
              <form-checkbox
                transparent
                :label="$t('is_new')"
                v-model="form.is_new"
                input-name="is_new"
                @change="updateMileage"
              />
              <!-- <form-checkbox
                transparent
                :label="$t('bitie')"
                v-model="form.beaten"
                input-name="beaten"
                has-popover
              >
                <popover
                  class="white-space-pre-wrap-span"
                  :message="
                    $t(
                      'with_significant_damage_to_body_elements_that_do_not_move_on_their_own',
                    )
                  "
                  :width="175"
                />
              </form-checkbox>
              <form-checkbox
                v-if="!user.external_salon"
                transparent
                :label="$t('not_cleared')"
                v-model="form.customs_clearance"
                input-name="customs_clearance"
                @change="
                  removeError('car_number', true),
                    removeError('vin', true),
                    (form.car_number = '')
                "
              />
              <form-checkbox
                v-if="!user.external_salon"
                transparent
                :label="$t('in_garanty')"
                v-model="form.guaranty"
                input-name="guaranty"
              /> -->
            </div>
          </div>
        </div>
      </div>
      <!-- ././././././././////////////////////////////////// -->
      <!-- region -->
      <!-- ././././././././////////////////////////////////// -->

      <template v-if="!isAutosalon && !user.external_salon">
        <h2 class="title-with-line mt-2 mt-lg-3" id="anchor-region_id">
          <span>
            {{ $t('region_and_place_of_inspection') }}
            <span class="star">*</span>
          </span>
        </h2>
        <div class="row">
          <div class="col-lg-4 mb-2 mb-lg-0">
            <form-select
              :label="$t('region')"
              :options="sellOptions.regions"
              v-model="form.region_id"
              has-search
              :invalid="isInvalid('region_id')"
              @change="removeError('region_id'), updatePreview('region')"
              :clear-option="false"
            />
          </div>
          <!-- <div class="col-lg-4 mb-2 mb-lg-0">
            <form-text-input
              :placeholder="$t('address')"
              icon-name="placeholder"
              v-model="form.address"
            />
          </div>
          <div class="col-lg-4 mb-2 mb-lg-0">
            <pick-on-map-button
              :lat="form.lat"
              :lng="form.lng"
              :address="form.address"
              @change-address="updateAddress"
              @change-latlng="updateLatLng"
            >
              <form-text-input
                :placeholder="$t('address')"
                icon-name="placeholder"
                v-model="form.address"
              />
            </pick-on-map-button> -->
          <!-- </div> -->
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import ModelOptions from '~/components/options/ModelOptions'
import YearOptions from '~/components/options/YearOptions'
import SellSelectModification from '~/components/sell/SellSelectModification'
import ColorOptions from '~/components/options/ColorOptions'
import { ToastErrorsMixin } from '~/mixins/toast-errors'
export default {
  components: {
    ModelOptions,
    YearOptions,
    SellSelectModification,
    ColorOptions,
  },
  mixins: [ToastErrorsMixin],
  data() {
    return {
      form: {
        brand: 'bmw',
        model: '3-series',
        year: 2012,
        car_body_type: 18,

        milage: 0,

        generation_id: 4787,
        gearing: '1',
        autogas: true,
        transmission: '3',
        car_catalog_id: 47756,
        modification: '2',
        color: null,
      },
      details: {
        color: null,
        mileage: null,
        mileage_measure: 1,
        part: null,
        is_new: false,
        beaten: false,
        customs_clearance: false,
        guaranty: false,
      },
      files: null,
    }
  },
  computed: {
    ...mapGetters(['brands', 'models', 'sellYears', 'colors', 'sellOptions']),
    getMileageOptions() {
      return [
        { key: 1, name: this.$t('char_kilometre') },
        { key: 2, name: this.$t('char_mile') },
      ]
    },
  },
  methods: {
    getModels() {
      this.$store.dispatch('getModels', this.form.brand)
    },
    getSellYears() {
      this.$store.dispatch('getSellYears', {
        brand: this.form.brand,
        model: this.form.model,
      })
    },
    getColors() {
      console.log('color dispatch')
      this.$store.dispatch('getColors')
    },
    updatePreview(key) {
      if (!key || key === 'region')
        this.setSellPreviewData({
          value: this.sellOptions.regions.find(
            (o) => o.key === this.form.region_id,
          )?.name[this.locale],
          key: 'region',
        })
      if (!key || key === 'price')
        this.setSellPreviewData({ value: this.form.price, key: 'price' })
      if (!key || key === 'currency')
        this.setSellPreviewData({
          value: this.getCurrencyOptions.find(
            (o) => o.key === this.form.currency,
          )?.sign,
          key: 'currency',
        })
      if (!key || key === 'mileage')
        this.setSellPreviewData({ value: this.form.mileage, key: 'mileage' })
      if (!key || key === 'mileage_measure')
        this.setSellPreviewData({
          value: this.getMileageOptions.find(
            (o) => o.key === this.form.mileage_measure,
          )?.name,
          key: 'mileage_measure',
        })
    },
    updateCarDamage(part) {
      this.form.part = part
    },
    updateMileage(is_new) {
      if (!is_new) {
        this.isInvalid('mileage') && this.removeError('mileage')
      } else {
        let mileage = this.form.mileage
        this.form.mileage =
          mileage > (this.form.mileage_measure === 2 ? 310.686 : 500) ||
          !mileage
            ? 0
            : mileage
      }
      this.updatePreview('mileage')
    },
  },
  mounted() {
    this.getModels()
    this.getSellYears()
    this.getColors()
  },
  async asyncData({ store, app }) {
    store.dispatch('setSellPreviewData', { value: {} })
    await Promise.all([
      store.dispatch('getBrands'),
      store.dispatch('getColors'),
      store.dispatch('getOptions'),
      store.dispatch('getAllOtherOptions'),
      store.dispatch('getPopularOptions'),
    ])
  },
}
</script>
