<template>
  <div>
    <promotion
      :title="title"
      isPenaltiesPage
      footerImage="/promotions/phone-content-1.png"
    >
      <template v-slot:mainForm>
        <form-text-input
          autocomplete="tel"
          :placeholder="$t('number_of_car')"
          :mask="'99-AA-999'"
          v-model="form.carNumber"
          class="mb-2 mb-lg-3"
          isPromotionsPage
          v-if="!otpSent"
          :class="{ 'ma-input-error': hasError }"
        />
        <form-text-input
          autocomplete="tel"
          :placeholder="$t('number_of_tech_id')"
          :mask="'AA № 999999'"
          v-model="form.passport"
          :masl="$maskTechIdNumber()"
          class="mb-2 mb-lg-3"
          isPromotionsPage
          v-if="!otpSent"
          :class="{ 'ma-input-error': hasError }"
        />
        <form-text-input
          autocomplete="tel"
          :placeholder="$t('mobile_number')"
          :mask="$maskPhone()"
          v-model="form.phone"
          class="mb-2 mb-lg-3"
          isPromotionsPage
          v-if="!otpSent"
          :class="{ 'ma-input-error': hasError }"
        />
        <form-text-input
          :placeholder="$t('otp_number')"
          :maxlength="5"
          v-model="form.otp"
          class="mb-2 mb-lg-3"
          :mask="'99999'"
          isPromotionsPage
          v-if="otpSent"
          :key="123"
        />
        <h6 class="ma-error-message" v-if="hasError">
          Məlumatlar düzgün deyil
        </h6>
        <button
          class="btn btn--green w-100"
          @click="payOnline"
          :class="{ pending }"
          v-if="!otpSent"
        >
          {{ $t('pay_online') }}
        </button>
        <button
          class="btn btn--green w-100"
          @click="approveOtp"
          :class="{ pending }"
          v-if="otpSent"
        >
          {{ $t('confirm') }}
        </button>
      </template>
    </promotion>
  </div>
</template>

<script>
import { required } from 'vuelidate/lib/validators'
import promotion from '~/components/promotions/promotion.vue'
import { isPhoneNumber } from '~/lib/validators'
import { PaymentMixin } from '~/mixins/payment'
export default {
  components: { promotion },
  data() {
    return {
      pending: false,
      form: {
        carNumber: '',
        passport: '',
        phone: '',
        otp: '',
      },
      otpSent: false,
      hasError: false,
      title: this.$t('watch_your_penalties_on_mashinal'),
    }
  },

  head() {
    return this.$headMeta({
      title: this.$t('promotions'),
    })
  },
  mixins: [PaymentMixin],
  methods: {
    async payOnline() {
      this.pending = true
      try {
        await this.$axios.$post('/login_and_add_car', {
          phone: this.form.phone.replace(/[^0-9]+/g, ''),
          tech_id: this.form.passport.replace(/[^0-9A-Za-z]+/g, ''),
          car_number: this.form.carNumber.replace(/[^0-9A-Za-z]+/g, ''),
        })
        this.otpSent = true
        this.hasError = false
      } catch (e) {
        this.hasError = true
      }

      this.pending = false
    },
    async approveOtp() {
      let form = {
        name: this.form.name,
        phone: this.form.phone.replace(/[^0-9]+/g, ''),
        code: this.form.otp,
      }
      this.$axios.$post('/confirm/phone', form).then(async (data) => {
        // track conversion
        this.fbTrack('Complete Registration Api')
        this.gtagTrack('AW-600951956/-O6CCJGB2fIBEJSZx54C')
        this.$auth.setUser(data.user.original)
        this.$emit('setFinished', true)
        await this.$auth.setUserToken(data.meta.token)
        this.pending = false
        this.$nuxt.$emit('login', true)
        let res = await this.$axios.$post('/garage/register_pay', {
          card_id: '',
          is_mobile: this.isMobileBreakpoint,
          pay_type: 'card',
          vehicles: [
            {
              car_number: this.form.carNumber.replace(/[^0-9A-Za-z]+/g, ''),
              tech_id: this.form.passport.replace(/[^0-9A-Za-z]+/g, ''),
            },
          ],
        })
        this.handlePayment(res, false, this.$t('car_added'), 'v2')
        this.$router.push(this.$localePath('/garage'))
      })
    },
  },
  created() {
    this.$route.meta.name = 'promotions-page'
  },
}
</script>
