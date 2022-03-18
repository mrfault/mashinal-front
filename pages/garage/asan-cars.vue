<template>
  <div class="pages-garage-index pt-5">
    <div class="container">
      <client-only>
        <breadcrumbs :crumbs="crumbs" />
        <div class="row">
          <div class="col-12" v-if="vehicleList">
            <asan-login-vehicles
              :vehicleList="vehicleList.ownVehicles"
              v-if="vehicleList.ownVehicles && vehicleList.ownVehicles.length"
              :pending="pending"
              @showPaymentModal="showPaymentModal = true"
            />
            <asan-login-vehicles
              :vehicleList="vehicleList.canTransferVehicles"
              v-if="vehicleList.canTransferVehicles && vehicleList.canTransferVehicles.length"
              :pending="pending"
              @showPaymentModal="showPaymentModal = true"
            />
          </div>
        </div>
      </client-only>
    </div>
  </div>
</template>

<script>
import GarageNav from '~/components/garage/GarageNav'
import { PaymentMixin } from '~/mixins/payment'
import Asan_login from '~/mixins/asan_login'
import AsanLoginVehicles from '~/components/garage/AsanLoginVehicles.vue'
export default {
  components: {
    GarageNav,
    AsanLoginVehicles,
  },
  nuxtI18n: {
    paths: {
      az: '/qaraj/asan-avtomobiller',
    },
  },
  head() {
    return this.$headMeta({
      title: this.$t('add_car_with_asan_login'),
    })
  },
  computed: {
    crumbs() {
      return [{ name: this.$t('add_car_with_asan_login') }]
    },
  },
  async asyncData({ $cookies, $axios }) {
    let vehicleList = {};
    if($cookies.get('asan_token')) {
      try {
        vehicleList = await $axios.$get('/attorney/get_vehicle_list/false')
      }catch (e) {
      }
    }
    return {
      vehicleList
    }
  },
  mixins: [Asan_login, PaymentMixin],
  data() {
    return {
      pending: false,
      showPaymentModal: false,
      hasCars: true,
      hasAsanLogin: false,
    }
  },
  async mounted() {
    if (await this.checkTokenOnly() && !Object.keys(this.vehicleList).length) {
      this.hasAsanLogin = true
      if (!Object.keys(this.vehicleList).length)
        this.vehicleList = this.$set(
          this,
          'vehicleList',
          await this.$axios.$get('/attorney/get_vehicle_list/false'),
        )
    } else {
      this.hasAsanLogin = false
    }
  },
}
</script>
