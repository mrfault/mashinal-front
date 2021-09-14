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
          title: 'Xüsusiyyətlər',
          defaultCollapsed: true,
          items: [
            {
              title: 'Baqaj həcmi min./maks.',
              values: this.models.map(m => this.getTrunkVolume(m.modification || m.modifications.find(mod => mod.id === m.catalog_id))),
            },
            {
              title: 'Yerlərin sayı',
              values: this.models.map(m => this.getSeatCount(m.modification || m.modifications.find(mod => mod.id === m.catalog_id))),
            },
            {
              title: 'Sürətlər qutusu',
              values: this.models.map(m => this.getTransmission(m.modification || m.modifications.find(mod => mod.id === m.catalog_id))),
            },
            {
              title: 'Marka ölkəsi',
              values: this.models.map(m => this.getBrandCountry(m.modification || m.modifications.find(mod => mod.id === m.catalog_id))),
            },
          ]
        },
        {
          title: 'İşlənmə göstəriciləri',
          defaultCollapsed: true,
          items: [
            {
              title: 'Maksimal sürət',
              values: this.models.map(m => this.getMaxSpeed(m.modification || m.modifications.find(mod => mod.id === m.catalog_id))),
            },
            {
              title: 'Sürətlənmə 100 km/saat,s',
              values: this.models.map(m => this.getAcceleration100(m.modification || m.modifications.find(mod => mod.id === m.catalog_id))),
            },
            {
              title: 'Yanacaq sərfiyyatı, şəhər',
              values: this.models.map(m => this.getFuelConsumptionCity(m.modification || m.modifications.find(mod => mod.id === m.catalog_id))),
            },
            {
              title: 'Yanacaq sərfiyyatı, magistral',
              values: this.models.map(m => this.getFuelConsumptionTrack(m.modification || m.modifications.find(mod => mod.id === m.catalog_id))),
            },
            {
              title: 'Yanacaq sərfiyyatı, qarışıq',
              values: this.models.map(m => this.getFuelConsumptionMixed(m.modification || m.modifications.find(mod => mod.id === m.catalog_id))),
            },
            {
              title: 'Yanacaq markası',
              values: this.models.map(m => this.getFuelBrand(m.modification || m.modifications.find(mod => mod.id === m.catalog_id))),
            },
            {
              title: 'Ekoloji sinif',
              values: this.models.map(m => this.getEcoClass(m.modification || m.modifications.find(mod => mod.id === m.catalog_id))),
            },
          ]
        },
        {
          title: 'Ölçülər',
          defaultCollapsed: true,
          items: [
            {
              title: 'Uzunluq',
              values: this.models.map(m => this.getLength(m.modification || m.modifications.find(mod => mod.id === m.catalog_id))),
            },
            {
              title: 'Eni',
              values: this.models.map(m => this.getWidth(m.modification || m.modifications.find(mod => mod.id === m.catalog_id))),
            },
            {
              title: 'Hündürlük',
              values: this.models.map(m => this.getHeight(m.modification || m.modifications.find(mod => mod.id === m.catalog_id))),
            },
            {
              title: 'Təkər bazası',
              values: this.models.map(m => this.getWheelBase(m.modification || m.modifications.find(mod => mod.id === m.catalog_id))),
            },
            {
              title: 'Ön izin eni',
              values: this.models.map(m => this.getFrontWheelWidth(m.modification || m.modifications.find(mod => mod.id === m.catalog_id))),
            },
            {
              title: 'Arxa izin eni',
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