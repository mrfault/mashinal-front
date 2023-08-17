<template>
   <div class="ma-new-automobile">
      <modal-popup
         :modal-class="!isMobileBreakpoint ? 'midsize': 'larger'"
         :overflow-hidden="isMobileBreakpoint"
         :title="isEditing ? $t('edit') : $t('add_new_auto')"
         :toggle="showModal"
         @close="closeAndReset"
      >
         <div :class="{'y-scroll': (form.modification && !isMobileBreakpoint)}" class="ma-new-automobile__content">
            <p v-if="!isEditing" class="ma-new-automobile__desc">{{ $t('add_new_auto_desc') }}</p>
            <div v-if="!isEditing" class="row">
               <!--               brand-->
               <div v-if="brandsList && brandsList.length" class="col-12">
                  <form-select
                     v-model="form.brand"
                     :clear-option="false"
                     :clear-placeholder="true"
                     :input-placeholder="$t('mark_search')"
                     :invalid="$v.form.brand.$error"
                     :label="$t('mark')"
                     :options="brandsList"
                     has-search
                     @change="setBrand($event, 0)"
                  />
               </div>
               <!--               model-->
               <div v-if="form.brand && carModelsList && carModelsList.length" class="col-12 mt-3">
                  <form-select
                     v-model="form.model"
                     :clear-option="false"
                     :clear-placeholder="true"
                     :input-placeholder="$t('model')"
                     :invalid="$v.form.model.$error"
                     :label="$t('model')"
                     :options="carModelsList"
                     has-search
                     @change="setModel($event, 0)"
                  />
               </div>
               <!--               generation-->
               <div v-if="form.model && generations && generations[0] && generations[0].length" class="col-12 mt-3">
                  <form-select
                     v-model="form.generation"
                     :clear-option="false"
                     :clear-placeholder="true"
                     :input-placeholder="$t('generation')"
                     :invalid="$v.form.generation.$error"
                     :label="$t('generation')"
                     :options="generations[0]"
                     has-search
                     @change="setGeneration($event, 0)"

                  />
               </div>
               <!--               body-->
               <div v-if="form.generation && generationTypes && generationTypes.length" class="col-12 mt-3">
                  <form-select
                     v-model="form.body"
                     :clear-option="false"
                     :clear-placeholder="true"
                     :input-placeholder="$t('body_type')"
                     :invalid="$v.form.body.$error"
                     :label="$t('body_type')"
                     :options="generationTypes"
                     has-search
                     @change="setBody($event, 0)"
                  />
               </div>
               <!--               modifications-->
               <div v-if="form.body && modifications && modifications.length" class="col-12 mt-3">
                  <form-select
                     v-model="form.modification"
                     :clear-option="false"
                     :clear-placeholder="true"
                     :input-placeholder="$t('modification')"
                     :invalid="$v.form.modification.$error"
                     :label="$t('modification')"
                     :options="modifications"
                     has-search
                     @change="resetValidation"
                  />
               </div>


               <!--               car_number-->
               <div v-if="form.modification" class="col-12 mt-3">
                  <form-text-input
                     key="car_number"
                     v-model="form.car_number"
                     :invalid="$v.form.car_number.$error"
                     :mask="'99 - AA - 999'"
                     :placeholder="$t('car_number')"
                  />
               </div>
               <!--               vin-->
               <div v-if="form.modification" class="col-12 mt-3">
                     <form-text-input
                        key="vin"
                        v-model="form.vin"
                        :placeholder="$t('vin_carcase_number')"
                        :invalid="$v.form.vin.$error"
                        :mask="$maskAlphaNumeric('*****************')"
                     />
               </div>

               <small class="text-red pl-2 pt-1" v-if="showVinOrCarNumberError">{{ $t('vin_or_car_number_is_mandatory')}}</small>

               <div class="col-12 mt-3">
                  <button
                     :class="['btn btn--green w-100',{pending}]"
                     @click="addCar">{{ $t('save') }}
                  </button>
               </div>

            </div>

            <div v-if="isEditing" class="row">
               <!--               brand-->
               <div v-if="brandsList && brandsList.length" class="col-12">
                  <form-select
                     v-model="form.brand"
                     :clear-option="false"
                     :clear-placeholder="true"
                     :input-placeholder="$t('mark_search')"
                     :invalid="$v.form.brand.$error"
                     :label="$t('mark')"
                     :options="brandsList"
                     :disabled="isEditing"
                     has-search
                     @change="setBrand($event, 0)"
                  />
               </div>
               <!--               model-->
               <div v-if="form.brand && carModels && carModels.length" class="col-12 mt-3">
                  <form-select
                     v-model="form.model"
                     :clear-option="false"
                     :clear-placeholder="true"
                     :input-placeholder="$t('model')"
                     :invalid="$v.form.model.$error"
                     :label="$t('model')"
                     :options="carModels"
                     :disabled="isEditing"
                     has-search
                     @change="setModel($event, 0)"
                  />
               </div>
               <!--               generation-->
               <div v-if="form.model  && generations && generations.length" class="col-12 mt-3">
                  <form-select
                     v-model="form.generation"
                     :clear-option="false"
                     :clear-placeholder="true"
                     :input-placeholder="$t('generation')"
                     :invalid="$v.form.generation.$error"
                     :label="$t('generation')"
                     :options="generations"
                     :disabled="isEditing"
                     has-search
                     @change="setGeneration($event, 0)"

                  />
               </div>
               <!--               body-->
               <div v-if="form.generation && generationTypes && generationTypes.length" class="col-12 mt-3">
                  <form-select
                     v-model="form.body"
                     :clear-option="false"
                     :clear-placeholder="true"
                     :input-placeholder="$t('body_type')"
                     :invalid="$v.form.body.$error"
                     :label="$t('body_type')"
                     :options="generationTypes"
                     :disabled="isEditing"
                     has-search
                     @change="setBody($event, 0)"
                  />
               </div>
               <!--               modifications-->
               <div v-if="form.body && modifications && modifications.length" class="col-12 mt-3">
                  <form-select
                     v-model="form.modification"
                     :clear-option="false"
                     :clear-placeholder="true"
                     :input-placeholder="$t('modification')"
                     :invalid="$v.form.modification.$error"
                     :label="$t('modification')"
                     :options="modifications"
                     :disabled="isEditing"
                     has-search
                  />
               </div>

               <!--               car_number-->
               <div class="col-12 mt-3">
                  <form-text-input
                     key="car_number"
                     v-model="form.car_number"
                     :invalid="$v.form.car_number.$error"
                     :mask="'99 - AA - 999'"
                     :placeholder="$t('car_number')"
                  />
               </div>
               <div class="col-12 mt-3">
                  <form-text-input
                     key="vin"
                     v-model="form.vin"
                     :placeholder="$t('vin_carcase_number')"
                     :invalid="$v.form.vin.$error"
                     :mask="$maskAlphaNumeric('*****************')"
                  />
               </div>

               <small class="text-red pl-2 pt-1" v-if="showVinOrCarNumberError">{{ $t('vin_or_car_number_is_mandatory')}}</small>

               <div class="col-12 mt-3">
                  <button
                     :class="['btn btn--green w-100',{pending}]"
                     @click="addCar">{{ $t('save') }}
                  </button>
               </div>
            </div>
         </div>
      </modal-popup>
   </div>
