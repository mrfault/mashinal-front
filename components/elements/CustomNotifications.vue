<template>
   <div class="customNotification mt-3 mt-lg-0">
      <div class="divider">
         <icon name="notification" />

         <div class="customNotification-text">
            <p>{{ title }}</p>
            <p v-html="subtitle" />
         </div>
      </div>

      <div class="divider full-width-mobile mt-3 mt-lg-0">
         <button class="btn full-width-mobile" @click="openModal = true">{{ $t('pay') }}</button>
      </div>

      <modal-popup
         :toggle="openModal"
         :title="$t('ads_balans')"
         :modal-class="'larger packages'"
         @close="openModal = false"
      >
         <div class="d-flex justify-content-between align-items-center">
            <form-radio
               :id="'1'"
               :value="'card'"
               :label="$t('pay_with_card')"
               input-name="payment_type"
               v-model="payment_type"
               @change="payment_type = 'card'"
               :radio-value="'card'"
               :checked="true"
            />
            <form-radio
               :id="'2'"
               :value="'balance'"
               :label="$t('balans') +' ('+$readNumber(user.balance)+' AZN)'"
               input-name="payment_type"
               v-model="payment_type"
               class="ml-2"
               :radio-value="'balance'"
               @change="payment_type = 'balance'"
            />
         </div>

         <hr/>

         <div class="terminal-section" v-if="totalBalance > 0">
            {{ $t('package_price') }}: {{ unpaidAgreement?.package?.price * duration }} AZN
         </div>

         <hr v-if="totalBalance < 1" />

         <div class="terminal-section" v-if="totalBalance < 1">
            {{ $t('package_price') }} {{ unpaidAgreement?.package?.price  * duration }} AZN
         </div>

         <div class="modal-sticky-bottom">
            <hr />
            <div class="row">
               <div class="col-12 col-lg-12 mt-2 mt-lg-0">
                  <button :class="['btn btn--green full-width', { pending }]"  @click="submit">
                     {{ $t('pay') }}
                  </button>
               </div>
            </div>
         </div>
      </modal-popup>
   </div>
</template>

<script>
   import {mapGetters} from "vuex";
   import {PaymentMixin} from "~/mixins/payment";
   import FormRadio from "~/components/forms/FormRadio.vue";

   export default {
      mixins: [PaymentMixin, FormRadio],

      data() {
         return {
            openModal: false,
            pending: false,
            payment_type: 'card',
            duration: 1,
            selectedPackage: {}
         }
      },

      methods: {
         async submit() {
            this.pending = true;

            let api = '/payment/package',
               data = {
                  package_id: this.unpaidAgreement.package.id,
                  payment_type: this.payment_type,
                  name: this.user?.autosalon?.name,
                  agreement_id: this.unpaidAgreement.id,
                  days_type: this.duration
               };

            // if ((this.selectedPackage.id === this.getAgreements[0]?.package?.id) && this.unpaidAgreement.payment.is_paid === true) {
            //    api = '/payment/renew-package';
            //    data.autosalon_id = this.user.autosalon.id;
            //    data.agreement_id = this.unpaidAgreement.id;
            //    delete data.name;
            // }

            try {
               const res = await this.$axios.$post(`${api}?is_mobile=${this.isMobileBreakpoint}`, data);

               if (!res?.data?.redirect_url) {
                  await this.$nuxt.refresh();
                  await this.updatePaidStatus({
                     type: 'success',
                     // text: this.$t('announcement_paid'),
                     title: this.$t('success_payment')
                  });
               } else {
                  await this.handlePayment(res, this.$localePath('/profile/agreement'));
                  this.pending = this.openModal = false;
               }
            } catch (error) {
               this.pending = false;

               // const response = error.response.data;
               // if (response.data && Object.keys(response.data).length) {
               //    for (let key in response.data) {
               //       this.$toast.error(response.data[key][0])
               //    }
               // }
            }
         }
      },

      computed: {
         ...mapGetters({
            getAgreements: 'getAgreements',
         }),

         totalBalance() {
            return this.$sum(
               this.user.balance,
               this.user.autosalon?.balance || 0,
               this.user.part_salon?.balance || 0,
               this.user.external_salon?.balance || 0,
            )
         }
      },

      props: {
         title: {
            type: String,
            default: 'Title'
         },

         subtitle: {
            type: String,
            default: 'Subtitle'
         },

         unpaidAgreement: {
            type: Object,
            default() { return {} }
         }
      },

      mounted() {
         this.selectedPackage = JSON.parse(localStorage.getItem('selectedPackage'));
      }
   }
</script>

<style lang="scss">
   .customNotification {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 21px 24px;
      border-radius: 12px;
      border: 1px solid var(--gray-300, #CDD5DF);
      background: var(--main-white, #FFF);
      &-text {
         p {
            font-weight: 500;
            margin: 0;

            &:first-child {
               font-size: 16px;
               line-height: 19px;
               color: #081A3E;
               margin-bottom: 4px;
            }

            &:last-child {
               font-size: 14px;
               line-height: 17px;
               color: #246EB2;

               span {
                  font-weight: 600;
                  color: red;
               }
            }
         }
      }

      .divider {
         display: flex;
         align-items: center;

         i {
            margin-right: 12px;

            &:before {
               font-size: 20px;
            }
         }

         .btn {
            height: 42px;
            padding: 0 36px;
            color: #FFFFFF;
            background: #039855;
         }
      }

      .btn--green{
         background: #039855;
      }
   }

   .modal-popup.packages .form-group{
      max-width: 100%;
   }

   .dark-mode {
      .customNotification {
         background: #1B2434;
         border: 1px solid #364152;

         &-text {
            p {
               &:first-child {
                  color: #FFFFFF;
               }

               &:last-child {
                  color: #7dc1ff;
               }
            }
         }
      }
   }

   @media (max-width: 1025px) {
      .customNotification {
         flex-direction: column;
         align-items: flex-start;

         .divider {
            &:last-child {
               margin-top: 20px;
            }

            .btn {
               width: 100%;
               height: 34px;
            }
         }
      }
   }

   @media (max-width: 740px) {
      .full-width-mobile{
         width: 100%;
      }
   }
   @media (max-width: 576px) {
      .customNotification {
         &-text {
            p {
               &:first-child {
                  font-size: 15px;
               }

               &:last-child {
                  font-size: 12px;
                  line-height: 15px;
               }
            }
         }

         .divider {
            .btn {
               height: 34px;
               width: 100%;
            }
         }
      }
   }
</style>
