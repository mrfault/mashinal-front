<template>
  <div class="row">
    <div class="col-12 mb-4 mb-xl-0 col-xl-6">
      <div class="garage_no-cars card" :class="{'min-100' : selectedVehicleList.length}">
        <div class="text-center">
          <img src="/img/car-garage.svg" alt="" />
          <p class="text-red mb-1 mb-lg-3" v-if="!hasCars">
            {{ $t('no_cars_found') }}
          </p>
          <div class="garage_no-cars__buttons">
            <add-car class="mb-2 mb-xl-0" />
            <button
              class="btn__asan-login"
              @click="redirectToAsanLogin()"
              :class="{ 'full-width mb-3': false }"
              v-if="!hasAsanLogin"
            >
              <div class="btn__asan-login--image">
                <img src="img/asan-login.svg" alt="" />
              </div>
              <p class="btn__asan-login--text">{{ $t('add_with') }}</p>
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="col-12 col-md-12 col-xl-6 h-100 mb-5 mb-lg-0">
      <div class="card height-100" v-if="!vehicleList.ownVehicles">
        <h2 class="title-with-line">
          <span>{{ $t('empty_garage_title') }}</span>
        </h2>
        <p class="mb-2">{{ $t('empty_garage_part_1') }}</p>
        <p class="mb-2">{{ $t('empty_garage_part_2') }}</p>
        <p class="mb-2">{{ $t('empty_garage_part_3') }}</p>
      </div>
      <div
        class="garage__asan-cars"
        v-if="vehicleList.ownVehicles && vehicleList.ownVehicles.length"
      >
        <div class="row mt-5 mt-lg-0">
          <div
            class="col-12 col-lg-6 col-xl-4"
            v-for="(item, index) in vehicleList.ownVehicles"
            :key="index"
          >
            <div class="asan-card">
              <div class="asan-card__top">
                <div class="asan-card__top--image">
                  <img
                    src="img/asan-car.svg"
                    alt="https://media.istockphoto.com/photos/generic-modern-suv-car-in-concrete-garage-picture-id1307086567?s=612x612"
                  />
                </div>
              </div>
              <div class="asan-card__bottom">
                <p class="asan-card__bottom--number">
                  {{ item.vehicleNumber }}
                </p>
                <form-checkbox
                  input-name="selected_vehicles"
                  class="d-contents cursor-pointer"
                  transparent="transparent"
                  @change="selectVehicle(item, $event)"
                ></form-checkbox>
              </div>
            </div>
          </div>
        </div>
        <div class="row" v-if="selectedVehicleList.length">
          <div class="col-12">
            <div class="asan-card__summary">
              <div class="asan-card__summary--info">
                <p>{{ $t('total') }}</p>
                <h4>{{ price }} ₼ {{ $t('must_pay') }}</h4>
              </div>
              <button
                @click="showPaymentModal = true"
                class="asan-card__summary--button btn btn--green px-3"
                :class="{ pending }"
              >
                {{ $t('pay') }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <modal-popup
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
    </modal-popup>
    <modal-popup
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
            <p class="text-medium text-dark-blue-2 mb-0">{{ price }} ₼</p>
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
import AnimatedSpinner from '~/components/elements/AnimatedSpinner'
import AsanLoginButton from '~/components/buttons/AsanLogin'
import { PaymentMixin } from '~/mixins/payment'
import { mapActions } from 'vuex'

export default {
  components: {
    AsanLoginButton,
    AddCar,
    AnimatedSpinner,
  },
  props: {
    defaultVehicleList: {},
  },
  computed: {
    price() {
      return this.selectedVehicleList.filter((item) => item.status).length
    },
    haveBalanceToPay() {
      return parseFloat(this.price) <= this.user.balance
    },
  },
  mixins: [Asan_login, PaymentMixin],
  data() {
    return {
      pending: false,
      showPaymentModal: false,
      hasCars: true,
      hasAsanLogin: false,
      selectedVehicleList: [],
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
    async payForCar() {
      console.log(this.pending)
      if (this.pending) return
      this.pending = true
      try {
        const res = await this.registerNewCar({
          vehicles: this.selectedVehicleList,
          card_id: this.bankingCard,
          pay_type: this.paymentMethod,
          is_mobile: this.isMobileBreakpoint,
        })
        if (this.paymentMethod === 'card' && !this.bankingCard) {
          this.pending = false
          this.showPaymentModal = false
          this.handlePayment(res, false, this.$t('car_added'), 'v2')
        } else {
          await Promise.all([this.$nuxt.refresh(), this.$auth.fetchUser()])
          this.pending = false
          this.showPaymentModal = false
          this.bankingCard = ''
          this.updatePaidStatus({
            type: 'success',
            text: this.$t('car_added'),
            title: this.$t('success_payment'),
          })
        }
      } catch (err) {
        console.log(err)
        this.pending = false
      }
    },
    selectVehicle(item, e) {
      if (e) {
        this.selectedVehicleList.push({
          car_number: item.vehicleNumber,
          tech_id: item.tech_id,
          status: e,
        })
      } else {
        let index = this.selectedVehicleList.findIndex(
          (i) => i.car_number === item.car_number,
        )
        this.selectedVehicleList.splice(index, 1)
      }
    },
    async redirectToAsanLogin() {
      if (!this.$auth.loggedIn)
        return await this.$router.push(this.$localePath('/login?param=garage'))
      await this.asanLogin('garage')
      const data = await this.$axios.$get('/attorney/get_vehicle_list/false')
      this.vehicleList = data
      console.log('1', data)
    },
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
