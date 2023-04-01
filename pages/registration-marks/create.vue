<template>
   <div class="registrationMarks">
      <div class="container">
         <breadcrumbs :crumbs="crumbs" />

         <div class="registrationMarks__create">
            <h4 class="registrationMarks__create-title">Qeydiyyat nişanı elanı yerləşdirmək</h4>

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
                              :label="'01 - Abşeron'"
                              :options="getRegionNumbers"
                              :invalid="$v.region_id.$error"
                              :clearPlaceholder="true"
                              v-model="region_id"
                              has-search
                           />

                        </div>

                        <div class="col-2 col-xl-2">
                           <form-select
                              :label="'A'"
                              :options="numbers"
                              :invalid="$v.region_letter1.$error"
                              :clearPlaceholder="true"
                              v-model="region_letter1"
                              has-search
                           />
                        </div>

                        <div class="col-2 col-xl-2">
                           <form-select
                              :label="'A'"
                              :options="numbers"
                              :invalid="$v.region_letter2.$error"
                              :clearPlaceholder="true"
                              v-model="region_letter2"
                              has-search
                           />
                        </div>

                        <div class="col-2 col-xl-2">
                           <form-numeric-input
                              :max-value="999"
                              :invalid="$v.region_number.$error"
                              :defaultValue="''"
                              v-model="region_number"
                           />
                        </div>
                     </div>

                     <div class="row mt-5">
                        <div class="col-6 col-xl-5">
                           <form-numeric-input
                              :placeholder="$t('price')"
                              :invalid="$v.form.price.$error"
                              :defaultValue="''"
                              v-model="form.price"
                           />
                        </div>

                        <div class="col-3 col-xl-2">
                           <form-select
                              :label="'AZN'"
                              :options="currency"
                              :invalid="$v.form.currency_id.$error"
                              :clearPlaceholder="true"
                              v-model="form.currency_id"
                              has-search
                           />
                        </div>

                        <div class="col-3 col-xl-4">
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
                           <h5 class="registrationMarks__create-note">
                              <inline-svg src="/icons/reason.svg" />
                              <p>
                                 Qeydiyyat nişanı elanı yerləşdirmək <span> ödənişlidir</span>. 1 elanın qiyməti <span> 2 AZN</span>-dir
                              </p>
                           </h5>
                        </div>
                     </div>

                     <div class="row mt-5">
                        <div class="col-12 col-xl-11">
                           <button class="registrationMarks__create-btn">Elanı yerləşdir</button>
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
   import { mapGetters } from "vuex";
   import { required, minLength } from "vuelidate/lib/validators";

   import { PaymentMixin } from '~/mixins/payment';

   export default {
      mixins: [PaymentMixin],
      data() {
         return {
            region_id: '',
            region_letter1: '',
            region_letter2: '',
            region_number: '',

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
               // { id: 3, name: 'EUR' }
            ],

            form: {
               car_number: '',
               price: '',
               currency_id: '',
               region_id: '',
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
            // this.$v.$touch();
            // if (this.$v.$error) return;

            let region;
            if (this.region_id.split('-')[0].length < 3) {
                region = `0${this.region_id.split('-')[0].slice(0, -1)}`;
            } else {
               region = this.region_id.split('-')[0].slice(0, -1);
            }

            console.log(region)

            this.form.car_number = `${region}-${this.region_letter1}${this.region_letter2}-${this.region_number}`;

            // try {
            //    const res = await this.$axios.$post(`/sell/plate/post/publish?is_mobile=${this.isMobileBreakpoint}`, this.form)
            //    if (!res?.data?.redirect_url) {
            //       await this.$nuxt.refresh();
            //       this.updatePaidStatus({
            //          type: 'success',
            //          text: this.$t('announcement_paid'),
            //          title: this.$t('success_payment')
            //       });
            //    } else {
            //       this.handlePayment(res, false, this.$t('announcement_paid'));
            //       this.resetForm();
            //    }
            // } catch (err) {
            //    console.log(err)
            // }
         }
      },

      computed: {
         ...mapGetters({
            getRegionNumbers: 'getRegionNumbers',
            cities: 'sellOptions'
         }),

         crumbs() {
            return [{ name: this.$t('place_an_ad') }]
         }
      },

      async fetch({ store }) {
         await store.dispatch('fetchRegionNumbers');
         await store.dispatch('getOptions');
      },

      validations: {
         region_id: { required },
         region_letter1: { required },
         region_letter2: { required },
         region_number: { required, minLength: minLength(3) },
         form: {
            price: { required },
            currency_id: { required },
            region_id: { required }
         }
      }
   }
</script>

<style lang="scss">
   .registrationMarks {
      &__create {
         width: 100%;
         padding: 24px 24px 48px 24px;
         border-radius: 6px;
         background-color: #FFFFFF;
         &-title {
            position: relative;
            font-weight: 600;
            font-size: 18px;
            line-height: 22px;
            color: #081A3E;
            margin-bottom: 32px;
            overflow: hidden;

            &:after {
               content: '';
               position: absolute;
               right: 0;
               top: 50%;
               transform: translateY(-50%);
               width: calc(100% - 310px);
               height: 1px;
               background-color: #9AA4B2;
            }
         }

         &-note {
            display: flex;
            align-items: center;
            padding: 12px;
            border-radius: 4px;
            border: 1px solid #CDD5DF;
            margin: 0;

            svg {
               max-width: 22px;
               width: 100%;
               height: 22px;
               margin-right: 11px;
            }

            p {
               font-weight: 400;
               font-size: 15px;
               color: #4B5565;
               margin: 0;

               span {
                  font-weight: 700;
                  color: #0f0f0f;
                  margin-left: 4px;
               }
            }
         }

         &-btn {
            width: 100%;
            font-weight: 600;
            font-size: 14px;
            line-height: 18px;
            padding: 11px;
            color: #FFFFFF;
            background: #29A53E;
            backdrop-filter: blur(10px);
            border-radius: 4px;
            border: none;
            outline: none;
         }
      }
   }

   @media (min-width: 320px) {
      .registrationMarks {
         &__create {
            margin-top: 24px;
         }
      }
   }

   @media (min-width: 1025px) {
      .registrationMarks {
         &__create {
            margin-top: 0;
         }
      }
   }
</style>