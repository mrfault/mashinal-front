<template>
   <div class="moto-search-form form" ref="searchForm">
      <div class="moto-search-form__grid">
         <form-select
            :label="$t('type_of_motos')"
            :options="motoTypes"
            :clear-placeholder="true"
            :clear-option="false"
            v-model="form.additional_brands[0]['category']"
            @change="setCategory($event, 0)"
         />

         <form-select
            :label="$t('mark')"
            :options="brands(category.id || form.additional_brands[0]['category'])"
            :clear-placeholder="true"
            :clear-option="false"
            :input-placeholder="$t('mark_search')"
            v-model="form.additional_brands[0]['brand']"
            @change="setBrand($event, 0)"
            :disabled="(category.id || form.additional_brands[0]['category']) && !brands(category.id || form.additional_brands[0]['category']).length"
            has-search
            :img-key="isMobileBreakpoint ? 'transformed_media' : ''"
            :img-placeholder="`/logos/moto-${colorMode}.svg`"
         />

         <form-select
            :label="$t('model')"
            :options="models(category.id || form.additional_brands[0]['category'])[0]"
            :clear-placeholder="true"
            :clear-option="false"
            :input-placeholder="$t('model_search')"
            v-model="form.additional_brands[0]['model']"
            :disabled="form.additional_brands[0]['brand'] && !models(category.id || form.additional_brands[0]['category'])[0].length"
            has-search
         />

         <div class="form-merged">
            <form-select
               :label="$t('from_year')"
               :options="getYearOptions(false, form.year_to)"
               v-model="form.year_from"
               :show-label-on-select="false"
               :clear-option="false"
               in-select-menu
            />

            <form-select
               :label="$t('to')"
               :options="getYearOptions(form.year_from, false)"
               v-model="form.year_to"
               :show-label-on-select="false"
               :clear-option="false"
               in-select-menu
            />
         </div>

         <template v-for="(key, i) in rows" v-if="key > 0">
            <form-select
               :label="$t('type_of_motos')"
               :options="motoTypes"
               :clear-placeholder="true"
               :clear-option="false"
               v-model="form.additional_brands[key]['category']"
               @change="setCategory($event, key)"
            />

            <form-select
               :label="$t('mark')"
               :options="brands(category.id || form.additional_brands[key]['category'])"
               :clear-placeholder="true"
               :clear-option="false"
               :input-placeholder="$t('mark_search')"
               v-model="form.additional_brands[key]['brand']"
               @change="setBrand($event, key)"
               :disabled="(category.id || form.additional_brands[key]['category']) && !brands(category.id || form.additional_brands[key]['category']).length"
               has-search
               :img-key="isMobileBreakpoint ? 'transformed_media' : ''"
               :img-placeholder="`/logos/moto-${colorMode}.svg`"
            />

            <form-select
               :label="$t('model')"
               :options="models(category.id || form.additional_brands[key]['category'])[key]"
               :clear-placeholder="true"
               :clear-option="false"
               :input-placeholder="$t('model_search')"
               v-model="form.additional_brands[key]['model']"
               :disabled="form.additional_brands[key]['brand'] && !models(category.id || form.additional_brands[key]['category'])[key].length"
               has-search
            />

            <button
               :key="'4' +i"
               type="button"
               :class="['btn', 'full-width', 'btn--white', { 'pointer-events-none': pending }]"
               @click="removeSearchRow(key)"
            >
               {{ $t('remove_search') }}

               <icon name="minus" />
            </button>
         </template>

         <form-select
            :label="$t('price')"
            custom
            :new-label="false"
            :suffix="getOptionValue('Currency', form.currency)"
            :values="{from: form.price_from, to: form.price_to, suffix: getSuffix}"
            @clear="(form.price_from = ''), (form.price_to = '')"
         >
            <div class="form-merged flex-column price">
               <form-buttons
                  :options="getCurrencyOptions"
                  :group-by="3"
                  :btnClass="'blue-new-light'"
                  v-model="form.currency"
               />

               <div class="form-merged__inputs d-flex">
                  <form-numeric-input
                     :placeholder="$t('from')"
                     v-model="form.price_from"
                  />

                  <form-numeric-input
                     :placeholder="$t('to')"
                     v-model="form.price_to"
                  />
               </div>
            </div>
         </form-select>

         <div class="form-merged custom">
            <form-numeric-input
               :placeholder="$t('mileage_from')"
               v-model="form.mileage_from"
               :suffix="$t('char_kilometre')"
            />

            <form-numeric-input
               :placeholder="$t('to')"
               v-model="form.mileage_to"
               :suffix="$t('char_kilometre')"
            />
         </div>

         <div class="form-merged custom">
            <form-select
               :label="$t('capacity_from_2')"
               v-model="form.capacity_from"
               :options="getMotoCapacityOptions"
               :show-label-on-select="false"
               :clear-option="false"
               in-select-menu
            />

            <form-select
               :label="$t('to')"
               v-model="form.capacity_to"
               :options="getMotoCapacityOptions"
               :show-label-on-select="false"
               :clear-option="false"
               in-select-menu
            />
         </div>

         <form-select
            :label="$t('power')"
            custom
            :new-label="false"
            :suffix="$t('char_h_power')"
            :values="{from: form.power_from, to: form.power_to }"
            @clear="form.power_from = '', form.power_to = ''"
         >
            <div class="form-merged">
               <form-numeric-input
                  :placeholder="$t('from')"
                  v-model="form.power_from"
                  :suffix="$t('char_h_power')"
               />

               <form-numeric-input
                  :placeholder="$t('to')"
                  v-model="form.power_to"
                  :suffix="$t('char_h_power')"
               />
            </div>
         </form-select>

         <template v-if="showMore">
            <form-select
               :label="$t('city')"
               :options="sellOptions.regions"
               :clear-placeholder="true"
               :clear-option="false"
               :input-placeholder="$t('city_search')"
               v-model="form.region"
               has-search
            />

