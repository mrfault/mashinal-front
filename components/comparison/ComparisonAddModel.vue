<template>
  <modal-popup
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
  
    <form>
      <div class="row">
        <div class="col-6 mb-2">
          <form-select
            :label="$t('mark')"
            :options="brands"
            v-model="form.brand"
            @change="brandSelected"
            has-search
          />
        </div>
        <div class="col-6 mb-2">
          <form-select
            :label="$t('model')"
            :options="models"
            v-model="form.model"
            @change="modelSelected"
            has-search
          />
        </div>
        <div class="col-6 mb-2">
          <form-select
            :label="$t('generation')"
            :options="generations"
            v-model="form.generation"
            @change="generationSelected"
            has-search
          />
        </div>
        <div class="col-6 mb-2">
          <form-select
            :label="$t('body_type')"
            :options="carTypes "
            v-model="form.carType"
            @change="carTypeSelected"
            has-search
          />
        </div>
        <div class="col-6">
          <form-select
            :label="$t('modification_and_supply')"
            :options="modifications"
            v-model="form.modification"
            :translateOptions="false"
            has-search
          />
        </div>

        <div class="col-6">
          <button class="btn btn--green full-width" @click.prevent="addToList" v-if="this.form.modification">
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
      if (id) {
        this.form = {
          ...this.form,
          model: null,
          generation: null,
          carType: null,
          modification: null,
        },

        await this.$store.dispatch('comparison/getModels', id);

        if (this.models.length === 1) {
          const id = this.models[0].id;
          this.form.model = id;
          this.modelSelected(id)
        }
      }
    },
    async modelSelected(id) {
      if (id) {
        this.form = {
          ...this.form,
          generation: null,
          carType: null,
          modification: null,
        },

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
      if (id) {
        this.form = {
          ...this.form,
          carType: null,
          modification: null,
        },

        await this.$store.dispatch('comparison/getCarTypes', id);

        if (this.carTypes.length === 1) {
          const id = this.carTypes[0].id;
          this.form.carType = id
          this.carTypeSelected(id)
        }
      }
    },
    async carTypeSelected(id) {
      if (id) {
        this.form = {
          ...this.form,
          modification: null,
        },

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
      const brand = this.brands.find(b => b.id === this.form.brand);
      const model = this.models.find(m => m.id === this.form.model);
      const generation = this.generations.find(g => g.id === this.form.generation);
      const carType = this.carTypes.find(c => c.id === this.form.carType);
      const modification = this.modifications.find(m => m.id === this.form.modification);

      this.$store.dispatch('comparison/addModel', {
        id: modification.id,
        brand,
        model,
        generation,
        carType,
        modification
      })

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