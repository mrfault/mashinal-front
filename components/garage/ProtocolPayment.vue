<template>
   <div class="protocol-payment-button">
      <button
         :class="['btn', 'btn--light-green', { pending }, {'full-width': fullWidth}]"
         type="button"
         @click="activatePaymentModal()"
      >
         {{ $t(title) }}
      </button>

   </div>
</template>

<script>

export default {
   props: {
      title: {
         type: String,
         default: 'make_payment'
      },
      fullWidth: Boolean,
   },
   data() {
      return {
         showPaymentModal: false,
         pending: false,
         name: 'pay_with_card',
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
         ]
      }
   },
   methods: {
      async activatePaymentModal() {
         await this.$emit("paymentButtonClicked", true)
      }
   }
}
</script>

<style scoped>

</style>
