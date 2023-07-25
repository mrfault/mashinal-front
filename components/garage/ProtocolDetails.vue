<template>
   <div>
      <button
         :class="[
            'btn',
            'full-width',
            'btn--white',
            'btn-dark-text',
            { 'pointer-events-none': pending },
         ]"
         type="button"
         @click="showProtocolDetails = true"
      >
         {{ $t('detail') }}
      </button>
      <modal-popup
         :modal-class="'wider'"
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
               <protocol-files :protocol="protocol" @closeDetailsWindow="showProtocolDetails = false">
                  <div class="card garage_protocol-info">
                     <div class="garage_protocol-titles">
                        <h3 class="text-normal">{{ $readCarNumber(protocol.car_number) }}</h3>
                        <h3 class="text-normal text-dark-blue-2">{{ getTitle(protocol) }}</h3>
                        <hr />
                     </div>
                     <div class="vehicle-specs">
                        <div class="row">
                           <div class="col" v-for="(specs, i) in mainSpecs(protocol, true)" :key="i + '6545'">
                              <ul>
                                 <template v-for="(spec, key) in specs">
                                    <li :key="key + '1546786'" v-if="spec + 218">
                                       <span class="w-auto">{{ $t(key) }}</span>
                                       <span >{{ spec }}</span>
                                    </li>
                                 </template>
                              </ul>
                           </div>
                        </div>
                     </div>
                     <template v-if="protocol.can_pay && protocol.total > 0">
                        <hr class="mb-auto" />
                        <div class="row">
                           <div class="col-6" >
                                <span class="total-price" >
                                  <span>{{ $t('total')}}</span>
                                  <strong>{{ protocol.total }} ₼</strong>
                                </span>
                           </div>
                           <div class="col-6">
                              <a :href="getPayLink(protocol)" target="_blank" rel="noopener" class="btn btn--green full-width" >
                                 {{ $t('pay_online') }}
                              </a>
                           </div>
                        </div>
                     </template>
                  </div>
               </protocol-files>
               <button
                  v-if="protocol.isSelected && !history"
                  :class="['btn', 'btn--light-green', { pending }]"
                  style="margin-left: 8px"
                  type="button"
                  @click="showPaymentModal"
               >
                  {{ $t('make_payment') }}
               </button>

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
      getTitle(protocol) {
         return `${protocol.protocol_series || ''}${protocol.protocol_number}`;
      },
      getPayLink(protocol) {
         let agency = protocol.protocol_series === 'BNA' ? 'bna' : 'din';
         return `https://pay.api.az/${agency}/${protocol.protocol_series}${protocol.protocol_number}`;
      },
      mainSpecs(protocol, unite) {
         let getDate = (date) => date && this.$moment(this.$parseDate(date)).format('DD.MM.YYYY');

         return this.$dataRows({
            pay_status: this.history ? this.$t('already_paid') : '',
            car_number: !unite && protocol.car_number,
            fined_fullname: protocol.fullname,
            point: protocol.point,
            fine: protocol.amount && `${protocol.amount} ₼`,
            discount: protocol.discount && `${protocol.discount} ₼`,
            penalty: protocol.penalty && `${protocol.penalty} ₼`,
            total_amount: !unite && protocol.total && `${protocol.total} ₼`,
            speed_max: protocol.speed_max && `${protocol.speed_max} ${this.$t('char_kilometre_hour')}`,
            speed_real: protocol.speed_real && `${protocol.speed_real} ${this.$t('char_kilometre_hour')}`,

            status: protocol.has_decision !== undefined && (protocol.has_decision ? this.$t('has_decision') : this.$t('no_decision')),
            date_decided: getDate(protocol.decision_date),
            date_expire: getDate(protocol.expiry_date),
            date: getDate(protocol.date)|| getDate(protocol.action_date),
            protocol_took_place: unite && protocol.address
         }, this.isMobileBreakpoint || unite);
      },
      restSpecs(protocol) {
         return {
            protocol_took_place: protocol.address,
            protocol_article: protocol.law_item,
         }
      }
   }
}
</script>
