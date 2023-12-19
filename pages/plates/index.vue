<template>
   <div class="registrationMarks index">
      <div class="container">
         <div class="row">
            <div class="col">
               <h2 class="registrationMarks__title">{{ $t('registration_marks') }}</h2>

               <div class="registrationMarks__filters">
                  <div class="registrationMarks__filters-item">
                     <inline-svg src="/icons/flag_2.svg" />

                     <inline-svg src="/icons/flag_3.svg" />

                     <form-select
                        :options="getRegionNumbers"
                        :clear-placeholder="true"
                        :clear-option="false"
                        :new-label="false"
                        v-model="form.serial_number"
                        has-search
                     />

                     <form-select
                        :options="numbers"
                        :clear-placeholder="true"
                        :clear-option="false"
                        :new-label="false"
                        :searchInputLength="1"
                        v-model="form.serial_letter1"
                        has-search
                     />

                     <form-select
                        :options="numbers"
                        :clear-placeholder="true"
                        :clear-option="false"
                        :new-label="false"
                        :searchInputLength="1"
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

                  <div class="wrapp">
                     <div class="wrapp__item">
                        <form-numeric-input
                           :placeholder="$t(`${isMobileBreakpoint ? 'min' : 'price_from_2'}`)"
                           v-model="form.price_from"
                        />
                        <span class="currency">AZN</span>
                     </div>

                     <div class="wrapp__item">
                        <form-numeric-input
                           :placeholder="$t(`${isMobileBreakpoint ? 'max' : 'price_to_2'}`)"
                           v-model="form.price_to"
                        />
                        <span class="currency">AZN</span>
                     </div>
                  </div>
               </div>

               <PlatesGrid
                  :items="getRegistrationMarks?.data"
                  :showFavoriteBtn="true"
                  v-model="loading"
                  v-if="getRegistrationMarks?.data.length"
               >
                  <template #head>
                     <Cap :className="'mb24'">
                        <template #left>
                           <h3>{{ $t('announcements') }}</h3>
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

<!--               <HandleIds :items="handleIdsOptions" />-->
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
               { key: 'price_asc', value: 'asc', name: this.$t('show_cheap_first') },
               { key: 'price_desc', value: 'desc', name: this.$t('show_expensive_first') }
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
            let params = new URLSearchParams(this.$route.query?.filters);

            this.$route.query?.filters?.slice(1).split('&').forEach(query => {
               if (query.split('=')[0] === 'page') {
                  this.page = +query.split('=')[1];
               }

               for (const item in this.form) {
                  if (query.split('=')[0] === item) {
                     if (item === 'region_id'|| item === 'currency') {
                        this.form[item] = +query.split('=')[1];
                     } else {
                        this.form[item] = query.split('=')[1];
                     }
                  } else if (params.get('sort_by') === 'price') {
                     this.form.sorting.key = `${params.get('sort_by')}_${params.get('sort_order')}`;
                     this.form.sorting.value = params.get('sort_order');
                  }
               }
            });
         }
      },

      computed: {
         ...mapGetters({
            getRegionNumbers: 'getRegionNumbers',
            getRegistrationMarks: 'getRegistrationMarks',
            // cities: 'sellOptions',
            loading: 'loadingData'
         }),

         crumbs() {
            return [{ name: this.$t('registration_marks') }]
         },

         handleIdsOptions() {
            let ids = [];

            ids.push({
               type: 'plate',
               ids: [...this.getRegistrationMarks?.data?.map(item => item.id)]
            });

            return ids;
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
                     if (value.key === 'price_desc' || value.key === 'price_asc') query.append('sort_by', 'price');
                     else query.append('sort_by', value.key);

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
                        if (value.key === 'price_desc' || value.key === 'price_asc') query.append('sort_by', 'price');
                        else query.append('sort_by', value.key);

                        query.append('sort_order', value.value);
                     } else {
                        query.append(key, value);
                     }
                  }
               }

               this.$router.push({
                  query: { filters: `?page=${this.page}&${query.toString()}` }
               })

               clearTimeout(this.timeout);
               this.timeout = setTimeout(() => {
                  this.$store.dispatch('fetchRegistrationMarks', `?page=${this.page}&${query.toString()}`);
               }, 300);

               // this.page = 1;
            }
         },
      },

      async mounted() {
         await this.$store.dispatch('fetchRegionNumbers');
         this.setInitialValues();

         // if (this.$route.query?.filters) {
         //    this.$route.query?.filters.slice(1).split('&').forEach(item => {
         //       if (item.split('=')[1] === 'price') {
         //          // this.form.sorting.key = `${item.split('=')[1]}_${item.split('=')[0].sort_order}`;
         //          // this.form.sorting.value = item.split('=')[0].sort_order;
         //       } else {
         //          // this.form.sorting.key = item.split('=')[0].sort_by;
         //          // this.form.sorting.value = item.split('=')[0].sort_order;
         //       }
         //    })
         // }
      },

      async asyncData({ store }) {
         await store.dispatch('fetchRegistrationMarks');
         // await store.dispatch('fetchRegionNumbers');
         // await store.dispatch('getOptions');
      },

      validations: {
         car_number: { minLength: minLength(3) }
      }
   }
