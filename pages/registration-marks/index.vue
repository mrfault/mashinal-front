<template>
   <div class="registrationMarks index">
      <div class="container">
         <div class="row">
            <div class="col">
               <div class="registrationMarks__hero">
                  <div class="registrationMarks__hero-text">
                     <breadcrumbs :crumbs="crumbs" />

                     <h4 class="registrationMarks__hero-title">Qeydiyyat nişanları</h4>
                  </div>
               </div>

               <div class="registrationMarks__filters">
                  <div class="row">
                     <div class="col-2 col-xl-2">
                        <form-select
                           :label="'01 - Abşeron'"
                           :options="getRegionNumbers"
                           :clearPlaceholder="true"
                           v-model="form.region"
                           has-search
                        />
                     </div>

                     <div class="col-1 col-xl-1">
                        <form-select
                           :label="'A'"
                           :options="numbers"
                           :clearPlaceholder="true"
                           v-model="form.region_letter1"
                           has-search
                        />
                     </div>

                     <div class="col-1 col-xl-1">
                        <form-select
                           :label="'A'"
                           :options="numbers"
                           :clearPlaceholder="true"
                           v-model="form.region_letter2"
                           has-search
                        />
                     </div>

                     <div class="col-1 col-xl-1">
                        <form-numeric-input
                           :max-value="999"
                           :defaultValue="''"
                           :invalid="$v.region_number.$error"
                           @change="$v.$touch()"
                           v-model="form.region_number"
                        />
                     </div>

                     <div class="col-1 col-xl-1" style="width: 12.499999995%; flex: 0 0 12.499%;max-width: 12.499%;">
                        <form-numeric-input
                           :placeholder="$t('price_from')"
                           :defaultValue="''"
                           v-model="form.price_min"
                        />
                     </div>

                     <div class="col-1 col-xl-1" style="width: 12.499999995%; flex: 0 0 12.499%;max-width: 12.499%;">
                        <form-numeric-input
                           :placeholder="$t('price_to')"
                           :defaultValue="''"
                           v-model="form.price_max"
                        />
                     </div>

                     <div class="col-2 col-xl-2">
                        <form-select
                           :label="'Valyuta'"
                           :options="currency"
                           :clearPlaceholder="true"
                           v-model="form.currency_id"
                           has-search
                        />
                     </div>

                     <div class="col-2 col-xl-2">
                        <form-select
                           :label="$t('city')"
                           :options="cities.regions"
                           :clearPlaceholder="true"
                           v-model="form.region_id"
                           has-search
                        />
                     </div>
                  </div>
               </div>

               <pre>{{form}}</pre>
               <RegistrationMarksGrid
                  :items="getRegistrationMarks"
               >
                  <template #head>
                     <h4 class="registrationMarksGrid__title">{{ $t('search_result') }}</h4>

                     <form-select
                        :label="$t('show_cheap_first')"
                        :options="sortItems"
                        :clearPlaceholder="true"
                        v-model="sort_id"
                        has-search
                     />
                  </template>
               </RegistrationMarksGrid>
            </div>
         </div>
      </div>
   </div>
</template>

<script>
   import { mapGetters } from "vuex";
   import { minLength } from "vuelidate/lib/validators";
   import RegistrationMarksGrid from "~/components/announcements/RegistrationMarksGrid.vue";

   export default {
      components: {
         RegistrationMarksGrid,
      },

      head() {
         return this.$headMeta({
            title: this.$t('advanced_search')
         });
      },

      data() {
         return {
            form: {
               region: '',
               region_letter1: '',
               region_letter2: '',
               region_number: '',
               price_min: '',
               price_max: '',
               currency_id: '',
               region_id: '',
               sort_id: ''
            },

            numbers: [
               { name: 'A' },
               { name: 'B' },
               { name: 'C' },
               { name: 'D' },
               { name: 'E' },
               { name: 'F' },
               { name: 'G' },
               { name: 'H' },
               { name: 'I' },
               { name: 'J' },
               { name: 'K' },
               { name: 'L' },
               { name: 'M' },
               { name: 'N' },
               { name: 'O' },
               { name: 'P' },
               { name: 'Q' },
               { name: 'R' },
               { name: 'S' },
               { name: 'T' },
               { name: 'U' },
               { name: 'V' },
               { name: 'W' },
               { name: 'X' },
               { name: 'Y' },
               { name: 'Z' }
            ],
            currency: [
               { id: 1, name: 'AZN' },
               { id: 2, name: 'USD' },
               { id: 3, name: 'EUR' }
            ],
            sortItems: [
               { id: 1, name: 'Əvvəlcə ucuz' },
               { id: 2, name: 'Əvvəlcə bahalı' }
            ]
         }
      },

      methods: {
         // inputValidation() {
         //    this.$v.$touch();
         // }
      },

      computed: {
         ...mapGetters({
            getRegionNumbers: 'getRegionNumbers',
            getRegistrationMarks: 'getRegistrationMarks',
            cities: 'sellOptions'
         }),

         crumbs() {
            return [{ name: this.$t('registration_marks') }]
         }
      },

      async asyncData({ store }) {
         await store.dispatch('fetchRegionNumbers');
         await store.dispatch('fetchRegistrationMarks');
         await store.dispatch('getOptions');
      },

      validations: {
         region_number: { minLength: minLength(3) }
      }
   }
</script>

<style lang="scss">
   .registrationMarks {
      &__hero {
         position: relative;
         width: 100%;
         height: 280px;
         border-radius: 8px;
         overflow: hidden;
         background: url("/images/registrationMarks__bg.png") center center / cover no-repeat;

         &:before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            max-width: 744px;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, #081A3E -10.98%, rgba(0, 0, 0, 0) 100%);
         }

         &-text {
            position: absolute;
            left: 64px;
            bottom: 48px;
            z-index: 2;

            .breadcrumbs {
               ul {
                  li {
                     font-weight: 500;
                     font-size: 16px;
                     line-height: 20px;
                     opacity: 0.9;

                     i {
                        &:before {
                           color: #FFFFFF;
                        }
                     }

                     &.active {
                        color: #FFFFFF;
                     }
                  }
               }
            }
         }

         &-title {
            font-weight: 700;
            font-size: 40px;
            line-height: 48px;
            color: #FFFFFF;
         }
      }

      &__filters {
         width: 100%;
         height: 116px;
         padding: 32px 22px;
         border-radius: 8px;
         border: 1px solid #9AA4B2;
         background-color: #FFFFFF;
         margin: 40px 0;
      }

      &.index {
         .select-menu_label {
            padding: 25px 15px;
            border-radius: 6px;
            border: 1px solid #CDD5DF;
            background-color: #FFFFFF;
            cursor: pointer;

            .text-truncate {
               padding-right: 15px;
            }

            &.selected {
               //font-weight: 600;
               //font-size: 16px;
               //color: #1B2434;
               color: unset;
            }
         }

         .text-input {
            input {
               height: 52px;
               border-radius: 6px;
               border: 1px solid #CDD5DF;
               background-color: #FFFFFF;
            }
         }
      }
   }
</style>