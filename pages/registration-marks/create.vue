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
                              :label="'01 - Abşeron'"
                              :options="getRegionNumbers"
                              :invalid="$v.region_id.$error"
                              :clearPlaceholder="true"
                              v-model="region_id"
                              has-search
                           />
                        </div>

                        <div class="col-1 col-md-2" style="width: 19.4%; flex: 0 0 19.4%; max-width: 19.4%">
                           <form-select
                              :label="'A'"
                              :options="numbers"
                              :invalid="$v.region_letter1.$error"
                              :clearPlaceholder="true"
                              v-model="region_letter1"
                              has-search
                           />
                        </div>

                        <div class="col-1 col-md-2" style="width: 19.4%; flex: 0 0 19.4%; max-width: 19.4%">
                           <form-select
                              :label="'A'"
                              :options="numbers"
                              :clearPlaceholder="true"
                              v-model="region_letter2"
                              has-search
                           />
<!--                           :invalid="$v.region_letter2.$error"-->
                        </div>

                        <div class="col-1 col-md-2" style="width: 19.4%; flex: 0 0 19.4%; max-width: 19.4%">
                           <form-numeric-input
                              :invalid="$v.region_number.$error"
                              :defaultValue="''"
                              :maxlength="3"
                              :float="true"
                              v-model="region_number"
                           />
                        </div>
                     </div>

                     <div class="row mt-5">
                        <div class="col-5 col-md-5">
                           <form-numeric-input
                              :placeholder="$t('price')"
                              :invalid="$v.form.price.$error"
                              :defaultValue="''"
                              v-model="form.price"
                           />
                        </div>

                        <div class="col-3" style="width: 29.1%; flex: 0 0 29.1%; max-width: 29.1%">
                           <form-select
                              :label="'AZN'"
                              :options="currency"
                              :invalid="$v.form.currency_id.$error"
                              :clearPlaceholder="true"
                              v-model="form.currency_id"
                              has-search
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
                        <div class="col-12 col-lg-6 col-xl-12">
                           <h5 class="registrationMarks__create-note">
                              <inline-svg src="/icons/reason.svg"/>

                              <p v-html="$t('registration_marks_text')" />
                           </h5>
                        </div>
                     </div>

                     <div class="row mt-5">
                        <div class="col-12 col-lg-6">
                           <button
                              :class="['btn', {'pending' : pending}]"
                           >
                              {{ $t('place_announcement') }}
                           </button>
                        </div>
                     </div>
                  </div>

                  <div class="col-12 col-md-6 d-none d-xl-block">
                     <img src="/images/registrationMarks_banner.jpg" alt="registrationMarks_banner">
                  </div>
               </form>
            </div>
         </div>
      </div>
   </div>
</template>

<script>
   import {mapGetters} from "vuex";
   import {required, minLength} from "vuelidate/lib/validators";

   import {PaymentMixin} from '~/mixins/payment';

   export default {
      head() {
         return this.$headMeta({
            title: this.$t('registration_marks'),
         });
      },

      mixins: [PaymentMixin],

      middleware: ['sell_tokens'],

      data() {
         return {
            pending: false,

            region_id: '',
            region_letter1: '',
            region_letter2: '',
            region_number: '',

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
            currency: [
               {id: 1, name: 'AZN'},
               {id: 2, name: 'USD'},
               // { id: 3, name: 'EUR' }
            ],

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
         resetForm() {
            for (const item in this.form) {
               this.form[item] = '';
            }

            this.region_id = '';
            this.region_letter1 = '';
            this.region_letter2 = '';
            this.region_number = '';

            this.$v.$reset();
         },

         async handleSubmit() {
            this.$v.$touch();
            if (this.$v.$error) return;

            this.pending = true;

            this.form.car_number = `${this.region_id.split('-')[0].slice(0, -1)} - ${this.region_letter1}${this.region_letter2} - ${this.region_number}`;

            try {
               const res = await this.$axios.$post(`/sell/plate/post/publish?is_mobile=${this.isMobileBreakpoint}`, this.form);

               if (!res?.data?.redirect_url) {
                  await this.$nuxt.refresh();
                  this.updatePaidStatus({
                     type: 'success',
                     text: this.$t('announcement_paid'),
                     title: this.$t('success_payment')
                  });
               } else {
                  await this.handlePayment(res, this.$localePath('/profile/announcements'), this.$t('announcement_paid'));
                  if (this.getResetForm) await this.resetForm();
                  this.pending = false;
               }
            } catch (error) {
               this.pending = false;
            }
         }
      },

      computed: {
         ...mapGetters({
            getRegionNumbers: 'getRegionNumbers',
            cities: 'sellOptions',
            getResetForm: 'getResetForm'
         }),

         crumbs() {
            return [
               { name: this.$t('place_an_ad'), route: '/sell' },
               { name: this.$t('place_an_ad') }
            ]
         }
      },

      async fetch({store}) {
         await store.dispatch('fetchRegionNumbers');
         await store.dispatch('getOptions');
      },

      validations: {
         region_id: {required},
         region_letter1: {required},
         // region_letter2: {required},
         region_number: {required, minLength: minLength(3)},
         form: {
            price: {required},
            currency_id: {required},
            region_id: {required}
         }
      }
   }
</script>
