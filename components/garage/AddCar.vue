<template>
  <component
    :is="tag"
    :class="
      tag === 'button'
        ? [`btn btn--${btnClass}`, { 'full-width': isMobileBreakpoint }]
        : 'add-item'
    "
    @click="showModal = true"
  >
    <template v-if="tag === 'button'">
      <icon name="plus-circle" v-if="!isMobileBreakpoint" />
      {{ $t('add_car') }}
      <icon name="arrow-right" class="ml-1" v-if="isMobileBreakpoint" />
    </template>
    <div class="add-item_inner" v-else>
      <img src="/icons/plus-circle-1.svg" alt="" />
      {{ $t('add_car') }}
    </div>
    <modal-popup
      :toggle="showModal"
      :title="$t('add_car')"
      @close="showModal = false"
    >
      <asan-login-button
        @click="redirectToAsanLogin()"
        v-if="!hasAsanLoginCopy"
        :fullWidth="true"
        :fromGarageNav="true"
        @closeAddCarPopup="manageModalsInLoading()"
        :has-asan-login="hasAsanLoginCopy"
        :redirectPath="redirectPath"
      ></asan-login-button>
      <form class="form" @submit.prevent="checkCarNumber">
        <form-text-input
          class="mb-2 mb-lg-3"
          v-model="form.car_number"
          :mask="'99 - A{1,2} - 999'"
          :placeholder="$t('car_number')"
          :invalid="$v.form.car_number.$error"
        />
        <form-text-input
          class="mb-2 mb-lg-3"
          v-model="form.tech_id"
          :mask="$maskAlphaNumeric('********')"
          :placeholder="$t('tech_id')"
          :invalid="$v.form.tech_id.$error"
        />
        <div class="info-text mb-2">
          <icon name="alert-circle" />
          <span>{{ $t('garage_payment_info') }}</span>
        </div>
        <button
          type="submit"
          :class="[
            'btn btn--green full-width',
            { pending: pending && !showPaymentModal },
          ]"
        >
          {{ $t('go_further') }}
        </button>
      </form>
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
        :value="bankingCard"
        @input="bankingCard = $event"
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
        <animated-spinner />
        <span style="position: absolute;">{{ timer }}</span>
      </div>
    </modal-popup>
  </component>
</template>

<script>
import {mapActions, mapGetters} from 'vuex'
import { PaymentMixin } from '~/mixins/payment'
import { required } from 'vuelidate/lib/validators'
import AsanLoginButton from '~/components/buttons/AsanLoginButton'
import AnimatedSpinner from '~/components/elements/AnimatedSpinner'
import asan_login from '~/mixins/asan_login'
export default {
  components: {
    AsanLoginButton,
    AnimatedSpinner,
  },
  props: {
    btnClass: {
      type: String,
      default: 'green',
    },
    tag: {
      type: String,
      default: 'button',
    },
    hasAsanLogin: {
      type: Boolean,
      default: false,
    },
  },
  mixins: [PaymentMixin, asan_login],

  data() {
    return {
      bankingCardRefresh:0,
      showModal: false,
      pending: false,
      price: 0,
      hasAsanLoginCopy: false,
      redirectPath: 'garage',
      form: {
        car_number: '',
        tech_id: '',
      },
    }
  },
  validations: {
    form: {
      car_number: { required },
      tech_id: { required },
    },
  },
  computed: {
    ...mapGetters({bankingCards: 'bankingCards/bankingCards'}),
    haveBalanceToPay() {
      return parseFloat(this.price) <= this.user.balance
    },

  },
  methods: {
    ...mapActions({
      checkNewCar: 'garage/checkNewCar',
      registerNewCar: 'garage/registerNewCar',
    }),
    async redirectToAsanLogin() {
      if (await this.checkTokenOnly()) {
        this.$router.push(this.$localePath('/garage/asan-cars'))
        return
      }
      // if (this.fromGarageNav) {
      //   this.$emit('closeAddCarPopup', true)
      // }
      if (!this.$auth.loggedIn) {
        return await this.$router.push(
          this.$localePath(`/login?param=garage/asan-cars`),
        )
      } else {
        // if (!hasAsanLogin) {
        this.showModal = false
        this.showRedirect = true
        await this.asanLogin('garage/asan-cars')
        const data = await this.$axios.$get('/attorney/get_vehicle_list/false')
        this.vehicleList = data
        // }else{
        // this.$router.push(this.$localePath('/garage/asan-cars'))
        // }
      }
    },
    async checkCarNumber() {
      this.$v.$touch()
      if (this.pending || this.$v.$error) return
      this.pending = true
      try {
        const res = await this.checkNewCar({
          ...this.form,
          car_number: this.form.car_number.replace(/-|[ ]/g, ''),
        })
        this.pending = false
        if (res.data?.price) {
          this.showModal = false
          this.$v.$reset()
          this.price = res.data.price
          this.showPaymentModal = true
        }
      } catch (err) {
        this.pending = false
      }
    },
    async payForCar() {
      if (this.pending) return
      this.pending = true
      this.form.car_number = this.form.car_number.replace(/-|[ ]/g, '')
      try {
        const res = await this.registerNewCar({
          vehicles: [{ ...this.form }],
          card_id: this.bankingCard,
          pay_type: this.paymentMethod,
          is_mobile: this.isMobileBreakpoint,
        })
        this.form.car_number = ''
        this.form.tech_id = ''
        this.form.card_id = ''
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
        this.pending = false
      }
    },
    manageModalsInLoading() {
      this.showModal = false
    },
  },
  async mounted() {
    if (await this.checkTokenOnly()) {
      this.hasAsanLoginCopy = true
      this.vehicleList = this.$set(
        this,
        'vehicleList',
        await this.$axios.$get('/attorney/get_vehicle_list/false'),
      )
    } else {
      this.hasAsanLoginCopy = false
    }
    this.hasAsanLoginCopy = this.hasAsanLogin
  },
}
</script>
