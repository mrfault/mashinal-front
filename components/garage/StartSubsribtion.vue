<template>
   <div class="protocol-payment-button">
      <button
         :class="[
                   'btn',
                   'full-width',
                   'btn--white',
                   'btn-dark-text',
                         { 'pointer-events-none': pending },
                 ]"
         type="button"
         @click="showModal = true"
      >
         {{ $t('subscribe') }}
      </button>

      <!--      are you sure to subscribe-->
      <modal-popup
         :modal-class="!isMobileBreakpoint ? 'midsize': 'larger'"
         :title="$t('subscribe')"
         :toggle="showModal"
         @close="showModal = false">
         <div class="remove-vehicle-modal">
            <p>{{ $t('start_subscription_desc1') }}</p>
            <hr>
            <div class="d-flex align-items-center mb-4">
               <p style="width: auto; margin-right: 10px" class="mb-0">{{ $t('total') }}:</p>
               <strong>1 AZN</strong>
            </div>
            <div class="protocol-payment-modal__actions">
               <button
                  :class="{ 'pointer-events-none': pending }"
                  class="btn btn--white btn-dark-text"
                  type="button"
                  @click="showModal = false"
               >
                  {{ $t('reject') }}
               </button>
               <button
                  :class="{ 'pointer-events-none': pending }"
                  class="btn btn--white btn-dark-text"
                  type="button"
                  @click="showPaymentModal = true"
               >
                  {{ $t('make_payment') }}
               </button>
            </div>

         </div>
      </modal-popup>

      <modal-popup
         :modal-class="!isMobileBreakpoint ? 'midsize': 'larger'"
         :overflow-hidden="isMobileBreakpoint"
         :title="$t('payment')"
         :toggle="showPaymentModal"
         @close="showPaymentModal = false"
      >
         <h4 class="mb-2">{{ $t('payment_method') }}</h4>
         <div class="d-flex align-items-center justify-content-between">
            <template v-for="(item,index) in paymentMethodOptions">
               <form-radio
                  v-model="paymentMethod"
                  :disabled="!user.balance"
                  :group-by="2"
                  :label="$t(item.name)"
                  :radio-value="item.key"
                  style="width: calc(50% - 8px)"
               />
            </template>
         </div>

         <select-banking-card
            v-show="paymentMethod === 'card'"
            :value="bankingCard"
            class="mt-2 mt-lg-3"
            @input="bankingCard = $event"
         />
         <div class="protocol-payment-modal__body--total-amount">
            <p>{{ $t('total_payment_amount') }}</p>
            <strong>1 AZN</strong>
         </div>
         <!--         <terminal-info-button popup-name="garage-add-popup"/>-->
         <div :class="{ 'modal-sticky-bottom': isMobileBreakpoint }">
            <!--            <hr/>-->
            <div class="row">
               <div class="col-6">
                  <button
                     :class="[
                                        'btn',
                                        'btn--white',
                                        'btn-dark-text',
                                        'full-width',
                                      ]"
                     style="height: 52px"
                     type="button"
                     @click="showPaymentModal = false"
                  >
                     {{ $t('reject') }}
                  </button>
               </div>
               <div class="col-6">
                  <button
                     :class="['btn btn--green full-width', { pending }]"
                     style="height: 52px"
                     @click="activateCar"
                  >
                     {{ $t('pay') }}
                  </button>
               </div>
            </div>
         </div>
      </modal-popup>
   </div>
</template>

<script>
import RadioGroup from "~/components/moderator/RadioGroup";
import CustomRadio from "~/components/elements/CustomRadio";
import {mapActions} from "vuex";
import {PaymentMixin} from "~/mixins/payment";

export default {
   props: {
      title: {
         type: String,
         default: 'make_payment'
      },
      fullWidth: Boolean,
      vehicle: Object,
   },
   mixins:[PaymentMixin],
   components: {CustomRadio, RadioGroup},
   data() {
      return {
         showModal: false,
         paymentOptions: [
            {
               label: 'pay_with_card',
               id: 0,
            },
            {
               label: 'balans',
               id: 1,
            },
         ],
         pay_with_card: false,
         balance: false,
         index: 1,
         selectedCard: null,
         cardOptions: [
            {
               name: 'payment_with_other_card',
               value: null,
            },
            {
               name: 'Pasha Bank card',
               value: '1234 5678 7897 3454'
            }
         ],
         pending: false,
         showPaymentModal: false,
      }
   },
   methods: {
      ...mapActions({
         activate: 'garage/activateCar'
      }),
      openPaymentModal() {
         return
      },
      async activateCar() {
         if (this.pending || this.thumbSet) return;
         this.pending = true;
         try {
            const res = await this.activate({
               id: this.vehicle.id,
               card_id: this.bankingCard,
               pay_type: this.paymentMethod,
               is_mobile: this.isMobileBreakpoint
            });
            this.$nuxt.refresh()
            if (this.paymentMethod === 'card' && !this.bankingCard) {
               this.pending = false;
               this.showPaymentModal = false;
               this.handlePayment(res, false, this.$t('car_activated'), 'v2');

            } else {
               await Promise.all([
                  this.$nuxt.refresh(),
                  this.$auth.fetchUser()
               ]);
               this.pending = false;
               this.showPaymentModal = false;
               this.bankingCard = '';
               this.updatePaidStatus({
                  type: 'success',
                  text: this.$t('car_activated'),
                  title: this.$t('success_payment')
               });
            }
         } catch (err) {
            this.pending = false;
         }
      },
   }
}
</script>


<style lang="scss">
.remove-vehicle-modal {
   p {
      width: 100%;
      font: 400 18px/22px 'TTHoves';
      color: #364152;
      margin-bottom: 25px;
   }

   &__text-with-info {
      display: flex;
      align-items: center;

      svg {
         margin-bottom: 5px;
         margin-right: 11px;
      }
   }
}
</style>

