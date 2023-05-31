<template>
   <div class="registrationMarks index">
      <div class="registrationMarks__hero mobile">
         <div class="registrationMarks__hero-text">
            <breadcrumbs :crumbs="crumbs" />

            <h4 class="registrationMarks__hero-title">{{ $t('registration_marks') }}</h4>
         </div>
      </div>

      <div class="container">
         <div class="row">
            <div class="col">
               <div class="registrationMarks__hero">
                  <div class="registrationMarks__hero-text">
                     <breadcrumbs :crumbs="crumbs" />

                     <h4 class="registrationMarks__hero-title">{{ $t('registration_marks') }}</h4>
                  </div>
               </div>

               <div class="registrationMarks__filters">
                  <div class="divider">
<!--                     :className="'new'"-->
                     <form-select
                        :label="'01 - Abşeron'"
                        :options="getRegionNumbers"
                        :clearPlaceholder="true"
                        v-model="form.region"
                        has-search
                     />

<!--                     :className="'new'"-->
                     <form-select
                        :label="'A'"
                        :options="numbers"
                        :clearPlaceholder="true"
                        v-model="form.serial_letter1"
                        has-search
                     />

<!--                     :className="'new'"-->
                     <form-select
                        :label="'A'"
                        :options="numbers"
                        :clearPlaceholder="true"
                        v-model="form.serial_letter2"
                        has-search
                     />

                     <form-numeric-input
                        :maxlength="3"
                        :float="true"
                        :defaultValue="''"
                        :invalid="$v.car_number.$error"
                        @change="$v.$touch()"
                        v-model="form.car_number"
                     />
                  </div>

                  <div class="divider">
                     <form-numeric-input
                        :placeholder="$t('price_from')"
                        :defaultValue="''"
                        v-model="form.price_from"
                     />

                     <form-numeric-input
                        :placeholder="$t('price_to')"
                        :defaultValue="''"
                        v-model="form.price_to"
                     />
                  </div>

                  <div class="divider">
<!--                     :className="'new'"-->
                     <form-select
                        :label="$t('currency')"
                        :options="currency"
                        :clearPlaceholder="true"
                        v-model="form.currency_id"
                        has-search
                     />

<!--                     :className="'new'"-->
                     <form-select
                        :label="$t('city')"
                        :options="cities.regions"
                        :clearPlaceholder="true"
                        :valueType="'string'"
                        v-model="form.region_id"
                        has-search
                     />
                  </div>
               </div>

               <RegistrationMarksGrid
                  :items="getRegistrationMarks?.data"
                  :showFavoriteBtn="true"
                  v-model="loading"
                  v-if="getRegistrationMarks?.data.length"
               >
                  <template #head>
                     <Cap :className="'mb40'">
                        <template #left>
                           <h3>{{ $t('search_result') }}</h3>
                        </template>

                        <template #right>
                           <form-select
                              :label="$t('show_by_date')"
                              :options="sortItems"
                              :clearPlaceholder="true"
                              :clear-option="false"
                              v-model="form.sorting"
                           />
                        </template>
                     </Cap>
                  </template>
               </RegistrationMarksGrid>

               <pagination
                  v-if="getRegistrationMarks?.meta?.last_page > 1"
                  :page-count="getRegistrationMarks?.meta?.last_page"
                  :value="form.page"
                  @change-page="changePage"
               />

               <no-results
                  v-if="!getRegistrationMarks?.data.length"
                  :text="$t('empty_result')"
                  :template="'new'"
                  :url="'/images/empty_result.svg'"
               >
               </no-results>

               <HandleIds :type="'plate'" :items="getRegistrationMarks.data" />
            </div>
         </div>
      </div>
   </div>
</template>

