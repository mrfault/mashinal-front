<template>
  <div>
    <!-- Models -->
    <div class="comparison__items">
      <!-- Model list -->
      <div
        class="comparison__item"
        v-for="model in models"
        :key="model.id"
      >
        <div
          class="comparison__item__image"
          :style="`background-image: url(${model.model.transformed_media})`"
        >
          <div class="action-button action-button--close" @click="removeItem(model.id)">
            <icon name="cross" />
          </div>
        </div>
        <div class="comparison__item__title">{{ getModelTitle(model) }}</div>
        <div class="comparison__item__desc" v-for="desc in getModelDescription(model)" :key="desc">
          {{ desc }}
        </div>
      </div>
      
      <!-- Recommended model -->
      <div
        class="comparison__item"
        v-if="recommendedModelVisible"
      >
        <div
          class="comparison__item__image"
          :style="`background-image: url(${recommendedModel.model.transformed_media})`"
        >
          <div
            v-if="models.length"
            class="action-button action-button--close" 
            @click="removeRecommendedModel"
          >
            <icon name="cross" />
          </div>
          <div
            class="action-button action-button--recommend"
            @click="updateRecommendation"
          >
            <icon name="refresh" />
          </div>
          <div
            class="action-button action-button--select"
            @click="selectModel(recommendedModel.catalog_id)"
          >
            <icon name="cursor" />
          </div>
        </div>
        <div class="comparison__item__title">{{ getModelTitle(recommendedModel) }}</div>
        <div class="comparison__item__desc" v-for="desc in getModelDescription(recommendedModel)" :key="desc">
          {{ desc }}
        </div>
      </div>
    </div>

    <!-- Specifications -->
    <div class="comparison__specifications" v-if="models.length">
      <h2 class="title-with-line full-width">
        <span>{{ $t('characteristics') }}</span>
      </h2>

      <template v-for="(collapse, cIndex) in collapses">
        <collapse-content
          :key="cIndex"
          :title="collapse.title"
          :first-collapsed="collapse.defaultCollapsed"
        >
          <div v-for="(specification, sindex) in filteredSpecs(collapse.items)" :key="sindex">
            <h4 class="collapse-content__title">
              {{ specification.title }}
            </h4>

            <div class="collapse-content__columns" >
              <div v-for="(model, mIndex) in modelsForSpecs" :key="model.id_unique" class="collapse-content__column" >
                <p>{{ specification.values[mIndex] }}</p>
              </div>
            </div>
            <hr v-if="sindex < filteredSpecs(collapse.items).length - 1" :key="'hr'+sindex">
          </div>

        </collapse-content>
        <hr v-if="cIndex < collapses.length - 1" :key="'hr'+cIndex">
      </template>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { ComparisonMixin } from '~/mixins/comparison'
import CollapseContent from '~/components/elements/CollapseContent';

