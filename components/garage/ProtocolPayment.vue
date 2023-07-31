<template>
   <modal-popup
      :modal-class="!isMobileBreakpoint ? 'midsize': 'larger'"
      :overflow-hidden="isMobileBreakpoint"
      :title="$t('payment')"
      :toggle="displayPaymentModal"
      @close="closePaymentModal()"
   >
      <h4 class="mb-2">{{ $t('payment_method') }}</h4>
      <div class="d-flex align-items-center justify-content-between">
         <!--               <form-buttons v-model="paymentMethod" :options="paymentMethodOptions" :group-by="2"/>-->
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
         <strong v-if="protocol && protocol.total">{{ protocol.total }} AZN</strong>
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
                  type="button"
                  @click="closePaymentModal"
               >
                  {{ $t('reject') }}
               </button>
            </div>
            <div v-if="protocol" class="col-6">
               <!--                     <button-->
               <!--                        :class="['btn btn&#45;&#45;green full-width', { pending }]"-->
               <!--                        @click="getPayLink(protocol)"-->
               <!--                     >-->
               <!--                        {{ $t('pay') }}-->
               <!--                     </button>-->
               <a :href="payForCar(protocol)" class="btn btn--green full-width" rel="noopener"
                  target="_blank">
                  {{ $t('pay_online') }}
               </a>
            </div>
         </div>
      </div>
   </modal-popup>
</template>

<script>

import {PaymentMixin} from "~/mixins/payment";

export default {
   props: {
      title: {
         type: String,
         default: 'make_payment'
      },
      fullWidth: Boolean,
      displayPaymentModal: {
         type: Boolean,
         default: true
      },
      pending: Boolean,
      protocol: Object,
   },
   mixins: [
      PaymentMixin
   ],
   data() {
      return {
         name: 'pay_with_card',
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
         ]
      }
   },
   methods: {
      async payForCar(protocol) {
         if (this.pending) return
         this.startPending()
         try {
            if (this.paymentMethod === 'card' && !this.bankingCard) {
               this.stopPending()
               this.closePaymentModal()
               this.handlePayment(res, false, this.$t('car_added'), 'v2')
            } else {
               await Promise.all([this.$nuxt.refresh(), this.$auth.fetchUser()])
               this.stopPending()
               this.closePaymentModal()
               this.bankingCard = ''
               this.updatePaidStatus({
                  type: 'success',
                  text: this.$t('car_added'),
                  title: this.$t('success_payment'),
               })
            }
            this.$emit('newVehicleAdded', true)
         } catch (err) {
            this.stopPending()
         }
      },
      handlePayment(res, route = false, text = '', version = 'v1') {
         if (!this.isMobileBreakpoint) {
            let size = ({v1: 'width=494,height=718', v2: 'width=1042,height=725'})[version];
            window.open((res?.data?.redirect_url || res), 'purchaseservice', 'toolbar=yes,scrollbars=yes,resizable=yes,top=50,left=100,' + size);
            let payment_id = res?.data?.payment_id;

            if (payment_id) {
               this.connectEcho(`purchase.${payment_id}`, false).listen('PurchaseInitiated', async (data) => {
                  this.closePaymentModal();
                  let {is_paid, status} = data.payment;
                  let paid = is_paid || status === 1;

                  route = (route instanceof Array) ? (route[paid ? 0 : 1]) : route;

                  if (paid) {
                     if (data.payment.operation_key === 'attorney_pay') {
                        return this.$router.push({path: this.$localePath('/garage'), query: {tab: 'attorney-list'}})
                     }

                     if (this.loggedIn) await this.$auth.fetchUser();

                     if (!route) {
                        await this.$nuxt.refresh();
                        this.callUpdatePaidStatus(paid, text);
                     }
                     localStorage.removeItem('selectedPackage');
                  } else {
                     this.callUpdatePaidStatus(paid);
                  }

                  const stopListening = () => {
                     this.connectEcho(`purchase.${payment_id}`, false).stopListening('PurchaseInitiated');
                  }

                  if (route) {
                     if (paid) {
                        this.$router.push(route, () => {
                           this.callUpdatePaidStatus(paid, text);
                           stopListening();
                        });
                     } else {
                        this.$store.dispatch('fetchResetForm', false);
                        this.callUpdatePaidStatus(paid, text);
                        stopListening();
                     }
                  } else {
                     stopListening();
                  }
                  if (data.payment.operation_key == 'offer_payment_key' && paid) {
                     setTimeout(() => {
                        this.$router.push('/offer');
                     }, 2000)
                  }
               });
            }
         } else {
            // redirect to kapital bank page
            this.$nuxt.$loading.start();

            setTimeout(() => this.$nuxt.$loading.finish(), 500);
            window.location = res?.data?.redirect_url || res;
         }
      },
      closePaymentModal(){
         this.$emit('closePaymentModal', true)
      },
      stopPending(){
         this.$emit('stopPending',true)
      },
      startPending(){
         this.$emit('startPending',true)
      }
   },

}
</script>

<style scoped>

</style>
