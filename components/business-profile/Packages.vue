<template>
  <div class="business-profile__packages" ref="packages">
    <form @submit.prevent="submit">
      <div :class="{'text-center': !isMobileBreakpoint}">
        <h2 :class="['section-title heading-dots', {'heading-dots--left': isMobileBreakpoint}]">
          {{ $t('business_profile_packages') }}
        </h2>
      </div>
      <div class="packages">
        <div
          :class="['package card',{'package--active': selected === item.id}]"
          v-for="item in salonPackages"
          :key="item.id"
          @click="selected = item.id"
        >
          <div :class="['package__radio', {'package__radio--checked': selected === item.id}]"></div>
          <div class="package__price">{{ item.price }} ₼</div>
          <div class="package__name" :style="item.color ? ('color: ' + item.color) : ''">
            {{ item.name[locale] }}
          </div>
          <hr />
          <div class="package__details">
            <p class="mx-0 mt-1 text-with-check">
              <icon name="check" :style="item.color ? ('color: ' + item.color) : ''" />
              {{ $t('announcement_count') }} - {{ item.unlimited ? $t('Limitsiz') : item.announce_count }}
            </p>
            <p class="mx-0 mt-1 text-with-check">
              <icon name="check" :style="item.color ? ('color: ' + item.color) : ''" />
              <icon name="wallet" />
              - {{ item.service_price }} ALM
            </p>
          </div>
        </div>
      </div>
      <div class="text-center">
        <button type="submit" :class="['btn btn--green', { 'pending': downgradePlan && pending }]">{{ $t((hasSalon) ? 'to_change_package' : 'pay_online') }}</button>
      </div>
    </form>
    <modal-popup 
      :toggle="showModal" 
      :title="`${$t('package')} - <span style='${selectedPackage.color ? ('color: ' + selectedPackage.color) : ''}'>${selectedPackage.name[locale]}</span>`"
      @close="showModal = false"
    >
      <p class="mb-2 mb-lg-3">{{ $t('business_profile_payment_info') }}</p>
      <h4 class="mb-2">{{ $t('payment_method') }}</h4>
      <form-buttons v-model="paymentMethod" :options="paymentMethodOptions" :group-by="2" />
      <p class="mt-2 info-text"><icon name="alert-circle" /> 
        <span class="text-medium cursor-pointer text-red" @click="showModal = false, showTerminalInfo = true">{{ $t('pay_with_terminal') }}</span>
      </p>
      <div class="modal-sticky-bottom">
        <hr/>
        <div class="row">
          <div class="col-6">
            <p class="text-medium mb-0">{{ $t('total') }}</p>
            <p class="text-medium text-dark-blue-2 mb-0">{{ selectedPackage.price }} ₼</p>
          </div>
          <div class="col-6">
            <button :class="['btn btn--green full-width', { pending }]" @click="getBusinessProfile">
              {{ $t('go_further') }}
            </button>
          </div>
        </div>
      </div>
    </modal-popup>
    <modal-popup
      :toggle="showTerminalInfo"
      :title="$t('pay_with_terminal')"
      @close="showTerminalInfo = false"
    >
      <p>{{ $t('terminal_pay_info') }}</p>
      <div class="form-info text-green mb-2">{{ $t('mobile_number_your')}}: {{ $parsePhone(user.phone) }}</div>
      <ol>
        <li v-for="(step, i) in $t('terminal_pay_steps')" :key="i">{{ step }}</li>
      </ol>
      <div class="row">
        <div class="col">
          <button type="button" class="btn btn--primary-outline full-width" @click="showTerminalInfo = false, showModal = true">
            {{ $t('go_back') }}
          </button>
        </div>
      </div>
    </modal-popup>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

import { PaymentMixin } from '~/mixins/payment';

export default {
  mixins: [PaymentMixin],
  data() {
    return {
      pending: false,
      selected: '',
      showModal: false,
      showTerminalInfo: false
    }
  },
  computed: {
    ...mapGetters({
      salonPackages: 'packages/salonPackages',
      salonAnnouncements: 'packages/salonAnnouncements'
    }),
    haveBalanceForPlan() {
      if (!this.selected || !this.loggedIn) return false;
      return parseFloat(this.selectedPackage.price) <= this.user.balance;
    },
    downgradePlan() {
      if (!this.hasSalon) return false;
      return parseFloat(this.selectedPackage.price) < parseFloat(this.user.autosalon.package_price);
    },
    selectedPackage() {
      return this.salonPackages.find(p => p.id === this.selected);
    },
    hasSalon() {
      return this.loggedIn && this.user.autosalon;
    }
  },
  methods: {
    ...mapActions({
      getSalonAnnouncements: 'packages/getAnnouncements'
    }),
    async submit() {
      if (!this.loggedIn) this.$nuxt.$emit('login-popup', 'salon-package');
      else if (!this.downgradePlan) this.showModal = true;
      else await this.getBusinessProfile();
    },
    async getBusinessProfile() {
      if (this.pending) return;
      this.pending = true;
      try {
        let res;
        if (this.hasSalon) {
          res = await this.$axios.$post(`/payment/change-package?is_mobile=${this.isMobileBreakpoint}`, {
            autosalon_id: this.user.autosalon.id,
            package_id: this.selected,
            type: this.paymentMethod
          });
        } else {
          res = await this.$axios.$post(`/payment/package?is_mobile=${this.isMobileBreakpoint}`, {
            package_id: this.selected,
            type: this.paymentMethod
          });
        }
        if (this.downgradePlan) {
          this.pending = false;
          this.updatePaidStatus({ 
            type: 'success', 
            text: this.$t('change_package'), 
            title: this.$t('success_payment') 
          });
        } else if (this.paymentMethod === 'card') {
          this.pending = false;
          this.showModal = false;
          this.handlePayment(res, [this.$localePath('/dashboard/1'+(this.hasSalon ? '' : '/settings')), false], this.$t(this.hasSalon ? 'change_package' : 'package_bought'));
        } else {
          await Promise.all([
            this.$nuxt.refresh(),
            this.$auth.fetchUser()
          ]);
          this.pending = false;
          this.showModal = false;
          this.updatePaidStatus({ 
            type: 'success', 
            text: this.$t(this.hasSalon ? 'change_package' : 'package_bought'), 
            title: this.$t('success_payment') 
          });
        }
      } catch (err) {
        this.pending = false;
      }
    },
    handleAfterLogin(key) {
      if (key === 'salon-package') this.showModal = true;
    }
  },
  created() {
    this.selected = this.salonPackages[0].id;
    this.getSalonAnnouncements();
  },
  mounted() {
    this.$nuxt.$on('after-login', this.handleAfterLogin);

    this.$nextTick(() => {
      if (this.$route.query.scrollto) {
        let ref = this.$refs[this.$route.query.scrollto];
        this.$router.push({ query: null });
        if (ref) setTimeout(() => {
          this.scrollTo(ref);
        }, 300);
      }
    });
  },
  beforeDestroy() {
    this.$nuxt.$off('after-login', this.handleAfterLogin);
  }
}
</script>