export default {
  mixins: [ComparisonMixin],
  components:{
    CollapseContent
  },
  data() {
    return {
      showRecommendation: true
    }
  },
  async fetch() {
    await this.$store.dispatch('comparison/getInitialRecommendation')
  },
  methods: {
    removeItem(id) {
      this.$store.dispatch('comparison/removeModel', id)
    },
    updateRecommendation() {
      this.$store.dispatch('comparison/updateRecommendation')
    },
    selectModel(id) {
      this.$store.dispatch('comparison/selectModel', id)

      this.updateRecommendation()
    },
    removeRecommendedModel() {
      this.showRecommendation = false
    }
  },
  computed: {
    ...mapGetters({
      models: 'comparison/modelsList',
      filter: 'comparison/filter',
      recommendedModel: 'comparison/recommendedModel',
    }),
    collapses() {
      return [
        {
          title: this.$t('characteristics'),
          defaultCollapsed: true,
          items: [
            {
              title: this.$t('luggage_volume_min_max'),
              values: this.models.map(m => this.getTrunkVolume(m.modification || m.modifications.find(mod => mod.id === m.catalog_id))),
            },
            {
              title: this.$t('seat_count'),
              values: this.models.map(m => this.getSeatCount(m.modification || m.modifications.find(mod => mod.id === m.catalog_id))),
            },
            {
              title: this.$t('box'),
              values: this.models.map(m => this.getTransmission(m.modification || m.modifications.find(mod => mod.id === m.catalog_id))),
            },
            {
              title: this.$t('brand_country'),
              values: this.models.map(m => this.getBrandCountry(m.modification || m.modifications.find(mod => mod.id === m.catalog_id))),
            },
          ]
        },
        {
          title: this.$t('ekspluatatsionnye-pokazateli'),
          defaultCollapsed: true,
          items: [
            {
              title: 'Maksimal sürət',
              title: this.$t('max_speed'),
              values: this.models.map(m => this.getMaxSpeed(m.modification || m.modifications.find(mod => mod.id === m.catalog_id))),
            },
            {
              title: this.$t('razgon-do-100-kmch-s'),
              values: this.models.map(m => this.getAcceleration100(m.modification || m.modifications.find(mod => mod.id === m.catalog_id))),
            },
            {
              title: this.$t('fuel_consumption_city'),
              values: this.models.map(m => this.getFuelConsumptionCity(m.modification || m.modifications.find(mod => mod.id === m.catalog_id))),
            },
            {
              title: this.$t('fuel_consumption_highway'),
              values: this.models.map(m => this.getFuelConsumptionTrack(m.modification || m.modifications.find(mod => mod.id === m.catalog_id))),
            },
            {
              title: this.$t('fuel_consumption_mixed'),
              values: this.models.map(m => this.getFuelConsumptionMixed(m.modification || m.modifications.find(mod => mod.id === m.catalog_id))),
            },
            {
              title: this.$t('fuel_type'),
              values: this.models.map(m => this.getFuelBrand(m.modification || m.modifications.find(mod => mod.id === m.catalog_id))),
            },
            {
              title: 'Ekoloji sinif',
              title: this.$t('ekologicheskiy-klass'),
              values: this.models.map(m => this.getEcoClass(m.modification || m.modifications.find(mod => mod.id === m.catalog_id))),
            },
          ]
        },
        {
          title: this.$t('dimensions'),
          defaultCollapsed: true,
          items: [
            {
              title: 'Uzunluq',
              title: this.$t('dimensions'),
              values: this.models.map(m => this.getLength(m.modification || m.modifications.find(mod => mod.id === m.catalog_id))),
            },
            {
              title: 'Eni',
              title: this.$t('width'),
              values: this.models.map(m => this.getWidth(m.modification || m.modifications.find(mod => mod.id === m.catalog_id))),
            },
            {
              title: 'Hündürlük',
              title: this.$t('height'),
              values: this.models.map(m => this.getHeight(m.modification || m.modifications.find(mod => mod.id === m.catalog_id))),
            },
            {
              title: 'Təkər bazası',
              title: this.$t('kolesnaya-baza'),
              values: this.models.map(m => this.getWheelBase(m.modification || m.modifications.find(mod => mod.id === m.catalog_id))),
            },
            {
              title: 'Ön izin eni',
              title: this.$t('shirina-peredney-kolei'),
              values: this.models.map(m => this.getFrontWheelWidth(m.modification || m.modifications.find(mod => mod.id === m.catalog_id))),
            },
            {
              title: 'Arxa izin eni',
              title: this.$t('shirina-zadney-kolei'),
              values: this.models.map(m => this.getRearWheelWidth(m.modification || m.modifications.find(mod => mod.id === m.catalog_id))),
            },
          ]
        },
      ]
    },
    recommendedModelVisible() {
      return this.recommendedModel && this.showRecommendation
    },
    modelsForSpecs() {
      if (this.recommendedModelVisible) {
        return [...this.models, {}]
      } else {
        return this.models
      }
    }
  },
  watch: {
    models(val) {
      if (val.length === 0) {
        this.showRecommendation = true
      }
    }
  }
}
</script>