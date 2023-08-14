<template>
   <div>
      <div class="card garage_protocol-info">
         <div class="w-100">
            <div class="garage_protocol-titles">
               <h2 class="ma-subtitle--lg" style="margin-bottom: 12px">{{
                     $t('penalty_info')
                  }}</h2>
            </div>
<!--            --------------------------------------->

            <div class="vehicle-specs">
               <div class="asd">
                  <div
                     class="ma-penalties__card--body__penalties--item bottom-border w-100"
                  >
                     <div class="ma-left">
                        <div class="ma-left__content">
                           <p>{{ $t('number_plate_of_vehicle') }}</p>
                        </div>
                     </div>
                     <div class="ma-right" style="padding-left: 24px; text-align: right;">
                        <strong class="ma-right__amount">
                           {{ $readCarNumber(protocol.car_number) }}
                        </strong>
                     </div>
                  </div>
                  <div
                     class="ma-penalties__card--body__penalties--item bottom-border w-100"
                  >
                     <div class="ma-left">
                        <div class="ma-left__content">
                           <p>{{ $t('protocol_number') }}</p>
                        </div>
                     </div>
                     <div class="ma-right" style="padding-left: 24px; text-align: right;">
                        <strong class="ma-right__amount">
                           {{ getTitle(protocol) }}
                        </strong>
                     </div>
                  </div>
                  <div v-for="(specs, i) in mainSpecs(protocol, true)"
                       :key="i + '6545'" class="">
                     <template v-for="(spec, key) in specs">
                        <div
                           v-if="spec"
                           class="ma-penalties__card--body__penalties--item bottom-border"
                        >
                           <div v-if="spec" class="ma-left">
                              <div class="ma-left__content">
                                 <p>{{ $t(key) }}</p>
                              </div>
                           </div>
                           <div class="ma-right" style="padding-left: 24px; text-align: right;">
                              <strong v-if="key == 'protocol_amount' " class="ma-right__amount">
                                 {{ spec }} AZN
                              </strong>
                              <strong v-else-if="key == 'pay_status' && spec == false"
                                      class="ma-right__amount"
                                      style="color: #039855">
                                 {{ $t('already_paid') }}
                              </strong>
                              <strong v-else-if="key == 'pay_status' && spec == true"
                                      class="ma-right__amount"
                                      style="color: #F81734">
                                 {{ $t('not_paid') }}
                              </strong>
                              <strong v-else class="ma-right__amount">
                                 {{ $t(spec) }}
                              </strong>
                           </div>
                        </div>
                     </template>
                  </div>
               </div>
            </div>
            <div v-if="protocol.can_pay && protocol.total > 0">

               <div
                  class="ma-penalties__card--body__penalties--item no-borders  mt-0"
                  style="padding-bottom: 32px;"
               >
                  <h6 class="ma-subtitle--md">{{ $t('total') }}</h6>
                  <h6 class="ma-subtitle--md">
                     {{ protocol.total }} AZN
                  </h6>
               </div>

               <a :href="getPayLink(protocol)" class="btn btn--green full-width"
                  rel="noopener"
                  target="_blank">
                  {{ $t('pay_online') }}
               </a>

            </div>
         </div>
      </div>
   </div>
</template>

<script>

export default {
   props:{
      protocol: Object,
   },
   methods:{
      getTitle(protocol) {
         return `${protocol.protocol_series || ''}${protocol.protocol_number}`;
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
            date: getDate(protocol.date) || getDate(protocol.action_date),
            protocol_took_place: unite && protocol.address
         }, this.isMobileBreakpoint || unite);
      },
      getPayLink(protocol) {
         let agency = protocol.protocol_series === 'BNA' ? 'bna' : 'din';
         return `https://pay.api.az/${agency}/${protocol.protocol_series}${protocol.protocol_number}`;
      },
   }
}
</script>

<style scoped>
.images-slider .vehicle-specs{
   display: block;
}
</style>
