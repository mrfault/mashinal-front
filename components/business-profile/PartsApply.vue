<template>
  <div class="card m-0 mb-4 mb-lg-0">
    <form @submit.prevent="submit">
      <h2 class="title-with-line full-width mb-2 mb-lg-3" v-if="!isMobileBreakpoint">
        <span>{{ $t('get_a_business_profile') }}</span>
      </h2>
      <form-text-input 
        :maxlength="30"
        :placeholder="$t('shop_name')" 
        :invalid="$v.form.name.$error" 
        v-model="form.name"
        class="mb-2 mb-lg-3" 
      />
      <p>{{ $t('you_will_have_to_pay_100_to_get_a_business_profile') }}</p>
      <hr class="mt-2"/>
      <button class="btn btn--green full-width" type="submit">
        {{ $t('pay') }}
      </button>
    </form>
    <modal-popup 
      :toggle="showPaymentModal" 
      :title="$t('business_profile_payment')"
      @close="showPaymentModal = false"
    >
      <p class="mb-2 mb-lg-3">{{ $t('business_profile_payment_info') }}</p>
      <h4 class="mb-2">{{ $t('payment_method') }}</h4>
      <form-buttons v-model="paymentMethod" :options="paymentMethodOptions" :group-by="2" />
      <terminal-info-button popup-name="packages-parts-popup" />
      <div class="modal-sticky-bottom">
        <hr/>
        <div class="row">
          <div class="col-6">
            <p class="text-medium mb-0">{{ $t('total') }}</p>
            <p class="text-medium text-dark-blue-2 mb-0">{{ partsPackages[0].price }} ₼</p>
          </div>
          <div class="col-6">
            <button :class="['btn btn--green full-width', { pending }]" @click="getBusinessProfile">
              {{ $t('go_further') }}
            </button>
          </div>
        </div>
      </div>
    </modal-popup>
    <terminal-info-popup 
      name="packages-parts-popup"
      @open="showPaymentModal = false" 
      @close="showPaymentModal = true"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

import { PaymentMixin } from '~/mixins/payment';

import { required } from 'vuelidate/lib/validators';

export default {
  props: {
    where: {
      type: String,
      default: 'default'
    }
  }, 
  mixins: [PaymentMixin],
  data() {
    return {
      pending: false,
      form: {
        name: ''
      }
    }
  },
  validations: {
    form: { 
      name: { required }
    }
  },
  computed: {
    ...mapGetters({
      partsPackages: 'packages/partsPackages'
    }),
    haveBalanceToPay() {
      if (!this.loggedIn) return false;
      return parseFloat(this.partsPackages[0].price) <= this.user.balance;
    }
  },
  methods: {
    submit() {
      this.$v.$touch();
      if (this.$v.$pending || this.$v.$error) return;
      if (this.loggedIn) this.showPaymentModal = true;
      else this.$nuxt.$emit('login-popup', 'parts-package-' + this.where);
    },
    async getBusinessProfile() {
      if (this.pending) return;
      this.pending = true;
      try {
        const res = await this.$axios.$post(`/payment/package?is_mobile=${this.isMobileBreakpoint}`, {
          name: this.form.name,
          package_id: this.partsPackages[0].id,
          type: this.paymentMethod
        });
        if (this.paymentMethod === 'card') {
          this.pending = false;
          this.showPaymentModal = false;
          this.handlePayment(res, [this.$localePath('/dashboard/2/settings'), false], this.$t('package_bought'));
        } else {
          await Promise.all([
            this.$nuxt.refresh(),
            this.$auth.fetchUser()
          ]);
          this.pending = false;
          this.showPaymentModal = false;
          this.$router.push(this.$localePath('/dashboard/2/settings'), () => {
            this.updatePaidStatus({ 
              type: 'success', 
              text: this.$t('package_bought'), 
              title: this.$t('success_payment') 
            });
          });
        }
      } catch (err) {
        this.pending = false;
      }
    },
    handleAfterLogin(key) {
      if (key === 'parts-package-' + this.where) this.showPaymentModal = true;
    }
  },
  mounted() {
    this.$nuxt.$on('after-login', this.handleAfterLogin);
  },
  beforeDestroy() {
    this.$nuxt.$off('after-login', this.handleAfterLogin);
  }
}
</script>
