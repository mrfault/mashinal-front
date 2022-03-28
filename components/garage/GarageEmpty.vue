<template>
  <div class="row">
    <div class="col-12 col-md-12 col-xl-6 h-100 mb-5 mb-lg-0">
      <div
        class="garage_no-cars card"
        :class="{ 'min-100': selectedVehicleList.length }"
      >
        <div class="text-center">
          <img src="/img/car-garage.svg" alt=""/>
          <p class="text-red mb-1 mb-lg-3" v-if="!hasCars">
            {{ $t('no_cars_found') }}
          </p>
          <div class="garage_no-cars__buttons">
            <add-car class="mb-2 mb-xl-0" :hasAsanLogin="hasAsanLogin"/>
            <asan-login-button
              @click="showRedirect = true; asanLogin('garage')"
              v-if="!hasAsanLogin"
              :redirectPath="'garage'"
              :pending="pending"
              :showRedirect="pending"
            ></asan-login-button>
          </div>
        </div>
      </div>
    </div>
    <div class="col-12 col-md-12 col-xl-6 h-100 mb-5 mb-lg-0">
      <empty-garage-card v-if="!vehicleList.ownVehicles && !vehicleList.canTransferVehicles"></empty-garage-card>
      <asan-login-vehicles
        :vehicleList="vehicleList.ownVehicles"
        v-if="vehicleList.ownVehicles && vehicleList.ownVehicles.length"
        :pending="pending"
        @showPaymentModal="showPaymentModal = true"
      ></asan-login-vehicles>
      <asan-login-vehicles
        :vehicleList="vehicleList.canTransferVehicles"
        v-if="vehicleList.canTransferVehicles && vehicleList.canTransferVehicles.length"
        :pending="pending"
        @showPaymentModal="showPaymentModal = true"
      ></asan-login-vehicles>
    </div>
    <modal-popup
      :toggle="showRedirect"
      :title="$t('add_car_with_asan_login')"
      :title-logo="isDarkMode ? '/asan_logo_dark_mode.svg' : '/asan_logo.svg'"
      :overflow-hidden="isMobileBreakpoint"
      @close="showRedirect = false"
    >
      <p>{{ $t('asan_login_redirect') }}</p>
      <div
        class="align-items-center d-flex justify-content-center position-relative"
      >
        <animated-spinner/>
        <span style="position: absolute;">{{ timer }}</span>
      </div>
    </modal-popup>
    <terminal-info-popup
      name="garage-add-popup"
      @open="showPaymentModal = false"
      @close="showPaymentModal = true"
    />
  </div>
</template>

<script>
import AddCar from '~/components/garage/AddCar'
import Asan_login from '~/mixins/asan_login'
import {mapActions, mapGetters} from 'vuex'
import AnimatedSpinner from '~/components/elements/AnimatedSpinner'
import EmptyGarageCard from './EmptyGarageCard.vue'
import AsanLoginVehicles from '~/components/garage/AsanLoginVehicles'
import AsanLoginButton from "~/components/buttons/AsanLoginButton";
import {PaymentMixin} from "~/mixins/payment";

export default {
  components: {
    AsanLoginButton,
    AddCar,
    AnimatedSpinner,
    AsanLoginVehicles,
    EmptyGarageCard,
  },
  props: {
    defaultVehicleList: {},
  },
  computed: {
    haveBalanceToPay() {
      return parseFloat(this.selectedVehiclesPrice) <= this.user.balance
    },
    ...mapGetters(['selectedVehicleList', 'selectedVehiclesPrice']),
  },
  mixins: [
    Asan_login,
    PaymentMixin
  ],
  data() {
    return {
      pending: false,
      //showPaymentModal: false,
      hasCars: true,
      hasAsanLogin: false,
      vehicleList: this.defaultVehicleList,
      cars: [
        {
          selected: true,
        },
      ],
    }
  },
  methods: {
    ...mapActions({
      registerNewCar: 'garage/registerNewCar',
    }),
  },
  created() {
    if (Object.keys(this.defaultVehicleList).length) {
      this.hasAsanLogin = true;
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