<!--            <form-select-->
<!--               v-model="form['box']"-->
<!--               :options="motoOptions.config['box'].values.filter(value => value.key !== 0)"-->
<!--               :multiple="motoOptions.config['box'].multiple &&-->
<!--                  !motoOptions.config['box'].not_foreach &&-->
<!--                  'box' !== 'tacts'-->
<!--               "-->
<!--               :name-in-value="-->
<!--                  motoOptions.config['box'].multiple &&-->
<!--                  !motoOptions.config['box'].not_foreach &&-->
<!--                  'box' !== 'tacts'-->
<!--               "-->
<!--               :label="$t(motoOptions.config['box'].placeholder)"-->
<!--               :translate-options="true"-->
<!--               :clear-placeholder="true"-->
<!--               :clear-option="false"-->
<!--            />-->

            <form-select
               :label="$t('box')"
               :options="motoGearbox"
               :clear-placeholder="true"
               :clear-option="false"
               :multiple="true"
               v-model="form.box"
            />

            <form-select
               :label="$t('toplivo')"
               :options="motoFuelTypes"
               :clear-placeholder="true"
               :clear-option="false"
               :multiple="true"
               v-model="form.fuel_type"
            />

            <div class="btns">
               <form-checkbox
                  :label="$t('rent')"
                  :show-input="false"
                  input-name="rent"
                  v-model="form.is_rent"
               />

               <form-checkbox
                  :label="$t('in_garanty')"
                  :show-input="false"
                  v-model="form.in_garanty"
                  input-name="in_garanty"
               />
            </div>

            <form-select
               :label="$t('gearing')"
               :options="motoTransmissions"
               :clear-placeholder="true"
               :clear-option="false"
               :multiple="true"
               v-model="form.gearing"
            />

<!--            <div class="btns">-->
<!--               -->

<!--               <form-checkbox-->
<!--                  :label="$t('external_moto')"-->
<!--                  :show-input="false"-->
<!--                  v-model="form.external_salon"-->
<!--                  input-name="savedSearch"-->
<!--               />-->
<!--            </div>-->