<script>
   import { mapGetters } from "vuex";
   import { minLength } from "vuelidate/lib/validators";
   import RegistrationMarksGrid from "~/components/announcements/RegistrationMarksGrid.vue";
   import NoResults from "~/components/elements/NoResults.vue";
   import HandleIds from "~/components/announcements/HandleIds.vue";
   import Cap from "~/components/elements/Cap.vue";

   export default {
      head() {
         return this.$headMeta({
            title: this.$t('registration_marks'),
            // description: this.$t('meta-registration_marks')
         });
      },

      nuxtI18n: {
         paths: {
            az: '/qeydiyyat-nisanlari'
         }
      },

      components: {
         Cap,
         RegistrationMarksGrid,
         NoResults,
         HandleIds
      },

      transition: 'fade-y-20',

      data() {
         return {
            timeout: null,

            form: {
               region: '',
               serial_number: '',
               serial_letter1: '',
               serial_letter2: '',
               car_number: '',
               price_from: '',
               price_to: '',
               currency_id: '',
               region_id: '',
               sorting: 'created_at_desc',
               page: 1
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
               { id: '1', name: 'AZN' },
               { id: '2', name: 'USD' },
               // { id: 3, name: 'EUR' }
            ],
            sortItems: [
               { id: 'created_at_desc', name: this.$t('show_by_date') },
               { id: 'price_asc', name: this.$t('show_cheap_first') },
               { id: 'price_desc', name: this.$t('show_expensive_first') }
            ]
         }
      },

      methods: {
         changePage(e) {
            this.$store.commit('mutate',{ property: 'loadingData', value: true });
            this.form.page = e;
            this.scrollTo('.registrationMarks__filters', [-15, -20]);
         }
      },

      watch: {
         form: {
            handler() {
               let queryArray = [],
                   query;

               if (this.form.page) queryArray.push(`?page=${this.form.page}`);
               if (this.form.region) {
                  queryArray.push(`&region=${this.form.region}`);
                  this.form.serial_number = this.form.region.split('-')[0];
               } else {
                  this.form.serial_number = '';
               }
               if (this.form.serial_number) queryArray.push(`&serial_number=${this.form.serial_number}`);
               if (this.form.serial_letter1) queryArray.push(`&serial_letter1=${this.form.serial_letter1}`);
               if (this.form.serial_letter2) queryArray.push(`&serial_letter2=${this.form.serial_letter2}`);
               if (this.form.car_number) queryArray.push(`&car_number=${this.form.car_number}`);
               if (this.form.price_from) queryArray.push(`&price_from=${this.form.price_from}`);
               if (this.form.price_to) queryArray.push(`&price_to=${this.form.price_to}`);
               if (this.form.currency_id) queryArray.push(`&currency_id=${this.form.currency_id}`);
               if (this.form.region_id) queryArray.push(`&region_id=${this.form.region_id}`);
               if (this.form.sorting) queryArray.push(`&sorting=${this.form.sorting}`);

               query = queryArray.join('');

               clearTimeout(this.timeout);
               this.timeout = setTimeout(() => {
                  this.$store.dispatch('fetchRegistrationMarks', query);
               }, 400);

               this.$router.push({
                  query: { filters: query }
               })
            },
            deep: true
         },
      },

      mounted() {
         this.$route.query?.filters?.split('&').forEach(query => {
            for (const item in this.form) {
               if (query.split('=')[0] === item) {
                  if (item === 'region_id') {
                     this.form[item] = Number(query.split('=')[1]);
                  } else {
                     this.form[item] = query.split('=')[1];
                  }
               }
            }
         })
      },

      computed: {
         ...mapGetters({
            getRegionNumbers: 'getRegionNumbers',
            getRegistrationMarks: 'getRegistrationMarks',
            cities: 'sellOptions',
            loading: 'loadingData'
         }),

         crumbs() {
            return [{ name: this.$t('registration_marks') }]
         }
      },

      async asyncData({ store }) {
         await store.dispatch('fetchRegionNumbers');
         await store.dispatch('fetchRegistrationMarks', `?page=1&sorting=created_at_desc`);
         await store.dispatch('getOptions');
      },

      validations: {
         car_number: { minLength: minLength(3) }
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
            //max-width: 744px;
            width: 85%;
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
            margin: 0;
         }

         &.mobile {
            display: none;
         }
      }

      &__filters {
         display: flex;
         align-items: center;
         width: 100%;
         padding: 24px;
         border-radius: 12px;
         background-color: #FFFFFF;
         margin: 40px 0;

         .divider {
            display: flex;
            align-items: center;
            justify-content: space-between;

            .form-group {
               &:not(:first-child) {
                  margin-left: 20px;
               }
            }

            &:not(:first-child) {
               margin-left: 20px;
            }

            &:first-child {
               .form-group {
                  width: 72px;

                  &:first-child {
                     width: 160px;
                  }
               }
            }

            &:nth-child(2) {
               .form-group {
                  width: 120px;
               }
            }

            &:last-child {
               .form-group {
                  width: 128px;

                  &:last-child {
                     width: 152px;
                  }
               }
            }
         }
      }

      &.index {
         //margin-top: 20px;
         //.select-menu_label {
            //padding: 26px 15px;
         //}

         //.text-input {
         //   input {
         //      height: 52px;
         //       border-radius: 6px;
         //      &::placeholder {
         //         color: #697586;
         //      }
         //   }
         //}

         .pagination {
            li {
               button {
                  background-color: transparent;
               }

               &.active {
                  button {
                     color: unset;
                     background: #F9FAFB;
                     border-radius: 8px;
                     border: 1px solid #00000021;

                     &:after {
                        content: unset;
                     }
                  }
               }
            }
         }
      }
   }

   .dark-mode {
      .registrationMarks {
         &.index {
            .pagination {
               li {
                  &.active {
                     button {
                        color: #000000;
                     }
                  }
               }
            }
         }
      }
   }

   @media (max-width: 1150px) {
      .registrationMarks {
         &__filters {
            padding: 20px;

            .divider {
               .form-group {
                  &:not(:first-child) {
                     margin-left: 16px;
                  }
               }

               &:first-child {
                  .form-group {
                     width: 65px;

                     &:first-child {
                        width: 140px;
                     }
                  }
               }

               &:nth-child(2) {
                  .form-group {
                     width: 105px;
                  }
               }

               &:last-child {
                  .form-group {
                     width: 105px;

                     &:last-child {
                        width: 130px;
                     }
                  }
               }
            }
         }
      }
   }

   @media (max-width: 992px) {
      .registrationMarks {
         &__hero {
            height: 230px;

            &-text {
               left: 40px;
               bottom: 30px;

               .breadcrumbs {
                  display: flex !important;

                  ul {
                     height: 40px;
                  }
               }
            }

            &-title {
               font-size: 30px;
            }
         }

         &__filters {
            flex-wrap: wrap;

            .divider {
               &:not(:first-child) {
                  margin-left: unset;
                  margin-top: 15px;
               }

               &:first-child {
                  .form-group {
                     width: 69px;

                     &:first-child {
                        width: 255px;
                     }
                  }
               }

               &:nth-child(2) {
                  .form-group {
                     width: 119px;
                  }
               }

               &:last-child {
                  margin-left: 16px;

                  .form-group {
                     width: 112px;

                     &:last-child {
                        width: 112px;
                     }
                  }
               }
            }
         }

         //.pagination {
         //   margin: 0 0 65px 0;
         //}
      }
   }

   @media (max-width: 570px) {
      .registrationMarks {
         &__hero {
            display: none;

            &.mobile {
               display: block;
               border-radius: unset;

               .breadcrumbs {
                  ul {
                     height: 20px;

                     li {
                        font-size: 12px;

                        .icon-home {
                           &:before {
                              font-size: 12px;
                           }
                        }

                        .icon-chevron-right {
                           &:before {
                              font-size: 8px;
                           }
                        }
                     }
                  }
               }

               .registrationMarks__hero-text {
                  left: 20px;
                  bottom: 20px;
               }

               .registrationMarks__hero-title {
                  font-size: 24px;
               }
            }
         }

         &__filters {
            position: absolute;
            top: 231px;
            left: 0;
            margin: 0;
            border: none;
            border-radius: unset;
            .divider {
               &:not(:first-child) {
                  margin-left: 0;
               }

               &:first-child {
                  width: 100%;
                  .form-group {
                     width: 40%;

                     &:first-child {
                        width: 75%;
                     }
                  }
               }

               &:nth-child(2), &:last-child {
                  width: 100%;
                  gap: 16px;
                  .form-group {
                     width: 100%;
                     &:last-child {
                        width: 100%;
                        margin-left: 0;
                     }
                  }
               }
            }
         }

         &.index {
            position: relative;
            margin-top: -32px;

            .col {
               position: unset;
            }

            .registrationMarksGrid {
               margin-top: 270px;
            }

            .no-results {
               margin: 280px 0 80px 0;
            }
         }
      }
   }

   @media (max-width: 430px) {
      .registrationMarks {
         &__filters {
            padding: 24px 16px;
            .divider {
               &:first-child {
                  .form-group {
                     &:not(:first-child) {
                        margin-left: 8px;
                     }
                  }
               }
               .select-menu_label {
                  padding: 26px 12px;
               }

               .text-input {
                  input {
                     padding: 12px;
                  }
               }
            }
         }

         &.index {
            .container {
               padding: 0 10px;
            }
         }
      }
   }

   @media (max-width: 365px) {
      .registrationMarks {
         &__filters {
            padding: 20px 12px;
         }
      }
   }
</style>
