<template>
  <div class="garage_protocols-list">
    <p class="info-text full-width mt-2 mt-lg-3 mb-0" v-if="!protocols.length"><icon name="alert-circle" />
      {{ $t('no_'+(tab || 'protocols')) }}
    </p>
    <template v-else>
      <div class="mt-3" v-for="(protocol, index) in protocols" :key="index +'_'+protocol.id + '123'">
        <collapse-content
          :title="getTitle(protocol)"
          :first-collapsed="index !== 0 && where === 'car-protocols'"
          title-with-line
        >
          <div class="vehicle-specs">
            <div class="row">
              <div class="col" v-for="(specs, i) in mainSpecs(protocol)" :key="i + 98745">
                <ul>
                  <template v-for="(spec, key) in specs">
                    <li :key="key + '123845'" v-if="spec">
                      <span class="w-auto">{{ $t(key) }}</span>
                      <span :style="key === 'pay_status' ? 'color:#1C9831;' : ''">{{ spec }}</span>
                    </li>
                  </template>
                </ul>
              </div>
            </div>
            <hr :class="{'mb-0': where !== 'car-protocols'}"/>
            <template v-if="where === 'car-protocols'">
              <div class="row">
                <div class="col">
                  <ul>
                    <template v-for="(spec, key) in restSpecs(protocol)">
                      <li :key="key + '6545656'" v-if="spec">
                        <span class="w-auto">{{ $t(key) }}</span>
                        <span>{{ spec }}</span>
                      </li>
                    </template>
                  </ul>
                </div>
              </div>
              <hr class="mb-0"/>
              <div class="mt-2 mt-lg-3" v-if="(protocol.can_pay && protocol.total > 0) || protocol.has_files">
                <div class="row">
                  <template v-if="protocol.has_files">
                    <div :class="['col-12 col-lg-auto ml-auto order-lg-2', {'mb-2 mb-lg-0': protocol.can_pay && protocol.total > 0}]">
                      <protocol-files :protocol="protocol">
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
                    </div>
                  </template>
                  <template v-if="protocol.can_pay && protocol.total > 0">
                    <div class="col-6 col-lg-auto mr-auto order-lg-1" >
                      <span class="total-price" >
                        <span>{{ $t('total')}}</span>
                        <strong>{{ protocol.total }} ₼</strong>
                      </span>
                    </div>
                    <div class="col-6 col-lg-1-5 order-lg-3">
                      <a :href="getPayLink(protocol)" target="_blank" rel="noopener" class="btn btn--green full-width" >
                        {{ $t('pay_online') }}
                      </a>
                    </div>
                  </template>
                </div>
              </div>
            </template>
          </div>
        </collapse-content>
      </div>
    </template>
  </div>
</template>

<script>
import CollapseContent from '~/components/elements/CollapseContent';
import ProtocolFiles from '~/components/garage/ProtocolFiles';

export default {
  components: {
    CollapseContent,
     ProtocolFiles
  },
  props: {
    history: {
      default :0,
    },
    protocols: {},
    tab: String,
    where: String
  },
  methods: {
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
