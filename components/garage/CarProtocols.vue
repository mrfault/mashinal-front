<template>
  <div class="garage_car-protocols mt-4 mt-lg-0">
    <div class="position-relative" v-if="!protocols.data">
      <loader />
    </div>
    <protocols-list :history="history" :protocols="protocols.data" where="car-protocols" v-else />
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

import ProtocolsList from '~/components/garage/ProtocolsList';

export default {
  props: {
    car: {},
    history:{
      default:0,
    }
  },
  components: {
    ProtocolsList
  },
  computed: {
    ...mapGetters({
      protocols: 'garage/protocols'
    })
  },
  methods: {
    ...mapActions({
      getProtocols: 'garage/getProtocols',
      resetCarData: 'garage/resetCarData'
    })
  },
  async fetch() {
    await this.getProtocols({ id: this.car.id, history: this.history });
  },
  beforeDestroy() {
    this.resetCarData();
  }
}
</script>