</script>

<style lang="scss">
   .registrationMarks {
      &__title {
         color: #121926;
         font-size: 32px;
         font-weight: 600;
         line-height: 38px;
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

      }

      &__filters {
         display: flex;
         align-items: center;
         justify-content: center;
         flex-direction: column;
         gap: 12px;
         width: 100%;
         padding: 16px 0;
         border-radius: 12px;
         margin-top: 24px;
         background: url("/images/plates_filters_bg.png") center center / cover no-repeat;

         &-item {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 12px;
            max-width: 478px;
            padding: 8px 12px;
            border-radius: 8px;
            background-color: #FFFFFF;

            svg {
               min-width: 30px;
               height: 38px;

               &:last-of-type {
                  display: none;
               }
            }

            .form-group {
               width: 72px;

               .select-menu {
                  &_label {
                     height: 44px;
                  }
               }

               .text-input {
                  input {
                     height: 44px;
                     padding: 0 12px;
                  }
               }

               &:first-of-type {
                  width: 160px;
               }
            }
         }

         .wrapp {
            display: flex;
            justify-content: space-between;
            gap: 12px;
            width: 100%;
            max-width: 478px;

            &__item {
               position: relative;
               display: flex;
               align-items: center;
               width: 100%;

               .currency {
                  position: absolute;
                  right: 12px;
                  color: #00359E;
                  font-size: 16px;
                  font-weight: 600;
                  line-height: 28px;
                  padding-left: 10px;
                  background-color: #FFFFFF;
               }
            }
         }
      }

      &.index {
         padding-top: 24px;

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
         &__filters {
            &-item {
               background-color: #121926;

               .form-group {
                  .select-menu {
                     &_label {
                        background-color: #1B2434 !important;

                        .text-truncate {
                           color: #CDD5DF;
                        }
                     }
                  }

                  .text-input {
                     input {
                        color: #CDD5DF;
                        background-color: #1B2434 !important;
                     }
                  }
               }

               svg {
                  &:first-of-type {
                     display: none;
                  }

                  &:last-of-type {
                     display: block;
                  }
               }
            }

            .wrapp {
               &__item {
                  .currency {
                     background-color: #121926;
                  }
               }
            }
         }

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

   @media (max-width: 992px) {
      .registrationMarks {
         &__filters {
            //height: 100px;
            background: unset;
            background-color: #FFFFFF;
            border: 2px solid #121926;
         }
      }

      .dark-mode {
         .registrationMarks {
            &__filters {
               border-color: #1B2434;
               background-color: #1B2434;

               &-item {
                  background-color: #1B2434;

                  .form-group {
                     .select-menu {
                        &_label {
                           background-color: #121926 !important;

                           .text-truncate {
                              color: #CDD5DF;
                           }
                        }
                     }

                     .text-input {
                        input {
                           color: #CDD5DF;
                           background-color: #121926 !important;
                        }
                     }
                  }
               }
            }
         }
      }
   }

   @media (max-width: 570px) {
      .registrationMarks {
         &__title {
            margin-top: 0;
            font-size: 20px;
            line-height: 24px;
         }

         &__filters {
            justify-content: unset;
            padding: 10px;
            //height: 68px;

            &-item {
               justify-content: unset;
               width: 100%;
               gap: 8px;
               padding: 0;

               .form-group {
                  width: 100%;
                  min-width: 50px;
                  max-width: 70px;

                  .select-menu {
                     &_label {
                        padding: 0 12px;
                     }
                  }

                  &:first-of-type {
                     width: 100%;
                     min-width: 90px;
                     max-width: 240px;
                  }
               }
            }
         }

         &.index {
            position: relative;

            .col {
               position: unset;
            }

            .container {
               padding: 12px !important;
            }

            .registrationMarksGrid {
               margin-top: 30px;
            }
         }
      }
   }

   @media (max-width: 425px) {
      .registrationMarks {
         &__filters {
            padding: 5px;
         }
      }
   }
</style>
