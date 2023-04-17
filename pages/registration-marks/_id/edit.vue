<template>
   <div class="registrationMarks">
      <div class="container p-0">
         <breadcrumbs :crumbs="crumbs"/>

         <div class="registrationMarks__create">
            <h4 class="registrationMarks__create-title">
               <span>{{ $t('place_an_ad') }}</span>
               <span></span>
            </h4>

            <div class="registrationMarks__create-inner">
               <form
                  class="registrationMarks__create-form"
                  ref="form"
                  @submit.prevent="handleSubmit"
               >
                  <div class="col-12 col-xl-6">
                     <div class="row">
                        <div class="col-5 col-md-5">
                           <form-select
                              :label="registrationMark.serial_region"
                              :disabled="true"
                              v-model="region_id"
                           />
                        </div>

                        <div class="col-1 col-md-2" style="width: 19.4%; flex: 0 0 19.4%; max-width: 19.4%">
                           <form-select
                              :label="region_letter1"
                              :disabled="true"
                              v-model="region_letter1"
                           />
                        </div>

                        <div class="col-1 col-md-2" style="width: 19.4%; flex: 0 0 19.4%; max-width: 19.4%">
                           <form-select
                              :label="region_letter2"
                              :disabled="true"
                              v-model="region_letter2"
                           />
                        </div>

                        <div class="col-1 col-md-2" style="width: 19.4%; flex: 0 0 19.4%; max-width: 19.4%">
                           <form-numeric-input
                              :max-value="999"
                              :defaultValue="region_number"
                              :disabled="true"
                              v-model="region_number"
                           />
                        </div>
                     </div>

                     <div class="row mt-5">
                        <div class="col-5 col-md-5">
                           <form-numeric-input
                              :placeholder="$t('price')"
                              :invalid="$v.form.price.$error"
                              v-model="form.price"
                           />
                        </div>

                        <div class="col-3" style="width: 29.1%; flex: 0 0 29.1%; max-width: 29.1%">
                           <form-select
                              :label="'AZN'"
                              :options="currencyList"
                              :invalid="$v.form.currency_id.$error"
                              :clearPlaceholder="true"
                              v-model="form.currency_id"
                           />
                        </div>

                        <div class="col-3 col-md-4" style="width: 29.1%; flex: 0 0 29.1%; max-width: 29.1%">
                           <form-select
                              :label="$t('city')"
                              :options="cities.regions"
                              :invalid="$v.form.region_id.$error"
                              :clearPlaceholder="true"
                              v-model="form.region_id"
                              has-search
                           />
                        </div>
                     </div>

                     <div class="row mt-5">
                        <div class="col-12 col-xl-12">
                           <form-textarea
                              :placeholder="$t('description2')"
                              :maxlength="3000"
                              v-model="form.comment"
                           />
                        </div>
                     </div>

                     <div class="row mt-5">
                        <div class="col-12 col-lg-6">
                           <button
                              :class="['btn', {'pending' : pending}]"
                           >
                              {{ $t('edit_ad') }}
                           </button>
                        </div>
                     </div>
                  </div>

                  <div class="col-12 col-xl-6 d-none d-xl-block">
                     <img src="/images/registrationMarks_banner.jpg" alt="registrationMarks_banner">
                  </div>
               </form>
            </div>
         </div>
      </div>
   </div>
</template>

<script>
   import { mapGetters } from "vuex";
   import {minLength, required} from "vuelidate/lib/validators";
   import { PaymentMixin } from '~/mixins/payment';

   export default {
      head() {
         return this.$headMeta({
            title: this.$t('registration_marks'),
         });
      },

      mixins: [ PaymentMixin ],

      data() {
         return {
            pending: false,

            region_id: '',
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

      methods: {
         async handleSubmit() {
            this.$v.$touch();
            if (this.$v.$error) return;

            this.pending = true;

            this.form.car_number = `${this.region_id.split('-')[0]} - ${this.region_letter1}${this.region_letter2} - ${this.region_number}`;

            try {
               await this.$axios.$post(`/sell/plate/edit/${this.$route.params.id.slice(0, -1)}`, this.form)
                  .then(() => {
                     this.pending = false;
                     this.$toasted.success(this.$t('success_payment'));
                     this.$router.push(this.$localePath('/profile/announcements'));
                  })
                  .catch(() => {
                     this.$toasted.error(this.$t('error'));
                  })
            } catch (err) {
               console.error(err)
            }
         }
      },

      computed: {
         ...mapGetters({
            registrationMark: 'announcement',
            cities: 'sellOptions'
         }),

         crumbs() {
            return [{name: this.$t('edit_ad')}]
         }
      },

      async fetch({ store, route }) {
         await store.dispatch('fetchRegistrationMark', route.params.id.slice(0, route.params.id.length - 1));
         await store.dispatch('getOptions');
      },

      mounted() {
         this.region_id = this.registrationMark.car_number.split('-')[0];
         this.region_letter1 =  this.registrationMark.car_number.split('-')[1][0];
         this.region_letter2 =  this.registrationMark.car_number.split('-')[1][1];
         this.region_number =  this.registrationMark.car_number.split('-')[2];
         this.form.price =  this.registrationMark.price.split(' ').slice(0, -1).join('');
         this.form.currency_id =  this.registrationMark.currency;
         this.form.region_id =  this.registrationMark.region.id;
         this.form.comment =  this.registrationMark.comment;
      },

      validations: {
         form: {
            price: { minLength: minLength(2) },
            currency_id: { required },
            region_id: { required }
         }
      }
   }
</script>
