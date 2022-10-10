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
      <pre>
      {{ form }}

      </pre>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import ModelOptions from '~/components/options/ModelOptions'
import YearOptions from '~/components/options/YearOptions'
import SellSelectModification from '~/components/sell/SellSelectModification'

export default {
  components: {
    ModelOptions,
    YearOptions,
    SellSelectModification,
  },
  data() {
    return {
      form: {
        brand: 'bmw',
        model: '3-series',
        year: 2012,
        car_body_type: 18,
        generation_id: 4787,
        gearing: '1',
        autogas: true,
        transmission: '3',
        car_catalog_id: 47756,
        modification: '2',
      },
    }
  },
  computed: {
    ...mapGetters(['brands', 'models', 'sellYears']),
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
  },
  mounted() {
    this.getModels()
    this.getSellYears()
  },
  async asyncData({ store, app }) {
    store.dispatch('setSellPreviewData', { value: {} })
    await Promise.all([
      store.dispatch('getBrands'),
      store.dispatch('getOptions'),
      store.dispatch('getColors'),
      store.dispatch('getAllOtherOptions'),
      store.dispatch('getPopularOptions'),
    ])
  },
}
</script>

<style></style>