</template>

<script>
import {mapGetters, mapActions} from "vuex";
import {ToastErrorsMixin} from '~/mixins/toast-errors';
import {minLength, required, requiredIf} from "vuelidate/lib/validators";

export default {
   props: {
      isEditing: Boolean,
      announcement: Object,
      showModal: Boolean,
   },
   data() {
      return {

         form: {
            brand: null,
            model: null,
            generation: null,
            generationType: null,
            body: null,
            modification: null,
            vin: null,
            car_number: null,

            brandSlug: null,
            modelSlug: null,
         },
         list: {
            generation: [],
         },
         pending: false,
         showVinOrCarNumberError: false,
      }
   },
   mixins: [ToastErrorsMixin],
   computed: {
      ...mapGetters({
         brandsList: 'brands',
         carModels: 'carModels',
         generations: 'carGenerations',
         generationTypes: 'generationTypes',
         modificationsList: 'modificationsList',

      }),
      carModelsList() {
         return this.carModels[0]
      },
      modifications() {
         return this.$store.getters['comparison/modifications'].map(mod => {
            const name = `${mod.main[" "]['obem'] ? mod.main[" "]['obem'] : ''}
          ${mod.main[" "]['box'] ? this.$t(this.$t('box_values')[mod.main[" "]['box']]) : ''}
          ${this.power(mod) ? ' (' + this.power(mod) + ') ' : ''}
          ${mod.main["  "]['engine'] ? this.$t('engine_values')[mod.main["  "]['engine']] : ''} `

            return {
               ...mod,
               name
            }
         })
      },
      enableSubmitButton() {
         return this.form.brand &&
            this.form.model &&
            this.form.generation &&
            this.form.body &&
            this.form.modification &&
            this.form.car_number
      },
   },
   methods: {
      ...mapActions(['getModelsArray',
         'getModelGenerationsArray',
         'updateSavedSearchNotificationsInterval',
         'getGenerationTypes',
         'getModificationsList',
      ]),
      closeAndReset() {
         this.$emit("modalClosed", true);
         this.resetValidation();
         this.pending = false;
         this.$store.commit("mutate", {property: "carModels", value: []});
         this.$store.commit("mutate", {property: "carGenerations", value: []});
         this.$store.commit("mutate", {property: "modificationsList", value: []});
         this.$store.commit("mutate", {property: "generationTypes", value: []});
         this.form = {
            brand: null,
            model: null,
            generation: null,
            generationType: null,
            body: null,
            modification: null,
            vin: null,
            car_number: null,

            brandSlug: null,
            modelSlug: null,
         }
      },

      async getBrands() {
         this.$store.dispatch("getBrands")
      },

      async setBrand(id, index) {
         this.pending = true;
         this.form.model = null;
         this.form.generation = null;
         this.form.body = null;
         this.form.modification = null;

         let brand = this.brandsList.find((option) => option.id == id)
         let slug = brand?.slug || '';
         this.form.brand = id;
         this.form.brandSlug = slug;

         this.form.generation = null;
         this.$v.$reset();

         this.$store.commit("mutate", {property: "carModels", value: []});
         if (id) {
            await this.getModelsArray({value: slug, index})
            this.pending = false;
         }
      },
      async setModel(id, index) {
         this.pending = true;
         this.form.generation = null;
         this.form.body = null;
         this.form.modification = null;
         let model = this.carModels[index].find((option) => option.id == id)
         let slug = model?.slug || '',
            name = model?.name || '';
         this.form.modelSlug = slug;
         let brand_slug = this.form.brandSlug
         this.$v.$reset();
         this.$store.commit("mutate", {property: "carGenerations", value: []});
         if (id) {
            await this.getModelGenerationsArray({value: slug, brand_slug, index})
            this.pending = false;
         }
      },
      async setGeneration(id, index = 0) {
         this.pending = true;
         this.form.body = null;
         this.form.modification = null;
         this.$v.$reset();
         if (this.carGenerations && this.carGenerations.length) {
            let generation = this.carGenerations[index].find(
               (option) => option.id == id,
            );
         }
         this.$store.commit("mutate", {property: "generationTypes", value: []});
         await this.getGenerationTypes(
            {
               brand: this.form.brandSlug,
               model: this.form.modelSlug,
               generation: this.form.generation
            })
         this.pending = false;
      },
      async setBody(id) {
         this.$v.$reset();
         this.form.modification = null;
         this.pending = true;
         this.$store.commit("mutate", {property: "modificationsList", value: []});
         if (id) {
            await this.$store.dispatch('comparison/getModifications', {
               car_type_id: id,
               generation_id: this.form.generation,
            });
            this.pending = false;
         }

      },

      power(item) {
         if (!item['main']) {
            return false;
         }
         let txt = item['main'] ? item['main']["  "]['moshchnost'] : '';
         return txt + this.$t('l.s.');
      },

      async addCar() {
         this.$v.$touch();
         if (this.pending || this.$v.$error) {
            if (!this.form.car_number && !this.form.vin){
               this.showVinOrCarNumberError = true;
            }
            this.pending = false;
            return;
         } else {
            this.showVinOrCarNumberError = false;
            console.log("this.pending || this.$v.$error else")
            try {
            console.log("this.pending || this.$v.$error else try")
               this.pending = true;
               if (this.isEditing) {
                  console.log("this.pending || this.$v.$error else try this.isEditing")

                  const res = await this.$store.dispatch('UserCabinetCarsEdit', {
                     id: this.announcement.id,
                     brand_id: this.form.brand,
                     model_id: this.form.model,
                     generation_id: this.form.generation,
                     car_type_id: this.form.body,
                     car_catalog_id: this.form.modification,
                     vin: this.form.vin,
                     car_number: this.form.car_number.replace(/-|[ ]/g, '')
                  });
               } else {
                  console.log("this.pending || this.$v.$error else try this.isEditing")

                  const res = await this.$store.dispatch('UserCabinetCarsAdd', {
                     brand_id: this.form.brand,
                     model_id: this.form.model,
                     generation_id: this.form.generation,
                     car_type_id: this.form.body,
                     car_catalog_id: this.form.modification,
                     vin: this.form.vin,
                     car_number: this.form.car_number?.replace(/-|[ ]/g, '') || null,
                  });
               }
               this.pending = false;
               this.closeAndReset();
               this.$emit('carAdded', true)
               this.$nuxt.refresh();
               this.$toasted.success(this.$t('info_saved'));
            } catch (error) {
               if (error.response && error.response.status) {
                  if (error.response.status == 422) {
                     this.$toasted.error(this.$t('given_data_is_not_matching_car_number'));
                  } else if (error.response.status == 403) {
                     this.$toasted.error(this.$t('given_data_is_invalid'));
                  }
               } else {
                  return
               }
               this.pending = false;
            }
         }
      },
      async editCar() {
         this.$emit('carEdited', true)
      },

      async fillFormForEditing() {

         this.form.brand = this.announcement.brand.id;
         this.pending = true;
         Promise.all([
            await this.getModelsList(),
            await this.getGenerationsList(),
            await this.getGenerationTypesList(),
            await this.getModificationsList(),
         ])
         this.form.modification = this.announcement.catalog_id
         this.form.vin = this.announcement.vin;

         this.form.car_number = this.announcement.car_number
         this.pending = false;

      },
      async getModelsList() {
         console.log("getModelsList")
         await this.getModelsArray({value: this.announcement.brand.slug});
         this.form.model = this.announcement.model.id
      },
      async getGenerationsList() {
         await this.getModelGenerationsArray({
            brand_slug: this.announcement.brand.slug,
            value: this.announcement.model.slug
         });
         this.form.generation = this.announcement.generation.id;
      },
      async getGenerationTypesList() {
         await this.getGenerationTypes(
            {
               brand: this.form.brandSlug,
               model: this.form.modelSlug,
               generation: this.form.generation
            })
         this.form.body = this.announcement.car_type.id
      },
      async getModificationsList() {
         await this.$store.dispatch('comparison/getModifications', {
            car_type_id: this.announcement.car_type.id,
            generation_id: this.announcement.generation.id,
         });
      },

      resetValidation() {
         this.$v.$reset();
      }

   },
   validations: {
      form: {
         brand: {required},
         model: {required},
         generation: {required},
         body: {required},
         modification: {required},
         car_number: {
            required: requiredIf(function () {
               return !this.form.vin
            })
         },
         vin: {
            required: requiredIf(function () {
               return !this.form.car_number
            })
         },
      }
   },
   mounted() {
      this.getBrands();
   },
   watch: {
      isEditing(newValue) {
         if (newValue) {
            this.fillFormForEditing();
         }
      },
   },
}
</script>


<style lang="scss">
.y-scroll {
   overflow-y: scroll;
   overflow-x: hidden;

   &::-webkit-scrollbar {
      width: 3px;
      height: 7px;
   }

   /* Track */
   &::-webkit-scrollbar-track {
      background: transparent !important;
   }

   /* Handle */
   &::-webkit-scrollbar-thumb {
      background: rgb(206, 206, 206);
   }

   /* Handle on hover */
   &::-webkit-scrollbar-thumb:hover {
      background: #555;
   }
}
</style>
