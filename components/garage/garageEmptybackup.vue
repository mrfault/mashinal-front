<template>
  <div class="row">
    <div class="col-12 mb-4 mb-xl-0 col-xl-6">
      <div
        class="garage_no-cars card"
        :class="{ 'min-100': selectedVehicleList.length }"
      >
        <div class="text-center">
          <img src="/img/car-garage.svg" alt="" />
          <p class="text-red mb-1 mb-lg-3" v-if="!hasCars">
            {{ $t('no_cars_found') }}
          </p>
          <div class="garage_no-cars__buttons">
            <add-car class="mb-2 mb-xl-0" :hasAsanLogin="hasAsanLogin" />
            <!-- <button
              class="btn__asan-login"
              @click="redirectToAsanLogin()"
              :class="{ 'full-width mb-3': false }"
              v-if="!hasAsanLogin"
            >
              <div class="btn__asan-login--image">
                <img src="img/asan-login.svg" alt="" />
              </div>
              <p class="btn__asan-login--text">{{ $t('add_with') }}</p>
            </button> -->
            <asan-login-button
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
      <empty-garage-card v-if="!vehicleList.ownVehicles"></empty-garage-card>
      <asan-login-vehicles
        :vehicleList="vehicleList"
        v-if="vehicleList.ownVehicles && vehicleList.ownVehicles.length"
        :pending="pending"
        @showPaymentModal="showPaymentModal = true"
      ></asan-login-vehicles>
    </div>
    <!-- <modal-popup
      :toggle="showRedirect"
      :title="$t('add_car')"
      :title-logo="isDarkMode ? '/asan_logo_dark_mode.svg' : '/asan_logo.svg'"
      :overflow-hidden="isMobileBreakpoint"
      @close="showRedirect = false"
    >
      <p>{{ $t('asan_login_redirect') }}</p>
      <div
        class="align-items-center d-flex justify-content-center position-relative"
      >
        <animated-spinner />
        <span style="position: absolute;">{{ timer }}</span>
      </div>
    </modal-popup> -->
    <!-- <modal-popup
      :toggle="showPaymentModal"
      :title="$t('payment')"
      :overflow-hidden="isMobileBreakpoint"
      @close="showPaymentModal = false"
    >
      <h4 class="mb-2">{{ $t('payment_method') }}</h4>
      <form-buttons
        v-model="paymentMethod"
        :options="paymentMethodOptions"
        :group-by="2"
      />
      <select-banking-card
        v-model="bankingCard"
        class="mt-2 mt-lg-3"
        v-show="paymentMethod === 'card'"
      />
      <terminal-info-button popup-name="garage-add-popup" />
      <div :class="{ 'modal-sticky-bottom': isMobileBreakpoint }">
        <hr />
        <div class="row">
          <div class="col-6">
            <p class="text-medium mb-0">{{ $t('total') }}</p>
            <p class="text-medium text-dark-blue-2 mb-0">
              {{ selectedVehiclesPrice }} ₼
            </p>
          </div>
          <div class="col-6">
            <button
              :class="['btn btn--green full-width', { pending }]"
              @click="payForCar"
            >
              {{ $t('pay') }}
            </button>
          </div>
        </div>
      </div>
    </modal-popup> -->
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
// import AnimatedSpinner from '~/components/elements/AnimatedSpinner'
import AsanLoginButton from '~/components/buttons/AsanLoginButton'
// import { PaymentMixin } from '~/mixins/payment'
import { mapActions, mapGetters } from 'vuex'
import AsanLoginVehicles from './AsanLoginVehicles.vue'
import EmptyGarageCard from './EmptyGarageCard.vue'

export default {
  components: {
    AsanLoginButton,
    AddCar,
    // AnimatedSpinner,
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
    //  PaymentMixin
  ],
  data() {
    return {
      pending: false,
      // showPaymentModal: false,
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
    // async payForCar() {
    //   console.log(this.pending)
    //   if (this.pending) return
    //   this.pending = true
    //   try {
    //     const res = await this.registerNewCar({
    //       vehicles: this.selectedVehicleList,
    //       card_id: this.bankingCard,
    //       pay_type: this.paymentMethod,
    //       is_mobile: this.isMobileBreakpoint,
    //     })
    //     if (this.paymentMethod === 'card' && !this.bankingCard) {
    //       this.pending = false
    //       this.showPaymentModal = false
    //       this.handlePayment(res, false, this.$t('car_added'), 'v2')
    //     } else {
    //       await Promise.all([this.$nuxt.refresh(), this.$auth.fetchUser()])
    //       this.pending = false
    //       this.showPaymentModal = false
    //       this.bankingCard = ''
    //       this.updatePaidStatus({
    //         type: 'success',
    //         text: this.$t('car_added'),
    //         title: this.$t('success_payment'),
    //       })
    //     }
    //   } catch (err) {
    //     console.log(err)
    //     this.pending = false
    //   }
    // },
    // async redirectToAsanLogin() {
    //   if (!this.$auth.loggedIn)
    //     return await this.$router.push(this.$localePath('/login?param=garage'))
    //   await this.asanLogin('garage')
    //   const data = await this.$axios.$get('/attorney/get_vehicle_list/false')
    //   this.vehicleList = data
    // },
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
