<template>
   <div class="calculator-customs container">
      <breadcrumbs :crumbs="crumbs">
         <share-it type="publish" v-if="$route.params.body"/>
      </breadcrumbs>

      <div class="calculator">
         <div class="row">
            <div class="col-12 col-md-12 col-lg-6">
               <div class="calculator__inputs">
                  <h4 class="calculator__inputs--heading">{{ $t('customs_calculator') }}</h4>

                  <div class="row">
                     <div class="col-12">
                        <form-text-input
                           :disabled="true"
                           :class="'override-disabled'"
                           :value="$t('passenger_car')"
                        />
                     </div>

                     <div class="col-12">
                        <form-select
                           :class="{'hasError' : $v.form.engineType.$error}"
                           :label="$t('engine_type')"
                           :options="engineTypes"
                           :clear-placeholder="true"
                           :clearOption="false"
                           :invalid="$v.form.engineType.$error"
                           v-model="form.engineType"
                        />
                     </div>

                     <div class="col-12 col-sm-6">
                        <form-numeric-input
                           :class="{'hasError' : $v.form.price.$error}"
                           :placeholder="$t('customs_value_of_vehicle')"
                           :invalid="$v.form.price.$error"
                           :maxlength="13"
                           v-model="form.price"
                        />
                     </div>

                     <div class="col-12 col-sm-6">
                        <form-numeric-input
                           :class="{'hasError' : $v.form.engine.$error}"
                           :placeholder="$t('engine_volume2')"
                           :disabled="form.engineType === 6"
                           :invalid="$v.form.engine.$error"
                           :maxlength="7"
                           v-model="form.engine"
                        />
                     </div>

                     <div class="col-12">
                        <form-text-input
                           :class="{'hasError' : $v.form.issueDate.$error}"
                           input-date
                           :placeholder="$t('production_year')"
                           :invalid="$v.form.issueDate.$error"
                           v-model="form.issueDate"
                        />
                     </div>

                     <div class="col-12">
                        <h3 class="wrappTitle">{{ $t('country_of_origin') }}</h3>
                        <radio-group
                           class="wrapp"
                           v-model="form.commerceType"
                           :options="commerceTypes"
                        />
                     </div>

                     <div class="col-12">
                        <div class="dollar__exchange">
                           <span>{{ $t('dollar_course') }}:</span>
                           <span>1 USD = 1.7 ₼</span>
                        </div>
                     </div>

                     <div class="col-6 mt-5">
                        <button
                           type="button"
                           :class="['btn', 'full-width', 'btn--red-opacity']"
                           @click="reset"
                        >
                           {{ $t('clear_search') }}
                        </button>
                     </div>

                     <div class="col-6 mt-5">
                        <button
                           @click.prevent="submit"
                           type="button"
                           :class="['btn', 'full-width', 'btn--green', {pending}]"
                        >
                           {{ $t('calculate') }}
                        </button>
                     </div>
                  </div>
               </div>
            </div>

            <div class="col-12 col-md-12 col-lg-6" v-if="customsResult?.data?.autoDuty?.duties?.length">
               <pre>{{form}}</pre>
               <div class="calculator__results">
                  <div class="calculator__results--content">
                     <h2 class="calculator__results--title">{{ $t('result') }}</h2>

                     <div class="vehicle-specs">
                        <ul>
                           <li
                              v-for="(item, i) in customsResult?.data?.autoDuty?.duties"
                              :key="i"
                           >
                              <span>{{ item.name }}</span>
                              <span>{{ item.value }}</span>
                           </li>

                        </ul>

                        <div class="sum">
                           <span>{{ $t('total') }}</span>
                           <span>{{ customsResult?.data?.autoDuty?.total?.value }} AZN</span>
                        </div>
                     </div>
                  </div>
               </div>
            </div>

            <div class="col-12 col-md-12 col-lg-6 d-none d-sm-block mt-4 mt-lg-0" v-else>
               <div class="calculator__empty-results">
                  <div class="calculator__empty-results--image">
                     <img class="light-mode" src="/images/calculator.svg" alt="image"/>
                     <img class="dark-mode" src="/images/calculator_dark.svg" alt="image"/>
                  </div>
               </div>
            </div>
         </div>
      </div>

      <div class="row mt-3">
         <div class="col-12">
            <div class="card">
               <h4>{{ $t('customs_info_title') }}</h4>
               <p class="calculator__info--paragraph">{{ $t('customs_info_part_1') }}</p>
               <p class="calculator__info--paragraph">{{ $t('customs_info_part_2') }}</p>
               <p class="calculator__info--paragraph mb-0">{{ $t('customs_info_part_3') }}</p>
            </div>
         </div>
      </div>
   </div>
</template>

