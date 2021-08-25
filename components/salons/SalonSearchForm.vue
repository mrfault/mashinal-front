<template>
  <div class="salon-filters-form form">
    <div class="card with-btns">
      <div class="card-btns">
        <form-buttons :options="getMileageOptions" :group-by="3" v-model="form.announce_type" 
          btn-class="pale-red-outline btn--merged" row-class="no-gutters" @change="searchAutosalons()" />
      </div>
      <div class="row mb-n2 mb-lg-n3">
        <div class="col-12 col-lg-1-5 mb-2 mb-lg-3">
          <form-select :label="$t('mark')" :options="brands" v-model="form.brand_id"
            :clear-option="!isMobileBreakpoint" :popular-options="isMobileBreakpoint ? [129,483,8,1,767,117] : undefined" 
            :img-key="isMobileBreakpoint ? 'transformed_media' : ''" @change="setBrand($event, 0), searchAutosalons()" has-search />
        </div>
        <div class="col-6 col-lg-1-5 mb-2 mb-lg-3">
          <form-select :label="$t('model')" :options="carModels[0]" v-model="form.model_id"
            :disabled="form.brand_id && !carModels[0].length" @change="setModel($event, 0), searchAutosalons()" has-search />
        </div>
        <div class="col-6 col-lg-1-5 mb-2 mb-lg-3">
          <form-select :label="$t('generation')" :options="carGenerations[0]" v-model="form.generation_id"
            :disabled="form.model_id && !carGenerations[0].length" has-search @change="searchAutosalons()" />
        </div>
        <div class="col-6 col-lg-1-5 mb-2 mb-lg-3">
          <form-checkbox :label="$t('barter')" v-model="form.barter" 
            input-name="barter" icon-name="barter" @change="searchAutosalons()" />
        </div>
        <div class="col-6 col-lg-1-5 mb-2 mb-lg-3">
          <form-checkbox :label="$t('credit')" v-model="form.credit" 
            input-name="credit" icon-name="percent" @change="searchAutosalons()" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  data() {
    return {
      pending: false,
      searchAgain: false,
      form: {
        brand_id: '',
        model_id: '',
        generation_id: '',
        announce_type: 1,
        barter: false,
        credit: false
      }
    }
  },
  computed: {
    ...mapGetters(['brands', 'carModels', 'carGenerations']),

    getMileageOptions() {
      return [
        { name: this.$t('all'), key: 1 },
        { name: this.$t('new'), key: 2 },
        { name: this.$t('with_mileage'), key: 3 }
      ];
    },
    showResetBtn() {
      return this.$queryParams(this.form, true).split('&').length > (this.form.announce_type == 1 ? 1 : 0);
    }
  },
  methods: {
    ...mapActions(['getModelsArray', 'getModelGenerationsArray', 'getSalonsList']),

    async searchAutosalons() {
      this.searchAgain = false;
      if (this.pending) {
        this.searchAgain = true;
        return;
      }
      this.pending = true;
      try {
        await this.getSalonsList(this.$queryParams(this.form, true));
        this.$nuxt.$emit('search-salons');
        this.pending = false;
        if (this.searchAgain) {
          await this.searchAutosalons();
        }
      } catch(err) {
        this.pending = false;
      }
    },
    async setBrand(id, index = 0) {
      this.$set(this.form, 'generation_id', '');
      this.$set(this.form, 'model_id', '');
      let slug = this.brands.find(option => option.id == id)?.slug || '';
      if (id) await this.getModelsArray({ value: slug, index });
    },
    async setModel(id, index = 0) {
      this.$set(this.form, 'generation_id', '');
      let slug = this.carModels[index].find(option => option.id == id)?.slug || '';
      let brand_slug = this.brands.find(option => option.id == this.form.brand_id)?.slug || '';
      if (id) await this.getModelGenerationsArray({ value: slug, brand_slug, index });
    }
  },
}
</script>