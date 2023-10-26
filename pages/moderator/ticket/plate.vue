<template>
   <div class="registrationMarks moderator">
      <div class="container p-0">
         <breadcrumbs :crumbs="crumbs"/>

         <div class="registrationMarks__create">
            <h4 class="registrationMarks__create-title">
               <span>{{ $t('place_an_ad') }}</span>
               <span></span>
            </h4>

            <div class="registrationMarks__create-inner">
               <form
                  ref="form"
                  class="registrationMarks__create-form"
                  @submit.prevent
               >
                  <div class="col-12 col-xl-6">
                     <div class="row">
                        <div class="col-6 col-xl-5">
                           <form-select
                              v-model="region_id"
                              :clearPlaceholder="true"
                              :disabled="true"
                              :invalid="$v.region_id.$error"
                              :label="region_name"
                              :options="getRegionNumbers"
                           />
                        </div>

                        <div class="col-2 col-xl-2">
                           <form-select
                              v-model="region_letter1"
                              :clearPlaceholder="true"
                              :disabled="true"
                              :invalid="$v.region_letter1.$error"
                              :label="'A'"
                              :options="numbers"
                           />
                        </div>

                        <div class="col-2 col-xl-2">
                           <form-select
                              v-model="region_letter2"
                              :clearPlaceholder="true"
                              :disabled="true"
                              :label="'A'"
                              :options="numbers"
                           />
                        </div>

                        <div class="col-2 col-xl-2">
                           <form-numeric-input
                              v-model="region_number"
                              :disabled="true"
                              :invalid="$v.region_number.$error"
                              :max-value="999"
                           />
                        </div>
                     </div>

                     <div class="row mt-5">
                        <div class="col-6 col-xl-5">
                           <form-numeric-input
                              v-model="form.price"
                              :placeholder="$t('price')"
                           />
<!--                              :invalid="$v.form.price.$error"-->
                        </div>

                        <div class="col-3 col-xl-2">
                           <form-select
                              v-model="form.currency_id"
                              :clearPlaceholder="true"
                              :invalid="$v.form.currency_id.$error"
                              :label="'AZN'"
                              :options="currencyList"
                           />
                        </div>

                        <div class="col-3 col-xl-4">
                           <form-select
                              v-model="form.region_id"
                              :clearPlaceholder="true"
                              :invalid="$v.form.region_id.$error"
                              :label="city_name"
                              :options="cities.regions"
                           />
                        </div>
                     </div>

                     <div class="row mt-5">
                        <div class="col-12 col-xl-11">
                           <form-textarea
                              v-model="form.comment"
                              :maxlength="3000"
                              :placeholder="$t('description2')"
                           />
                        </div>
                     </div>

                     <div class="row mt-5">
                        <div class="col-1 col-xl-1 mb-1 btns" style="width: 30.5%; flex: 0 0 30.5%; max-width: 30.5%;">
                           <button
                              :class="['btn', {'pending' : pending}]"
                              @click="handleSubmit(1)"
                           >
                              {{ $t('confirm') }}
                           </button>
                        </div>

                        <div class="col-1 col-xl-1 mb-1 btns" style="width: 30.5%; flex: 0 0 30.5%; max-width: 30.5%;">
                           <button
                              :class="['btn red', {'pending' : pending}]"
                              @click="handleSubmit(0)"
                           >
                              {{ $t('reject') }}
                           </button>
                        </div>

                        <div class="col-1 col-xl-1 btns" style="width: 30.5%; flex: 0 0 30.5%; max-width: 30.5%;">
                           <button
                              :class="['btn', { 'pending' : pending }]"
                              @click="handleSubmit(3)"
                           >
                              {{ $t('sold') }}
                           </button>
                        </div>

                        <div class="col-1 col-xl-1 btns" style="width: 30.5%; flex: 0 0 30.5%; max-width: 30.5%;">
                           <button
                              :class="['btn', { 'pending' : pending }]"
                              @click.prevent="back"
                           >
                              {{ $t('back_to_list') }}
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
import {mapGetters} from 'vuex'
import {minLength, required} from "vuelidate/lib/validators";

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
            {name: this.$t('moderator')}
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
                  // console.log('res', res)
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
         this.form.car_number = `${this.region_id.split('-')[0]} - ${this.region_letter1}${this.region_letter2 ? this.region_letter2 : ''} - ${this.region_number}`;

         try {
            await this.$axios.$post('/ticket/plate/' + this.announce_id, {
               status: this.form.status,
               car_number: this.form.car_number,
               price: this.form.price,
               currency_id: this.form.currency_id,
               region_id: this.form.region_id,
               comment: this.form.comment,
            })

            this.pending = false;
            this.$toasted.success(this.$t('success_payment'));

            if (this.user.admin_group == 2) {
               location.href = `${this.$env().ADMIN_URL}/announce-moderators`;
            } else {
               location.href = `${this.$env().ADMIN_URL}/plates`;
            }
         } catch (err) {
            this.pending = false;
         }
      },

      async back() {
         if (this.user.admin_group == 2) {
            await this.$axios.$post('/ticket/detach/' + this.announce_id + '/car');
            location.href = `${this.$env().ADMIN_URL}/announce-moderators`;
         } else {
            await this.$axios.$post('/ticket/detach/' + this.announce_id + '/car');
            location.href = `${this.$env().ADMIN_URL}/plates`;
         }
      }
   },

   mounted() {
      this.getAnnounceData();
   },

   async fetch({store}) {
      await store.dispatch('getOptions');
      await store.dispatch('fetchRegionNumbers');
   },

   validations: {
      region_id: {required},
      region_letter1: {required},
      // region_letter2: { required },
      region_number: {required, minLength: minLength(3)},
      form: {
         price: {minLength: minLength(2)},
         currency_id: {required},
         region_id: {required}
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
