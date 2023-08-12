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
         :modal-class="!mediaIsOpen ? 'wider'  : 'background-transparent full-screen '"
         :title="$t('protocol_details')"
         :toggle="showProtocolDetails"
         @close="showProtocolDetails = false"
      >
         <div class="protocol-details-button__content--container">
            <div :class="{'visibility-hidden': mediaIsOpen}" class="protocol-details-button__content">
               <div v-for="(value, key) in filteredProtocol"
                    class="ma-penalties__card--body__penalties--item bottom-border">
                  <div class="ma-left">
                     <div class="ma-left__content">
                        <p>{{ $t(key) }}</p>
                     </div>
                  </div>

                  <div class="ma-right" style="padding-left: 24px; text-align: right;">
                     <strong v-if="key == 'protocol_amount' " class="ma-right__amount">
                        {{ value }} <template v-if="protocol.amount">AZN</template>
                     </strong>
                     <strong v-else-if="key == 'pay_status' && value == false" class="ma-right__amount"
                             style="color: #039855">
                        {{ $t('already_paid') }}
                     </strong>
                     <strong v-else-if="key == 'pay_status' && value == true" class="ma-right__amount"
                             style="color: #F81734">
                        {{ $t('not_paid') }}
                     </strong>
                     <strong v-else class="ma-right__amount">
                        {{ $t(value) }}
                     </strong>
                  </div>
               </div>

               <div
                  class="ma-penalties__card--body__penalties--item total no-borders"
               >
                  <strong class="">{{ $t('total') }}</strong>
                  <strong>
                     {{ protocol.total }}
                     <template v-if="protocol.amount">AZN</template>
                  </strong>
               </div>
            </div>

            <div v-if="!history" class="protocol-details-button__actions">

               <protocol-files
                  v-if="!history"
                  :mediaIsOpen="mediaIsOpen"
                  :protocol="protocol"
                  @mediaClosed="mediaIsOpen = false"
                  @mediaOpened="openMedia"
               />


               <a v-if="protocol.isSelected && !history && !mediaIsOpen" :href="getPayLink(protocol)"
                  class="btn btn--green"
                  rel="noopener"
                  style="margin-left: 8px" target="_blank">
                  {{ $t('pay_online') }}
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
            protocol_amount: this.protocol.amount || this.$t('dont_have'),
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
      openMedia() {
         console.log("this.mediaIsOpen = true;")
         this.mediaIsOpen = true;
      }
   }
}
</script>

<style lang="scss">
.full-screen {
   width: 100%;
   height: 100%;
}

.bottom-border {
   border-top: none;
   border-left: none;
   border-right: none;
   border-bottom: 1px solid #E3E8EF !important;
   border-radius: 0;
   margin-top: 0;
   padding: 20px 15px;
}

.dark-mode {
   .bottom-border {
      border-bottom: 1px solid #364152;
   }
}

.visibility-hidden {
   visibility: hidden !important;
}

.background-transparent {
   background: transparent !important;
}
</style>
