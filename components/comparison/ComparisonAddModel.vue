<template>
  <modal-popup
    v-if="showModal"
    backdropClass="comparison-add-model-popup--backdrop"
    modalClass="comparison-add-model-popup"
    :toggle="showModal"
    :title="$t('add_car_model')"
    @close="showModal = false"
    :overflowHidden="false"
  >
    <img
      v-if="image"
      class="car-image"
      :src="image"
      alt=""
    />
  
    <form @submit.prevent >
      <div class="row">
        <div class="col-12 col-lg-6 mb-2 mb-lg-3">
          <form-select
            :label="$t('mark')"
            :options="brands"
            v-model="form.brand"
            @change="brandSelected"
            has-search
            :clear-option="false"
            :check-options-offset="true"
          />
        </div>
        <div class="col-12 col-lg-6 mb-2 mb-lg-3">
          <form-select
            :label="$t('model')"
            :options="models"
            v-model="form.model"
            @change="modelSelected"
            has-search
            :clear-option="false"
            :check-options-offset="true"
          />
        </div>
        <div class="col-12 col-lg-6 mb-2 mb-lg-3">
          <form-select
            :label="$t('generation')"
            :options="generations"
            v-model="form.generation"
            @change="generationSelected"
            has-search
            :clear-option="false"
            :check-options-offset="true"
          />
        </div>
        <div class="col-12 col-lg-6 mb-2 mb-lg-3">
          <form-select
            :label="$t('body_type')"
            :options="carTypes "
            v-model="form.carType"
            @change="carTypeSelected"
            has-search
            :clear-option="false"
            :check-options-offset="true"
          />
        </div>
        <div class="col-12 col-lg-6 mb-2 mb-lg-3">
          <form-select
            :label="$t('modification_and_supply')"
            :options="modifications"
            v-model="form.modification"
            :translateOptions="false"
            has-search
            :clear-option="false"
            :check-options-offset="true"
          />
        </div>

        <div class="col-12 col-lg-6">
          <button
            class="btn btn--green full-width"
            :class="{'disabled': !this.form.modification}"
            :disabled="!this.form.modification"
            @click.prevent="addToList"
          >
            {{ $t('add') }}
          </button>
        </div>
      </div>
    </form>
  </modal-popup>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  async fetch() {
    await this.$store.dispatch('comparison/getBrands')
  },
  data() {
    return {
      form: {
        brand: null,
        model: null,
        generation: null,
        carType: null,
        modification: null,
      },
      image: null
    }
  },
  computed: {
    ...mapGetters({
      brands: 'comparison/brands',
      models: 'comparison/models',
      generations: 'comparison/generations',
      carTypes: 'comparison/carTypes'
    }),
    showModal: {
      get() {
        return this.$store.getters['comparison/showAddModelPopup']
      },
      set(value) {
        return this.$store.commit('comparison/mutate', {
          property: 'showAddModelPopup',
          value
        })
      }
    },
    getBrand() {
      return this.brands.find(option => option.id === this.form.brand)?.slug || '';
    },
    getModel() {
      return this.models.find(option => option.id == this.form.model)?.slug || '';
    },
    getGeneration() {
      return this.form.generation;
    },
    modifications() {
      return this.$store.getters['comparison/modifications'].map(mod => {
        const name = `${ mod.main[" "]['obem'] ? mod.main[" "]['obem'] : ''} 
          ${ mod.main[" "]['box'] ? this.$t(this.$t('box_values')[mod.main[" "]['box']]) : '' } 
          ${ this.power(mod)? ' (' + this.power(mod) + ') '  : ''} 
          ${ mod.main["  "]['engine'] ? this.$t('engine_values')[mod.main["  "]['engine']] : ''} `

        return {
          ...mod,
          name
        }
      })
    }
  },
  methods: {
    async brandSelected(id) {
      this.form = {
        ...this.form,
        model: null,
        generation: null,
        carType: null,
        modification: null,
      }

      this.$store.commit('comparison/mutate', { property: 'models', value: [] });
      this.$store.commit('comparison/mutate', { property: 'generations', value: [] });
      this.$store.commit('comparison/mutate', { property: 'carTypes', value: [] });
      this.$store.commit('comparison/mutate', { property: 'modifications', value: [] });

      if (id) {
        await this.$store.dispatch('comparison/getModels', id);

        if (this.models.length === 1) {
          const id = this.models[0].id;
          this.form.model = id;
          this.modelSelected(id)
        }
      }
    },
    async modelSelected(id) {
      this.form = {
        ...this.form,
        generation: null,
        carType: null,
        modification: null,
      }

      this.$store.commit('comparison/mutate', { property: 'generations', value: [] })
      this.$store.commit('comparison/mutate', { property: 'carTypes', value: [] })
      this.$store.commit('comparison/mutate', { property: 'modifications', value: [] });


      if (id) {
        this.image = this.models.find(model => model.id === id).transformed_media;
        await this.$store.dispatch('comparison/getGenerations', id);

        if (this.generations.length === 1) {
          const id = this.generations[0].id;
          this.form.generation = id
          this.generationSelected(id)
        }
      }
    },
    async generationSelected(id) {
      this.form = {
        ...this.form,
        carType: null,
        modification: null,
      }

      this.$store.commit('comparison/mutate', { property: 'carTypes', value: [] })
      this.$store.commit('comparison/mutate', { property: 'modifications', value: [] });

      if (id) {
        await this.$store.dispatch('comparison/getCarTypes', id);

        if (this.carTypes.length === 1) {
          const id = this.carTypes[0].id;
          this.form.carType = id
          this.carTypeSelected(id)
        }
      }
    },
    async carTypeSelected(id) {
      this.form = {
        ...this.form,
        modification: null,
      }

      this.$store.commit('comparison/mutate', { property: 'modifications', value: [] });

      if (id) {
        await this.$store.dispatch('comparison/getModifications', {
          car_type_id: id,
          generation_id: this.form.generation,
        });

        if (this.modifications.length === 1) {
          const id = this.modifications[0].id;
          this.form.modification = id
        }
      }
    },
    power(item) {
      if (!item['main']) {return false;}
      let txt = item['main']? item['main']["  "]['moshchnost'] : '';
      return txt + this.$t('l.s.');
    },
    addToList() {
      this.$store.dispatch('comparison/addModel', this.form.modification)

      this.showModal = false;
      this.image = null;
      this.form = {
        brand: null,
        model: null,
        generation: null,
        carType: null,
        modification: null,
      }
    }
  }
}
</script>