<template>
   <div class="registrationMarks">
      <div class="container">
         <breadcrumbs :crumbs="crumbs"/>

         <div class="registrationMarks__create">
            <h4 class="registrationMarks__create-title">
               <span>{{ $t('post_registration') }}</span>
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
                        <div class="col-6 col-xl-5">
                           <form-select
                              :label="registrationMark.serial_region"
                              :disabled="true"
                              v-model="region_id"
                           />
                        </div>

                        <div class="col-2 col-xl-2">
                           <form-select
                              :label="region_letter1"
                              :disabled="true"
                              v-model="region_letter1"
                           />
                        </div>

                        <div class="col-2 col-xl-2">
                           <form-select
                              :label="region_letter2"
                              :disabled="true"
                              v-model="region_letter2"
                           />
                        </div>

                        <div class="col-2 col-xl-2">
                           <form-numeric-input
                              :max-value="999"
                              :defaultValue="region_number"
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
                              :label="registrationMark.curreny.name[locale]"
                              :disabled="true"
                              v-model="form.currency_id"
                           />
                        </div>

                        <div class="col-3 col-xl-4">
                           <form-select
                              :label="registrationMark.region.name[locale]"
                              :disabled="true"
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
                        <div class="col-12 col-xl-11">
                           <button
                              :class="['btn', {'pending' : pending}]"
                           >
                              {{ $t('edit_ad') }}
                           </button>
                        </div>
                     </div>
                  </div>
               </form>
            </div>

<!--            <pre>{{registrationMark}}</pre>-->
         </div>
      </div>
   </div>
</template>

<script>
import {mapGetters} from "vuex";
import {required, minLength} from "vuelidate/lib/validators";

import {PaymentMixin} from '~/mixins/payment';

export default {
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
            currency_id: 1,
            region_id: 1,
            comment: ''
         }
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
               .then(res => {
                  this.pending = false;
                  this.$toasted.success(this.$t('success_payment'));
                  this.$router.push(this.$localePath('/profile/announcements'));
               })
               .catch(err => {
                  this.$toasted.success(this.$t('error'))
               })
         } catch (err) {
            console.log(err)
         }
      }
   },

   computed: {
      ...mapGetters({
         registrationMark: 'announcement'
      }),

      crumbs() {
         return [{name: this.$t('edit_ad')}]
      }
   },

   async fetch({ store, route }) {
      await store.dispatch('fetchRegistrationMark', route.params.id.slice(0, route.params.id.length - 1));
   },

   mounted() {
      this.region_id = this.registrationMark.car_number.split('-')[0];
      this.region_letter1 =  this.registrationMark.car_number.split('-')[1][0];
      this.region_letter2 =  this.registrationMark.car_number.split('-')[1][1];
      this.region_number =  this.registrationMark.car_number.split('-')[2];
      this.form.price =  this.registrationMark.price.split(' ').slice(0, -1).join('');
      this.form.currency_id =  this.registrationMark.curreny.id;
      this.form.region_id =  this.registrationMark.region.id;
      this.form.comment =  this.registrationMark.comment;
   },

   validations: {
      form: {
         price: { required }
      }
   }
}
</script>
