<template>
  <div class="pages-garage-index pt-5">
    <div class="container">
      <client-only>
        <breadcrumbs :crumbs="crumbs" />
        <div class="row">
          <div class="col-12" v-if="vehicleList">
            <asan-login-vehicles
              :vehicleList="vehicleList"
              v-if="vehicleList.ownVehicles && vehicleList.ownVehicles.length"
              :pending="pending"
              @showPaymentModal="showPaymentModal = true"
            ></asan-login-vehicles>
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
  mixins: [Asan_login, PaymentMixin],
  data() {
    return {
      pending: false,
      showPaymentModal: false,
      hasCars: true,
      hasAsanLogin: false,
      vehicleList: {},
      defaultVehicleList: {},
    }
  },
  async mounted() {
    if (await this.checkTokenOnly()) {
      this.hasAsanLogin = true
      if (!Object.keys(this.defaultVehicleList).length)
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