<script>
   import RadioGroup from "~/components/moderator/RadioGroup.vue";
   import { mapGetters } from 'vuex'
   import { required, requiredIf } from 'vuelidate/lib/validators'

   export default {
      name: 'CalculatorCustoms',

      components: { RadioGroup },

      nuxtI18n: {
         paths: {
            az: '/gomruk',
         }
      },

      head() {
         return this.$headMeta({
            title: this.$t('customs_calculator'),
            // description: this.$t('meta-registration_marks')
         });
      },

      data() {
         return {
            form: {
               autoType: 0,
               engineType: '',
               engine: '',
               price: '',
               issueDate: '',
               commerceType: 0
            },
            engineTypes: [
               {name: this.$t('benzin'), id: 1},
               {name: this.$t('dizel'), id: 2},
               {name: this.$t('gas'), id: 3},
               {name: this.$t('hybrid_benzin'), id: 4},
               {name: this.$t('hybrid_dizel'), id: 5},
               {name: this.$t('electrical'), id: 6}
            ],
            commerceTypes: [
               { key: 0, name: this.$t('other_countries') },
               { key: 1, name: this.$t('free_trade') }
            ],
            pending: false
         }
      },

      computed: {
         ...mapGetters({
            customsResult: 'customsData'
         }),

         crumbs() {
            return [
               { name: this.$t('eservices2'), route: '/e-services' },
               { name: this.$t('customs_calculator') }
            ]
         },

      },

      methods: {
         async reset() {
            this.$v.form.$reset();

            this.form = {
               autoType: 0,
               engineType: '',
               engine: '',
               price: '',
               issueDate: '',
               commerceType: 0
            }

            const form = {
               autoType: 'Car',
               engineType: 'Petrol',
               engine: 1300,
               price: 0,
               issueDate: "01.04.2020",
               commerceType: 'Free'
            };

            await this.$store.dispatch('fetchCustoms', form);
         },

         async calculate() {
            let engineType, commerceType;

            if (this.form.engineType === 1) engineType = 'Petrol';
            else if (this.form.engineType === 2) engineType = 'Diesel';
            else if (this.form.engineType === 3) engineType = 'Gas';
            else if (this.form.engineType === 4) engineType = 'HybridPetrol';
            else if (this.form.engineType === 5) engineType = 'HybridDiesel';
            else engineType = 'Electric';

            if (this.form.commerceType === 0) commerceType = 'nonFree';
            else commerceType = 'free';

            const form = {
               autoType: 0,
               engineType: engineType,
               engine: this.form.engine,
               price: this.form.price,
               issueDate: this.form.issueDate,
               commerceType: commerceType
            };

            await this.$store.dispatch('fetchCustoms', form);
            await this.$cookies.set('customsData', form);
         },

         async submit() {
            try {
               this.$v.form.$touch();
               if (this.$v.form.$error) {
                  this.$toasted.error(this.$t('required_fields'));
                  setTimeout(() => this.scrollTo('.hasError', [-75, -190]), 20);
                  return;
               }

               this.pending = true;
               await this.calculate();
               this.pending = false;
            } catch (e) {
               console.error(e);
            }
         }
      },

      watch: {
         'form.engineType'(val) {
            if (val === 6) this.form.engine = 0;
         },

         // locale(val) {
         //    setTimeout(() => this.form.price = this.$cookies.get('customsData').price, 300)
         //    // console.log(this.form)
         //    console.log(this.$cookies.get('customsData'));
         // }
      },

      validations: {
         form: {
            engineType: { required },
            price: { required },
            engine: {
               required: requiredIf(function () {
                  return this.form.engineType === '' || this.form.engineType !== 6;
               }),
            },
            issueDate: { required },
         }
      }
   }
</script>

<style lang="scss">
   .calculator-customs {
      padding-bottom: 120px;

      .card {
         padding: 32px 24px 24px;

         h4 {
            font-weight: 600;
            font-size: 24px;
            line-height: 28px;
            color: #1B2434;
            margin-bottom: 20px;
         }
      }

      .calculator__results {
         .vehicle-specs {
            ul {
               li {
                  display: flex;
                  align-items: center;
                  justify-content: space-between;
                  gap: 20px;
                  padding: 20px 0;
                  border-bottom: 1px solid #E3E8EF;

                  span {
                     font-size: 16px;
                     line-height: 20px;

                     &:first-child {
                        color: #364152;
                        font-weight: 400;
                     }

                     &:last-child {
                        color: #121926;
                        font-weight: 500;
                     }
                  }
               }
            }

            .sum {
               display: flex;
               align-items: center;
               justify-content: space-between;
               margin-top: 20px;

               span {
                  color: #121926;
                  font-size: 20px;
                  font-weight: 600;
                  line-height: 24px;
               }
            }
         }
      }

      .wrappTitle {
         font-weight: 700;
         font-size: 18px;
         line-height: 28px;
         color: #121926;
         margin: 15px 0;
      }

      .wrapp {
         .form-group {
            label {
               padding: 14px 16px;
               height: max-content;
            }

            .text-truncate {
               text-overflow: unset;
               white-space: unset;
               margin-bottom: 0;
               line-height: 20px;
            }
         }
      }
   }

   .dark-mode {
      .calculator-customs {
         .vehicle-specs {
            ul {
               li {
                  border-color: #4B5565;

                  span {
                     color: #9AA4B2 !important;
                  }
               }
            }

            .sum {
               span {
                  color: #EEF2F6 !important;
               }
            }
         }

         .wrappTitle {
            color: #EEF2F6;
         }
      }
   }

   @media (max-width: 600px) {
      .dark-mode {
         .calculator-customs {
            .calculator__inputs {
               background-color: transparent;

               .form-group {
                  .select-menu {
                     &:not(.invalid) {
                        .select-menu_label {
                           border-color: #364152;
                           background-color: #1B2434 !important;
                        }
                     }
                  }

                  .text-input {
                     input {
                        &:not(.invalid) {
                           border-color: #364152;
                           background-color: #1B2434 !important;
                        }
                     }
                  }

                  .checkbox-input {
                     label {
                        border-color: #364152;
                        background-color: #1B2434 !important;

                        .text-truncate {
                           color: #CDD5DF;
                        }
                     }
                  }
               }
            }

            .wrapp {
               .form-group {
                  label {
                     border-color: #364152;
                     background-color: #1B2434 !important;
                  }
               }
            }
         }
      }
   }
</style>
