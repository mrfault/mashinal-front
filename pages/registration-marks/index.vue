<template>
   <div class="registrationMarks index">
      <div class="registrationMarks__hero mobile">
         <div class="registrationMarks__hero-text">
            <breadcrumbs :crumbs="crumbs" />

            <h4 class="registrationMarks__hero-title">Qeydiyyat nişanları</h4>
         </div>
      </div>

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
                  <div class="divider">
                     <form-select
                        :label="'01 - Abşeron'"
                        :options="getRegionNumbers"
                        :clearPlaceholder="true"
                        v-model="form.region"
                        has-search
                     />

                     <form-select
                        :label="'A'"
                        :options="numbers"
                        :clearPlaceholder="true"
                        v-model="form.serial_letter1"
                        has-search
                     />

                     <form-select
                        :label="'A'"
                        :options="numbers"
                        :clearPlaceholder="true"
                        v-model="form.serial_letter2"
                        has-search
                     />

                     <form-numeric-input
                        :max-value="999"
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
                     <form-select
                        :label="'Valyuta'"
                        :options="currency"
                        :clearPlaceholder="true"
                        v-model="form.currency_id"
                        has-search
                     />

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
                  :items="getRegistrationMarks.data"
               >
                  <template #head>
                     <h4 class="registrationMarksGrid__title">{{ $t('search_result') }}</h4>

                     <form-select
                        :label="$t('show_cheap_first')"
                        :options="sortItems"
                        :clearPlaceholder="true"
                        v-model="form.order"
                        has-search
                     />
                  </template>
               </RegistrationMarksGrid>

               <pagination
                  v-if="getRegistrationMarks.meta"
                  :page-count="getRegistrationMarks.meta.to"
                  :value="form.page"
                  @change-page="changePage"
               />
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
               order: '',
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
               { id: 'asc', name: 'Əvvəlcə ucuz' },
               { id: 'desc', name: 'Əvvəlcə bahalı' }
            ]
         }
      },

      methods: {
         changePage(e) {
            this.form.page = e;
         }
      },

      watch: {
         form: {
            handler() {
               let queryArray = [],
                   query;

               if (this.form.region) {
                  if (this.form.region.split('-')[0].length < 3) {
                     this.form.serial_number = `0${this.form.region.split('-')[0].slice(0, -1)}`;
                  } else {
                     this.form.serial_number = this.form.region.split('-')[0].slice(0, -1);
                  }
               }

               if (this.form.page) queryArray.push(`?page=${this.form.page}`);
               if (this.form.region) {
                  queryArray.push(`&region=${this.form.region}`);
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
               if (this.form.order) queryArray.push(`&order=${this.form.order}`);

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
         padding: 31px 32px;
         border-radius: 8px;
         border: 1px solid #9AA4B2;
         background-color: #FFFFFF;
         margin: 40px 0;

         .divider {
            display: flex;
            align-items: center;
            justify-content: space-between;

            &:not(:first-child) {
               margin-left: 16px;
            }

            .form-group {
               &:not(:first-child) {
                  margin-left: 16px;
               }
            }

            &:first-child {
               .form-group {
                  width: 80px;

                  &:first-child {
                     width: 224px;
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
                  width: 122px;

                  &:last-child {
                     width: 198px;
                  }
               }
            }
         }
      }

      &.index {
         margin-top: 20px;
         .select-menu_label {
            padding: 26px 15px;
         }

         .text-input {
            input {
               height: 52px;
                border-radius: 6px;
               &::placeholder {
                  color: #697586;
               }
            }
         }

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

                     &:after {
                        content: unset;
                     }
                  }
               }
            }
         }
      }
   }

   @media (max-width: 1250px) {
      .registrationMarks {
         &__filters {
            padding: 27px 23px;
            .divider {
               &:first-child {
                  .form-group {
                     width: 60px;

                     &:first-child {
                        width: 140px;
                     }
                  }
               }

               &:nth-child(2) {
                  .form-group {
                     width: 100px;
                  }
               }

               &:last-child {
                  .form-group {
                     width: 100px;

                     &:last-child {
                        width: 130px;
                     }
                  }
               }
            }
         }
      }
   }

   @media (max-width: 1025px) {
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
                     width: 80px;

                     &:first-child {
                        width: 154px;
                     }
                  }
               }

               &:last-child {
                  margin-left: 10px;
                  .form-group {
                     &:last-child {
                        width: 100px;
                     }
                  }
               }
            }
         }

         .pagination {
            margin: 0 0 65px 0;
         }
      }
   }

   @media (max-width: 540px) {
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
            margin-top: 0;

            .col {
               position: unset;
            }

            .registrationMarksGrid {
               margin-top: 300px;
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
