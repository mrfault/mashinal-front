<template>
  <div class="garage__asan-cars">
    <div class="row mt-5 mt-lg-0">
      <div
        class="col-12 col-lg-6 col-xl-4"
        v-for="(item, index) in vehicleList"
        :key="index"
      >
        <div class="asan-card">
          <div class="asan-card__top">
            <div class="asan-card__top--image">
              <img
                src="/img/asan-car.svg"
                alt="https://mashin.al/storage/96692/conversions/ford_focus_-thumb.jpg"
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
    <div class="row" >
      <div class="col-12">
        <div class="asan-card__summary">
          <div class="asan-card__summary--info">
            <p>{{ $t('total') }}</p>
            <h4>{{ price }} ₼ {{ $t('must_pay') }}</h4>
          </div>
          <button

            :disabled="!selectedVehicleList.length"
            @click="showPaymentModal = true"
            class="asan-card__summary--button btn btn--green px-3"
            :class="{pending ,disabled: !selectedVehicleList.length }"
          >
            {{ $t('pay') }}
          </button>
        </div>
      </div>
    </div>
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
            <p class="text-medium text-dark-blue-2 mb-0">
              {{ price }} ₼
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
    </modal-popup>
  </div>
</template>

<script>
import { mapMutations, mapActions, mapGetters } from 'vuex'
import { PaymentMixin } from '~/mixins/payment'
export default {
  props: {
    vehicleList: {
      default: null,
    },
    pending: Boolean,
  },
  mixins: [PaymentMixin],
  data() {
    return {
      selectedVehicleList: [],
      showPaymentModal: false,
    }
  },
  computed: {
    price() {
      return this.selectedVehicleList.filter((item) => item.status).length
    },
    ...mapGetters(['selectedVehiclesPrice']),
  },
  methods: {
    selectVehicle(item, e) {
      this.$emit('asanLoginVehiclesObj', this.asanLoginVehiclesObj)
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
  },
}
</script>

