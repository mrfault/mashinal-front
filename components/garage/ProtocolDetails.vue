<template>
   <div class="protocol-details-component">
      <button
         :class="[
                                        'btn',
                                        'btn--white',
                                        'btn-dark-text',
                                        'full-width',
                  { 'pointer-events-none': pending }                  ]"
         type="button"
         @click="showProtocolDetails = true"
      >
         {{ $t('detail') }}
      </button>
      <modal-popup
         :modal-class="!mediaIsOpen ? 'wider'  : 'full-screen'"
         :title="$t('protocol_details')"
         :toggle="showProtocolDetails"
         @close="showProtocolDetails = false"
      >
         <div class="protocol-details-button__content--container">
            <div class="protocol-details-button__content">
               <div v-for="(value, key) in filteredProtocol"
                    class="ma-penalties__card--body__penalties--item no-borders">
                  <div class="ma-left">
                     <div class="ma-left__content">
                        <p>{{ $t(key) }}</p>
                     </div>
                  </div>
                  <div class="ma-right" style="padding-left: 24px; text-align: right;">
                     <strong v-if="key !== 'pay_status'" class="ma-right__amount">
                        {{ $t(value) }}
                     </strong>
                     <strong v-if="key == 'pay_status' && value == false" class="ma-right__amount"
                             style="color: #039855">
                        {{ $t('already_paid') }}
                     </strong>
                     <strong v-else-if="key == 'pay_status' && value == true" class="ma-right__amount"
                             style="color: #F81734">
                        {{ $t('not_paid') }}
                     </strong>
                  </div>
               </div>
               <div
                  class="ma-penalties__card--body__penalties--item
               total
               no-borders"
               >
                  <strong class="">{{ $t('total') }}</strong>
                  <strong>
                     {{ protocol.total }} AZN
                  </strong>
               </div>
            </div>

            <div class="protocol-details-button__actions">

               <protocol-files :protocol="protocol" @mediaClosed="mediaIsOpen = false"
                               @mediaOpened="mediaIsOpen = true"></protocol-files>

               <!--               <button-->
               <!--                  v-if="protocol.isSelected && !history"-->
               <!--                  :class="['btn', 'btn&#45;&#45;light-green', { pending }]"-->
               <!--                  style="margin-left: 8px"-->
               <!--                  type="button"-->
               <!--                  @click="showPaymentModal"-->
               <!--               >-->
               <!--                  {{ $t('make_payment') }}-->
               <!--               </button>-->

               <a v-if="protocol.isSelected && !history" :href="getPayLink(protocol)" class="btn btn--green"
                  rel="noopener"
                  style="margin-left: 8px" target="_blank">
                  {{ $t('make_payment') }}
               </a>

            </div>
         </div>

      </modal-popup>
   </div>
</template>

<script>
import ProtocolPayment from "~/components/garage/ProtocolPayment";
import ProtocolFiles from "~/components/garage/ProtocolFiles";

export default {
   props: {
      protocol: Object,
      history: Boolean,
   },
   components: {
      ProtocolPayment,
      ProtocolFiles
   },
   data() {
      return {
         showProtocolDetails: false,
         pending: false,
         mediaIsOpen: false,
      }
   },
   computed: {
      filteredProtocol() {
         return {
            pay_status: this.protocol.can_pay,
            car_number: this.protocol.car_number,
            fined_fullname: this.protocol.fullname,
            protocol_amount: this.protocol.amount || 'dont_have',
            date_decided: this.protocol.decision_date || 'no_decision',
            date: this.protocol.action_date,
            protocol_took_place: this.protocol.address,
            protocol_article: this.protocol.law_item,
         }
      }
   },
   methods: {
      showPaymentModal() {
         this.showProtocolDetails = false;
         this.$emit('showPaymentModal', true)
      },
      getPayLink(protocol) {
         let agency = protocol.protocol_series === 'BNA' ? 'bna' : 'din';
         return `https://pay.api.az/${agency}/${protocol.protocol_series}${protocol.protocol_number}`;
      },
   }
}
</script>

<style lang="scss">
.full-screen {
   width: 100%;
   height: 100%;
}
</style>
