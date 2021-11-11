<template>
  <div class="garage_protocols-list">
    <p class="info-text full-width mt-2 mt-lg-3 mb-0" v-if="!protocols.length"><icon name="alert-circle" /> 
      {{ $t('no_'+tab) }}
    </p>
    <template v-else>
      <div class="mt-2 mt-lg-3" v-for="(protocol, index) in protocols" :key="protocol.id">
        <collapse-content
          :title="getTitle(protocol)"
          :first-collapsed="index !== 0"
          title-with-line
        >
          <div class="vehicle-specs">
            <div class="row">
              <div class="col" v-for="(specs, i) in mainSpecs(protocol)" :key="i">
                <ul>
                  <template v-for="(spec, key) in specs">
                    <li :key="key" v-if="spec">
                      <span class="w-auto">{{ $t(key) }}</span>
                      <span>{{ spec }}</span>
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
                      <li :key="key" v-if="spec">
                        <span class="w-auto">{{ $t(key) }}</span>
                        <span>{{ spec }}</span>
                      </li>
                    </template>
                  </ul>
                </div>
              </div>
              <hr class="mb-0"/>
              <div class="mt-2 mt-lg-3" v-if="protocol.can_pay || protocol.has_files">
                <div class="row">
                  <template v-if="protocol.has_files">
                    <div :class="['col-12 col-lg-1-5 ml-auto order-lg-2', {'mb-2 mb-lg-0': protocol.can_pay}]">
                      <protocol-files-button :protocol="protocol">
                        <div class="card garage_protocol-info">
                          <div class="garage_protocol-titles">
                            <h3 class="text-normal">{{ getCarNumber(protocol) }}</h3>
                            <h3 class="text-normal text-dark-blue-2">{{ getTitle(protocol) }}</h3>
                            <hr />
                          </div>
                          <div class="vehicle-specs">
                            <div class="row">
                              <div class="col" v-for="(specs, i) in mainSpecs(protocol, true)" :key="i">
                                <ul>
                                  <template v-for="(spec, key) in specs">
                                    <li :key="key" v-if="spec">
                                      <span class="w-auto">{{ $t(key) }}</span>
                                      <span>{{ spec }}</span>
                                    </li>
                                  </template>
                                </ul>
                              </div>
                            </div>
                          </div>
                          <template v-if="protocol.can_pay">
                            <hr class="mb-auto" />
                            <div class="row">
                              <div class="col-6" >
                                <span class="total-price" >
                                  <span>{{ $t('total')}}</span>
                                  <strong>{{ protocol.total }} ₼</strong>
                                </span>
                              </div>
                              <div class="col-6">
                                <button class="btn btn--green full-width disabled" >
                                  {{ $t('pay_online') }}
                                </button>
                              </div>
                            </div>
                          </template>
                        </div>
                      </protocol-files-button>
                    </div>
                  </template>
                  <template v-if="protocol.can_pay">
                    <div class="col-6 col-lg-3-5 mr-auto order-lg-1" >
                      <span class="total-price" >
                        <span>{{ $t('total')}}</span>
                        <strong>{{ protocol.total }} ₼</strong>
                      </span>
                    </div>
                    <div class="col-6 col-lg-1-5 ml-auto order-lg-3">
                      <button class="btn btn--green full-width disabled" >
                        {{ $t('pay_online') }}
                      </button>
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
import ProtocolFilesButton from '~/components/garage/ProtocolFilesButton';

export default {
  components: {
    CollapseContent,
    ProtocolFilesButton
  },
  props: {
    protocols: {},
    tab: String,
    where: String
  },
  methods: {
    getTitle(protocol) {
      return `${protocol.protocol_series || ''}${protocol.protocol_number}`;
    },
    getCarNumber(protocol) {
      return protocol.car_number.replace(/([A-Z]{1,2})/, ' $1 ');
    },
    mainSpecs(protocol, unite) {
      let getDate = (date) => date && this.$moment(this.$parseDate(date)).format('DD.MM.YYYY');

      let data = {
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
      };

      let dataKeys = Object.keys(data).filter(k => data[k]);
      let middleIndex = Math.ceil(dataKeys.length / 2);
      let dataCols = this.$chunk(dataKeys, middleIndex); 

      let getData = (keys) => keys.reduce((a, b) => ({...a, [b]: data[b]}), {});

      return (this.isMobileBreakpoint || unite) ? [getData(dataKeys)] : [getData(dataCols[0]), getData(dataCols[1])];
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