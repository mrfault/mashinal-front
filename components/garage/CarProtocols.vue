<template>
  <div class="garage_car-protocols">
    <div class="position-relative" v-if="!protocols.data">
      <loader />
    </div>
    <protocols-list :protocols="protocols.data" v-else />
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

import ProtocolsList from '~/components/garage/ProtocolsList';

export default {
  props: {
    car: {}
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
    await this.getProtocols({ car_id: this.car.id });
  },
  beforeDestroy() {
    this.resetCarData();
  }
}
</script>