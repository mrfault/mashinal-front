<template>
   <div class="ma-new-automobile">
      <button class="ma-new-automobile__button" @click="showModal = true">
         {{ $t('add_new_auto') }}
         <icon name="plus"/>
      </button>

      <modal-popup
         :modal-class="!isMobileBreakpoint ? 'midsize': 'larger'"
         :overflow-hidden="isMobileBreakpoint"
         :title="$t('add_new_auto')"
         :toggle="showModal"
         @close="showModal = false"
      >
         <div>
            <p class="ma-new-automobile__desc">{{ $t('add_new_auto_desc') }}</p>
            <div class="row">
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
               <div v-if="form.modification" class="col-12 mt-3">
                  <form-text-input
                     key="vin"
                     v-model="form.vin"
                     :placeholder="$t('vin_carcase_number')"
                     @change="removeError('vin')"
                  />
               </div>


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
   data() {
      return {
         showModal: false,
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
         this.showModal = false;
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
         this.form.model = null;
         this.form.generation = null;
         this.form.body = null;
         this.form.modification = null;

         let brand = this.brandsList.find((option) => option.id == id)
         let slug = brand?.slug || '';
         this.form.brand = id;
         this.form.brandSlug = slug;

         this.form.generation = null;
         if (id) {
            this.getModelsArray({value: slug, index})
         }
      },
      async setModel(id, index) {
         this.form.generation = null;
         this.form.body = null;
         this.form.modification = null;
         let model = this.carModels[index].find((option) => option.id == id)
         let slug = model?.slug || '',
            name = model?.name || '';
         this.form.modelSlug = slug;
         let brand_slug = this.form.brandSlug
         if (id) {
            await this.getModelGenerationsArray({value: slug, brand_slug, index})
         }
      },
      async setGeneration(id, index = 0) {
         this.form.body = null;
         this.form.modification = null;
         if (this.carGenerations && this.carGenerations.length) {
            let generation = this.carGenerations[index].find(
               (option) => option.id == id,
            );
         }
         this.getGenerationTypes(
            {
               brand: this.form.brandSlug,
               model: this.form.modelSlug,
               generation: this.form.generation
            })
      },
      async setBody(id) {
         this.form.modification = null;
         if (id) {
            await this.$store.dispatch('comparison/getModifications', {
               car_type_id: id,
               generation_id: this.form.generation,
            });
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
            this.pending = false;
            return;
         } else {
            try {
               this.pending = true;
               const res = await this.$store.dispatch('UserCabinetCarsAdd', {
                  brand_id: this.form.brand,
                  model_id: this.form.model,
                  generation_id: this.form.generation,
                  car_type_id: this.form.body,
                  car_catalog_id: this.form.modification,
                  vin: this.form.vin,
                  car_number: this.form.car_number.replace(/-|[ ]/g, '')
               });
               this.pending = false;
               this.closeAndReset();
               this.$toasted.success(this.$t('car_added'));
               this.$nuxt.refresh();
               this.$emit('carAdded',true)
            } catch (error) {
               if (error.response && error.response.status) {
                  console.log('Error Status Code:', error.response.status);
                  if (error.response.status == 422) {
                     console.log('hhhhhhhhhhhhh')
                     this.$toasted.error(this.$t('given_data_is_not_matching_car_number'));
                  } else if (error.response.status == 403) {
                     this.$toasted.error(this.$t('given_data_is_invalid'));
                  }
               } else {
                  console.log('Unexpected error:', error);
               }
               this.pending = false;
            }
         }
      }


   },
   validations: {
      form: {
         brand: {required},
         model: {required},
         generation: {required},
         body: {required},
         modification: {required},
         car_number: {required}
      }
   },

   mounted() {
      this.getBrands()
   }
}
</script>

<style lang="scss">
.ma-new-automobile {
   width: 100%;


   &__button {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: 104px;
      border: 1px dashed rgba(154, 164, 178, 1);
      border-radius: 12px;
      background: #fff;

      &:hover {
         background: rgba(#dadada, 0.3);
      }

      i {
         margin-left: 16px;
         margin-top: 2px;
      }
   }

   &__desc {
      font: 400 18px/22px 'TTHoves';
      color: #1B2434;
      margin-bottom: 24px;
   }
}


.border-red {
   border: 1px solid red;
}
</style>