<!--            <div>Ötürücü</div>-->

            <form-select
               v-model="form['customs']"
               :options="motoOptions.config['customed_ones'].values.filter(value => value.key !== 0)"
               :multiple="
                  motoOptions.config['customed_ones'].multiple &&
                  !motoOptions.config['customed_ones'].not_foreach &&
                  'customs' !== 'tacts'
               "
               :name-in-value="
                  motoOptions.config['customed_ones'].multiple &&
                  !motoOptions.config['customed_ones'].not_foreach &&
                  'customs' !== 'tacts'
               "
               :label="$t(motoOptions.config['customed_ones'].placeholder)"
               :translate-options="true"
               :clear-placeholder="true"
               :clear-option="false"
            />

            <div class="btns">
               <form-select
                  v-model="form['damaged']"
                  :options="motoOptions.config['used_ones'].values.filter(value => value.key !== 0)"
                  :multiple="
                     motoOptions.config['used_ones'].multiple &&
                     !motoOptions.config['used_ones'].not_foreach &&
                     'status' !== 'tacts'
                  "
                  :name-in-value="
                     motoOptions.config['used_ones'].multiple &&
                     !motoOptions.config['used_ones'].not_foreach &&
                     'status' !== 'tacts'
                  "
                  :label="$t(motoOptions.config['used_ones'].placeholder)"
                  :translate-options="true"
                  :clear-placeholder="true"
                  :clear-option="false"
               />

               <form-select
                  :label="$t('color')"
                  v-model="form.colors"
                  translate-options
                  :options="colors"
                  :clear-placeholder="true"
                  :clear-option="false"
                  multiple
               />
            </div>

            <div class="checkboxes">
               <form-checkbox
                  :label="$t('credit')"
                  :show-input="false"
                  input-name="exchange_possible"
                  v-model="form.credit"
               />

               <form-checkbox
                  :label="$t('exchange')"
                  :show-input="false"
                  input-name="credit"
                  v-model="form.exchange_possible"
               />
            </div>
         </template>

         <div class="btns justify-content-between">
            <button
               v-if="!isMobileBreakpoint"
               type="button"
               class="btn-inline white"
               @click="resetForm(true)"
            >
               <span>
                  {{ $t('clear_search') }}

                  <icon name="cross" />
               </span>
            </button>

            <button
               class="btn-inline white"
               @click="showMore = !showMore"
            >
               <span>
                  <template v-if="!showMore">{{ $t('advanced_search3') }}</template>

                  <template v-else>{{ $t('less_2') }}</template>

                  <inline-svg :src="'/icons/setting-2.svg'" v-if="!showMore"/>

                  <icon name="chevron-up" v-else/>
               </span>
            </button>
         </div>

         <button
            type="button"
            :class="['btn', 'full-width', 'btn--green', { pending }]"
            @click="submitForm()"
         >
            {{ $t('find') }}

            <inline-svg :src="'/icons/search_new.svg'" />
         </button>
      </div>
   </div>
</template>

