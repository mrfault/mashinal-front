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
      <color-options v-model="colors" />
    </div>
    <!-- ././././././././././././././ -->
    <div class="card mb-2">
      <h2 class="title-with-line full-width">
        <span>{{ $t('seller_comment') }}</span>
      </h2>
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
      files: null,
    }
  },
  computed: {
    ...mapGetters(['brands', 'models', 'sellYears', 'colors', 'sellOptions']),
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
