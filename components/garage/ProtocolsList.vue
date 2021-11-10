<template>
  <div class="garage_protocols-list">
    <p class="info-text full-width mt-2 mt-lg-3 mb-0" v-if="!protocols.length"><icon name="alert-circle" /> 
      {{ $t('no_'+tab) }}
    </p>
    <template v-else>
      <div class="mt-2 mt-lg-3" v-for="(protocol, index) in protocols" :key="protocol.id">
        <collapse-content
          :title="protocol.protocol_number"
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
            <hr class="mb-0"/>
          </div>
        </collapse-content>
      </div>
    </template>
  </div>
</template>

<script>
import CollapseContent from '~/components/elements/CollapseContent';

export default {
  components: {
    CollapseContent
  },
  props: {
    protocols: {},
    tab: String
  },
  methods: {
    mainSpecs(protocol) {
      let data = {
        car_number: protocol.car_number,
        point: protocol.point,
        discount: protocol.discount && `${protocol.discount} ₼`,
        penalty: protocol.penalty && `${protocol.penalty} ₼`,
        total: protocol.total && `${protocol.total} ₼`,
        amount: protocol.amount && `${protocol.amount} ₼`,
        date_decided: protocol.decision_date && this.$moment(protocol.decision_date).format('DD.MM.YYYY'),
        date_expire: protocol.expiry_date && this.$moment(protocol.expiry_date).format('DD.MM.YYYY'),
        date: protocol.date && this.$moment(protocol.date).format('DD.MM.YYYY')
      };

      let dataKeys = Object.keys(data).filter(k => data[k]);
      let middleIndex = Math.ceil(dataKeys.length / 2);
      let dataCols = this.$chunk(dataKeys, middleIndex); 

      let getData = (keys) => keys.reduce((a, b) => ({...a, [b]: data[b]}), {});

      return this.isMobileBreakpoint ? [getData(dataKeys)] : [getData(dataCols[0]), getData(dataCols[1])];
    },
  }
}
</script>