<script>
   import ColorOptions from '~/components/options/ColorOptions';
   import { mapGetters, mapActions } from 'vuex';
   import { SearchMixin } from '~/mixins/search';

   export default {
      components: {
         ColorOptions
      },

      mixins: [SearchMixin],

      props: {
         totalCount: {
            type: Number,
            default: 0
         },
         sorting: {
            type: Object,
            default() { return {} }
         },
         announceType: {
            type: Number,
            default: 1
         },
         onlySavedSearch: {
            default: false,
            type: Boolean
         },
         pending: Boolean,
         category: {}
      },

      data() {
         return {
            showMore: false,
            rows: ['0'],
            form: {
               moto_type: '',
               sort_by: 'created_at',
               sort_order: 'desc',
               additional_brands: {0: {}, 1: {}, 2: {}, 3: {}, 4: {}},
               announce_type: 0,
               currency: 1,
               box: [],
               engine: [],
               drive: [],
               colors: [],
               cylinders: [],
               sum_cylinders: [],
               tacts: [],
               type: [],
               capacity_from: '',
               capacity_to: '',
               year_from: '',
               year_to: '',
               price_from: '',
               price_to: '',
               mileage_from: '',
               mileage_to: '',
               power_to: '',
               power_from: '',
               damaged: '',
               gearing: [],
               fuel_type: [],
               customs: '',
               region: '',
               exchange_possible: false,
               is_rent: false,
               credit: false,
               external_salon: false,
            }
         }
      },

      computed: {
         ...mapGetters([
            'motoOptions',
            'motorcycleModels',
            'scooterModels',
            'atvModels',
            'sellOptions',
            'colors',
            'motoGearbox',
            'motoTransmissions',
            'motoFuelTypes'
         ]),

         // meta data
         meta() {
            return {
               type: 'moto',
               path: this.category.type ? '/moto/' + this.$t('slug_' + this.category.type) : '/moto',
               param: 'filter'
            }
         },
         // options
         motoTypes() {
            return [
               {key: 1, name: this.$t('motorcycles')},
               {key: 2, name: this.$t('scooters')},
               {key: 3, name: this.$t('atvs')}
            ]
         },
         // static data
         getMotoSelectGroup() {
            let group = {
               engine: 'engine',
               box: 'box',
               drive: 'drive',
               tacts: 'number_of_vehicles',
               sum_cylinders: 'cylinders',
               status: 'used_ones',
               customs: 'customed_ones'
            }

            for (let key in group) {
               if (this.category.id) {
                  let categories = this.motoOptions.config[group[key]]?.category;
                  if (categories && categories[0] && categories.indexOf(this.category.id) === -1)
                     delete group[key];
               } else {
                  if (['drive', 'tacts', 'sum_cylinders', 'cylinders'].includes(key))
                     delete group[key];
               }
            }
            return group;
         },

         getMotoCapacityOptions() {
            return this.motoOptions.config.volume.values.map(o => ({
               key: parseInt(o.name),
               name: o.name.replace(' см³', '')
            }));
         },

         getSuffix() {
            switch (this.form.currency) {
               case 1:
                  return '₼';
               case 2:
                  return '$';
               case 3:
                  return '€';
            }
         },

         hasValue() {
            return !!(this.form.additional_brands[0].category ||
               this.form.additional_brands[0].brand ||
               this.form.additional_brands[0].model ||
               this.form.min_year || this.form.max_year ||
               this.form.price_from || this.form.price_to ||
               this.form.mileage_from || this.form.mileage_to ||
               this.form.capacity_from || this.form.capacity_to ||
               this.form.power_from || this.form.power_to ||
               this.form.region || this.form.box.length ||
               this.form.external_salon || this.form.customs ||
               this.form.damaged || this.form.colors.length ||
               this.form.exchange_possible || this.form.credit ||
               this.form.gearing.length || this.form.fuel_type.length
               // this.form.with_video ||  this.form.korobka.length ||
               // this.form.engine_type.length || this.form.in_garanty ||
               // this.form.body.length  ||
               // this.form.damage || this.form.n_of_seats.length ||
               // this.form.colors.length || Object.values(this.form.all_options).length)
            )
         }
      },

      methods: {
         ...mapActions(['getMotoModels']),

         async setCategory(id, index) {
            this.$set(this.form.additional_brands[index], 'category', id);
            this.$set(this.form.additional_brands[index], 'brand', "");
            this.$set(this.form.additional_brands[index], 'model', "");
            !id && (this.form.moto_type = null);
         },

         async setBrand(id, index) {
            this.$set(this.form.additional_brands[index], 'brand', id);
            this.$set(this.form.additional_brands[index], 'model', "");
            if (id) await this.getMotoModels({
               category: this.category.id || this.form.additional_brands[index]['category'],
               id,
               index
            });
         },

         brands(category) {
            return {
               1: this.motoOptions.brands,
               2: this.motoOptions.scooter_brands,
               3: this.motoOptions.atv_brands
            }[parseInt(category) || 1];
         },

         models(category) {
            return {
               1: this.motorcycleModels,
               2: this.scooterModels,
               3: this.atvModels
            }[parseInt(category) || 1];
         },

         initialValue() {
            if (this.$route.query?.filter && JSON.parse(this.$route.query?.filter)?.box) {
               this.form.box = JSON.parse(this.$route.query?.filter)?.box?.map((f) => f.key);
            }

            if (this.$route.query?.filter && JSON.parse(this.$route.query?.filter)?.fuel_type) {
               this.form.fuel_type = JSON.parse(this.$route.query?.filter)?.fuel_type?.map((f) => f.key);
            }

            if (this.$route.query?.filter && JSON.parse(this.$route.query?.filter)?.gearing) {
               this.form.gearing = JSON.parse(this.$route.query?.filter)?.gearing?.map((f) => f.key);
            }
         }
      },

      async fetch() {
         await Promise.all([
            this.$store.dispatch('getMotoGearboxV2'),
            this.$store.dispatch('getMotoTransmissionsV2'),
            this.$store.dispatch('getMotoFuelTypesV2'),
            // this.$store.dispatch('getColors')
         ])
      },

      watch: {
         announceType(val) {
            this.form.announce_type = val;
         },

         sorting(val) {
            this.form.sort_by = val.key.split('_')[0];
            this.form.sort_order = val.value;
            this.submitForm();
         },

         'form.additional_brands': {
            deep: true,
            handler(val) {
               if (Object.values(val)?.find(item => item.category)) this.$emit('showSorting', true)
               else this.$emit('showSorting', false)

               if (val[0].category === 1) this.form.moto_type = 'motorcycle';
               else if (val[0].category === 2) this.form.moto_type = 'scooter';
               else if (val[0].category === 3) this.form.moto_type = 'moto_atv';
            }
         }
      },

      mounted() {
         this.initialValue();
         this.$nuxt.$on('submit-car-search-form-mobile', () => {

            this.submitForm();
         })
      },
      beforeDestroy() {
         this.$nuxt.$off('submit-car-search-form-mobile')
      }
   }
