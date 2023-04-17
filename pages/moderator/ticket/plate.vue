<template>
   <div class="registrationMarks">
      <div class="container p-0">
         <breadcrumbs :crumbs="crumbs" />

         <div class="registrationMarks__create">
            <h4 class="registrationMarks__create-title">
               <span>{{ $t('place_an_ad') }}</span>
               <span></span>
            </h4>

            <div class="registrationMarks__create-inner">
               <form
                  class="registrationMarks__create-form"
                  ref="form"
               >
                  <div class="col-12 col-xl-6">
                     <div class="row">
                        <div class="col-6 col-xl-5">
                           <form-select
                              :label="region_name"
                              :options="getRegionNumbers"
                              :invalid="$v.region_id.$error"
                              :clearPlaceholder="true"
                              :disabled="true"
                              v-model="region_id"
                           />
                        </div>

                        <div class="col-2 col-xl-2">
                           <form-select
                              :label="'A'"
                              :options="numbers"
                              :invalid="$v.region_letter1.$error"
                              :clearPlaceholder="true"
                              :disabled="true"
                              v-model="region_letter1"
                           />
                        </div>

                        <div class="col-2 col-xl-2">
                           <form-select
                              :label="'A'"
                              :options="numbers"
                              :invalid="$v.region_letter2.$error"
                              :clearPlaceholder="true"
                              :disabled="true"
                              v-model="region_letter2"
                           />
                        </div>

                        <div class="col-2 col-xl-2">
                           <form-numeric-input
                              :max-value="999"
                              :invalid="$v.region_number.$error"
                              :disabled="true"
                              v-model="region_number"
                           />
                        </div>
                     </div>

                     <div class="row mt-5">
                        <div class="col-6 col-xl-5">
                           <form-numeric-input
                              :placeholder="$t('price')"
                              :invalid="$v.form.price.$error"
                              v-model="form.price"
                           />
                        </div>

                        <div class="col-3 col-xl-2">
                           <form-select
                              :label="'AZN'"
                              :options="currencyList"
                              :clearPlaceholder="true"
                              :invalid="$v.form.currency_id.$error"
                              v-model="form.currency_id"
                           />
                        </div>

                        <div class="col-3 col-xl-4">
                           <form-select
                              :label="city_name"
                              :clearPlaceholder="true"
                              :options="cities.regions"
                              :invalid="$v.form.region_id.$error"
                              v-model="form.region_id"
                           />
                        </div>
                     </div>

                     <div class="row mt-5">
                        <div class="col-12 col-xl-11">
                           <form-textarea
                              :placeholder="$t('description2')"
                              :maxlength="3000"
                              v-model="form.comment"
                           />
                        </div>
                     </div>

                     <div class="row mt-5">
                        <div class="col-1 col-xl-1 btns" style="width: 46%; flex: 0 0 46%; max-width: 46%;">
                           <button
                              :class="['btn', {'pending' : pending}]"
                              @click="handleSubmit(1)"
                           >
                              {{ $t('confirm') }}
                           </button>
                        </div>

                        <div class="col-1 col-xl-1 btns" style="width: 46%; flex: 0 0 46%; max-width: 46%;">
                           <button
                              :class="['btn red', {'pending' : pending}]"
                              @click="handleSubmit(0)"
                           >
                              {{ $t('reject') }}
                           </button>
                        </div>
                     </div>
                  </div>
               </form>
            </div>
         </div>
      </div>
   </div>
</template>

