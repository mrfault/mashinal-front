<template>
   <div
      :class="{'ma-penalties__card--body__penalties--item--active': protocol.isSelected}"
      class="ma-penalties__card--body__penalties--item"
      @click.prevent="selectProtocol(protocol)"
   >
      <div class="ma-left">
         <div class="ma-left__checkbox">
            <custom-checkbox v-model="protocol.isChecked"/>
         </div>
         <div class="ma-left__content">
            <p>{{ protocol.protocol_series }}{{ protocol.protocol_number }}</p>
            <strong v-if="protocol.isSelected">{{ protocol.total }} AZN</strong>
         </div>
      </div>
      <div class="ma-right">
         <p v-if="!protocol.isSelected" class="ma-right__amount">
            {{ protocol.total }} AZN
         </p>

       <slot></slot>

         <button
            v-if="protocol.isSelected && !history"
            :class="['btn', 'btn--light-green', { pending }]"

            type="button"
            @click="showPaymentModal"
         >
            {{ $t('make_payment') }}
         </button>

      </div>
   </div>
</template>

<script>
import customCheckbox from "~/components/forms/CustomCheckbox";
import ProtocolDetails from "~/components/garage/ProtocolDetails";
import ProtocolPayment from "~/components/garage/ProtocolPayment";

export default {
   data() {
      return {
         pending: false,
      }
   },
   props: {
      protocol: Object,
      history: Boolean,
   },
   components: {
      customCheckbox,
      ProtocolDetails,
      ProtocolPayment
   },
   methods: {
      selectProtocol(prot) {
         this.$emit('selectProtocol', prot)
      },
      showPaymentModal() {
         this.$emit('openPaymentModal');
      }
   }
}
</script>

<style scoped>

</style>