</script>

<style lang="scss">
   .moto-search-form {
      &__grid {
         display: grid;
         grid-column-gap: 20px;
         grid-row-gap: 16px;

         .checkboxes {
            display: flex;
            align-items: center;
            column-gap: 12px;
            height: max-content;

            .checkbox-input {
               input {
                  &:checked {
                     & + {
                        label {
                           background-color: #155EEF;

                           span {
                              color: #FFFFFF;
                           }
                        }
                     }
                  }
               }
               label {
                  height: 48px;

                  //&:hover {
                  //   background-color: #155EEF;
                  //
                  //   span {
                  //      color: #FFFFFF;
                  //   }
                  //}
               }
            }
         }

         .form-group {
            min-width: 0;

            height: 100%;

            .select-menu {
               height: 100%;
               &_label {
                  height: 48px;
               }

               &_dropdown {
                  top: 55px;

                  .form-merged {
                     height: unset;
                  }
               }
            }

            input {
               height: 46px;
            }

            .checkbox-input {
               input {
                  &:checked {
                     & + {
                        label {
                           background-color: #155EEF;

                           span {
                              color: #FFFFFF;
                           }
                        }
                     }
                  }
               }
               label {
                  height: 48px;

                  //&:hover {
                  //   background-color: #155EEF;
                  //
                  //   span {
                  //      color: #FFFFFF;
                  //   }
                  //}
               }
            }
         }

         .form-merged {
            height: 48px;

            .form-group {
               &:first-child {
                  width: 56%;
               }

               .select-menu {
                  &_label {
                     height: 100%;
                  }

                  &_dropdown {
                     top: 55px;
                  }
               }
            }
         }

         .checkbox-input {
            label {
               height: 48px;
            }
         }

         .btn {
            height: 48px;
         }
      }

      .btn {
         height: 52px;
      }

      .btns {
         grid-gap: 12px;
         display: flex;
         height: 52px;
      }
   }

   @media (min-width: 992px) {
      .moto-search-form {
         &__grid {
            grid-template-columns: repeat(3, 1fr);
         }
      }
   }

   @media (min-width: 1150px) {
      .moto-search-form {
         &__grid {
            grid-template-columns: repeat(4, 1fr);
         }
      }
   }
</style>
