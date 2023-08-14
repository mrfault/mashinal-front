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
                     <breadcrumbs class="light-color" :crumbs="crumbs" />

                     <h4 class="registrationMarks__hero-title">{{ $t('registration_marks') }}</h4>
                  </div>
               </div>

               <div class="registrationMarks__filters">
                  <div class="divider">
                     <form-select
                        :label="$t('region_2')"
                        :input-placeholder="$t('region_search')"
                        :options="getRegionNumbers"
                        :clear-placeholder="true"
                        :clear-option="false"
                        v-model="form.serial_number"
                        has-search
                     />

                     <form-select
                        :label="'A'"
                        :options="numbers"
                        :clear-placeholder="true"
                        :clear-option="false"
                        :new-label="false"
                        :searchInputLength="1"
                        :inputSearchType="'text'"
                        v-model="form.serial_letter1"
                        has-search
                     />

                     <form-select
                        :label="'A'"
                        :options="numbers"
                        :clear-placeholder="true"
                        :clear-option="false"
                        :new-label="false"
                        :searchInputLength="1"
                        :inputSearchType="'text'"
                        v-model="form.serial_letter2"
                        has-search
                     />

                     <form-numeric-input
                        :maxlength="3"
                        :float="true"
                        :invalid="$v.car_number.$error"
                        @change="$v.$touch()"
                        v-model="form.car_number"
                     />
                  </div>

                  <div class="divider">
                     <form-numeric-input
                        :placeholder="$t('price_from')"
                        v-model="form.price_from"
                     />

                     <form-numeric-input
                        :placeholder="$t('price_to')"
                        v-model="form.price_to"
                     />
                  </div>

                  <div class="divider">
                     <form-select
                        :label="$t('currency')"
                        :options="currencies"
                        :clearPlaceholder="true"
                        :clear-option="false"
                        v-model="form.currency"
                     />

                     <form-select
                        :label="$t('city')"
                        :input-placeholder="$t('city_search')"
                        :options="cities.regions"
                        :clear-placeholder="true"
                        :clear-option="false"
                        v-model="form.region_id"
                        has-search
                     />
                  </div>
               </div>

               <PlatesGrid
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
                              :label="$t('sorting_2')"
                              :options="sortItems"
                              :clearPlaceholder="true"
                              :clear-option="false"
                              :allowClear="false"
                              :objectInValue="true"
                              v-model="form.sorting"
                           />
                        </template>
                     </Cap>
                  </template>
               </PlatesGrid>

               <pagination
                  v-if="getRegistrationMarks?.meta?.total_pages > 1"
                  :page-count="getRegistrationMarks?.meta?.total_pages"
                  :value="page"
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
   import PlatesGrid from "~/components/announcements/PlatesGrid.vue";
   import NoResults from "~/components/elements/NoResults.vue";
   import HandleIds from "~/components/announcements/HandleIds.vue";
   import Cap from "~/components/elements/Cap.vue";
   import CustomDropdown from "~/components/elements/CustomDropdown.vue";
   import { mapGetters } from "vuex";
   import { minLength } from "vuelidate/lib/validators";

   export default {
      name: 'PlatesPage',

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
         PlatesGrid,
         NoResults,
         HandleIds,
         CustomDropdown
      },

      transition: 'fade-y-20',

      data() {
         return {
            timeout: null,
            page: 1,

            form: {
               serial_number: '',
               serial_letter1: '',
               serial_letter2: '',
               car_number: '',
               price_from: '',
               price_to: '',
               currency: '',
               region_id: '',
               sorting: { key: 'created_at', value: 'desc', name: this.$t('show_by_date') }
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
            currencies: [
               { id: 1, name: 'AZN' },
               { id: 2, name: 'USD' }
            ],
            sortItems: [
               { key: 'created_at', value: 'desc', name: this.$t('show_by_date') },
               { key: 'price', value: 'asc', name: this.$t('show_cheap_first') },
               { key: 'price', value: 'desc', name: this.$t('show_expensive_first') }
            ]
         }
      },

      methods: {
         changePage(e) {
            this.$store.commit('mutate',{ property: 'loadingData', value: true });
            this.page = e;
            this.scrollTo('.registrationMarks__filters', [-15, -50]);
         },

         setInitialValues() {
            this.$route.query?.filters?.slice(1).split('&').forEach(query => {
               if (query.split('=')[0] === 'page') this.page = +query.split('=')[1];

               for (const item in this.form) {
                  if (query.split('=')[0] === item) {
                     if (item === 'region_id'|| item === 'currency') {
                        this.form[item] = +query.split('=')[1];
                     } else {
                        this.form[item] = query.split('=')[1];
                     }
                  } else if (typeof this.form[item] === 'object' && query.split('=')[0] !== 'page') {
                     console.log('w',this.form[item])
                     console.log('e', query.split('='))
                     if (query.split('=')[0] === 'sort_by') {
                        this.form.sorting.key = query.split('=')[1]
                     } else {
                        this.form.sorting.value = query.split('=')[1]
                     }

                     this.sortItems.forEach(item => {
                        if (item.key === this.form.sorting.key && item.value === this.form.sorting.value) {
                           this.form.sorting.name = item.name;
                        }
                     });
                  }
               }
            });
         }
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

      watch: {
         page() {
            const query = new URLSearchParams();

            for (const key in this.form) {
               const value = this.form[key];

               if (value !== '') {
                  if (key !== 'sorting') {
                     query.append(key, value);
                  } else {
                     query.append('sort_by', value.key);
                     query.append('sort_order', value.value);
                  }
               }
            }

            this.$store.dispatch('fetchRegistrationMarks', `?page=${this.page}&${query.toString()}`);

            this.$router.push({
               query: { filters: `?page=${this.page}&${query.toString()}` }
            })
         },

         form: {
            deep: true,
            handler: function () {
               this.$store.commit('mutate',{ property: 'loadingData', value: true });

               const query = new URLSearchParams();

               for (const key in this.form) {
                  const value = this.form[key];
                  if (value !== '') {
                     if (key === 'serial_number') {
                        this.form.serial_number = this.form.serial_number.split('-')[0].replace(/\s/g, "");
                        query.append('serial_number', value);
                     } else if (key === 'sorting') {
                        query.append('sort_by', value.key);
                        query.append('sort_order', value.value);
                     } else {
                        query.append(key, value);
                     }
                  }
               }

               this.$router.push({
                  query: { filters: `?page=1&${query.toString()}` }
               })

               clearTimeout(this.timeout);
               this.timeout = setTimeout(() => {
                  this.$store.dispatch('fetchRegistrationMarks', `?page=1&${query.toString()}`);
               }, 300);

               this.page = 1;
            }
         },
      },

      mounted() {
         this.setInitialValues();
      },

      async asyncData({ store }) {
         await store.dispatch('fetchRegionNumbers');
         await store.dispatch('fetchRegistrationMarks');
         await store.dispatch('getOptions');
      },

      validations: {
         car_number: { minLength: minLength(3) }
      }
   }
</script>

<style lang="scss">
   .registrationMarks {
      .breadcrumbs {
         ul {
            li {
               font-weight: 500;
               font-size: 16px;
               line-height: 20px;
               opacity: 0.9;
               color: #FFFFFF;

               i {
                  &:before {
                     color: #FFFFFF;
                  }
               }

               .active {
                  color: #FFFFFF;
               }
            }
         }
      }

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
         margin-top: 40px;

         .divider {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 20px;

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
         padding-top: 32px;

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
               gap: 16px;

               &:not(:first-child) {
                  margin-left: 16px;
               }

               &:first-child {
                  .form-group {
                     width: 67px;

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
                        width: 119px;
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
                        width: 240px;
                     }
                  }
               }

               &:nth-child(2) {
                  .form-group {
                     width: 112px;
                  }
               }

               &:last-child {
                  margin-left: 17px;
                  .form-group {
                     width: 112px;
                     &:last-child {
                        width: 112px;
                     }
                  }
               }
            }
         }
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
                     width: 20%;
                     &:first-child {
                        width: 40%;
                     }
                  }
               }

               &:nth-child(2), &:last-child {
                  width: 100%;

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
                  gap: 8px;
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