<script>
   import { mapGetters } from 'vuex'
   import { minLength, required } from "vuelidate/lib/validators";

   export default {
      name: 'moderatorPlate',

      head() {
         return this.$headMeta({
            title: `${this.$t('moderation')}`,
         });
      },

      data() {
         return {
            plates: [],
            type: 'plates',
            pending: false,

            announce_id: '',
            region_id: '',
            region_name: '',
            city_name: '',
            region_letter1: '',
            region_letter2: '',
            region_number: '',

            form: {
               car_number: '',
               price: '',
               currency_id: '',
               region_id: '',
               comment: ''
            },
            numbers: [
               {name: 'A'},
               {name: 'B'},
               {name: 'C'},
               {name: 'D'},
               {name: 'E'},
               {name: 'F'},
               {name: 'G'},
               {name: 'H'},
               {name: 'I'},
               {name: 'J'},
               {name: 'K'},
               {name: 'L'},
               {name: 'M'},
               {name: 'N'},
               {name: 'O'},
               {name: 'P'},
               {name: 'Q'},
               {name: 'R'},
               {name: 'S'},
               {name: 'T'},
               {name: 'U'},
               {name: 'V'},
               {name: 'W'},
               {name: 'X'},
               {name: 'Y'},
               {name: 'Z'}
            ],
            currency: {
               name: {
                  1: 'AZN',
                  2: 'USD'
               }
            },
            currencyList: [
               {id: 1, name: 'AZN'},
               {id: 2, name: 'USD'},
               // { id: 3, name: 'EUR' }
            ]
         }
      },

      computed: {
         ...mapGetters({
            registrationMark: 'announcement',
            cities: 'sellOptions',
            getRegionNumbers: 'getRegionNumbers',
            single_announce: 'moderator/single_announce',
         }),

         crumbs() {
            return [
               { name: this.$t('moderator') }
            ]
         },
      },

      methods: {
         async getAnnounceData() {
            await this.$auth.setUserToken(`Bearer ${this.$route.query.token}`)
            const admin_user = await this.$axios.$get('/user')
            this.$auth.setUser(admin_user.user)

            let data
            try {
               data = await this.$axios.$get('/ticket/plate')
                  .then(res => {
                     this.announce_id = res.data.id;
                     this.form.currency_id = res.data.currency;
                     this.form.region_id = res.data.region.id;
                     this.city_name = res.data.region.name[this.locale];
                     this.region_name = res.data.serial_region;
                     this.region_id = res.data.car_number.split('-')[0];
                     this.region_letter1 = res.data.car_number.split('-')[1][0];
                     this.region_letter2 = res.data.car_number.split('-')[1][1];
                     this.region_number = res.data.car_number.split('-')[2];
                     this.form.price = res.data.price.split(' ').slice(0, -1).join('');
                     this.form.comment = res.data.comment;
                  })
            } catch (e) {
               console.log(e)
            }
         },

         async handleSubmit(status) {
            this.$v.$touch();
            if (this.$v.$error) return;

            this.pending = true;

            this.form.status = status;
            this.form.car_number = `${this.region_id.split('-')[0]} - ${this.region_letter1}${this.region_letter2} - ${this.region_number}`;

            try {
               await this.$axios.$post('/ticket/plate/' + this.announce_id, this.form)
                  .then(() => {
                     this.pending = false;
                     this.$toasted.success(this.$t('success_payment'));

                     if (this.user.admin_group == 2) {
                        location.href = '/alvcp/resources/announce-moderators';
                     } else {
                        location.href = '/alvcp/resources/plates';
                     }
                  })
                  .catch(() => {
                     this.$toasted.error(this.$t('error'))
                  })
            } catch (err) {
               console.log(err)
            }
         }
      },

      mounted() {
         this.getAnnounceData();
      },

      async fetch({ store }) {
         await store.dispatch('getOptions');
         await store.dispatch('fetchRegionNumbers');
      },

      validations: {
         region_id: { required },
         region_letter1: { required },
         region_letter2: { required },
         region_number: { required, minLength: minLength(3) },
         form: {
            price: { minLength: minLength(2) },
            currency_id: { required },
            region_id: { required }
         }
      }
   }
</script>

<style lang="scss">
   .registrationMarks {
      &__create {
         .btn {
            &.red {
               background-color: #F81734;
               border: 1px solid #F81734;
            }
         }
      }
   }

   @media (max-width: 1250px) {
      .registrationMarks {
         &__create {
            .btns {
               width: 50% !important;
               flex: 0 0 50% !important;
               max-width: 50% !important;
            }
         }
      }
   }
</style>
