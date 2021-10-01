<template>
  <button :class="`btn btn--${className} full-width`" @click.stop="showModal = true">
    {{ $t('get_an_ad') }}
    <modal-popup 
      :toggle="showModal" 
      :title="$t('get_an_ad')"
      :modal-class="'larger monetization-popup'"
      @close="showModal = false"
    >
      <p class="text-dark-blue-3">{{ $t('ad_views_count') }}</p>
      <h4 class="text-dark-blue-2">{{ selectedPlan.min_view }} - {{ selectedPlan.max_view }}</h4>
      <hr />
      <h4>{{ $t('daily_budget') }}</h4>
      <form-range v-model="price.value" :min="price.min" :max="price.max" :step="0.1" 
        :data="pricesForPlan" :tooltip-template="`{value} ₼`" />
      <h4>{{ $t('duration') }}</h4>
      <form-range v-model="day.value" :min="day.min" :max="day.max" :step="1" 
        :data="daysForPlan" :tooltip-template="`{value} day`" />
      <p class="mb-2 mb-lg-3"><span class="star">* </span> {{ $t('ad_can_be_paused') }}</p>
      <h4>{{ $t('payment_method') }}</h4>
      <form-buttons v-model="paymentMethod" :options="paymentMethodOptions" :group-by="2" />
      <p class="mt-2 info-text"><icon name="alert-circle" /> 
        <span class="text-medium cursor-pointer text-red" @click="showModal = false, showTerminalInfo = true">{{ $t('pay_with_terminal') }}</span>
      </p>
      <div class="modal-sticky-bottom">
        <hr/>
        <div class="row">
          <div class="col-6 col-lg-4">
            <p class="text-medium">{{ $t('total') }}</p>
            <p class="text-medium text-dark-blue-2">{{ selectedPlan.price }} ₼ - {{ $readPlural(selectedPlan.days, $t('plural_forms_day')) }}</p>
          </div>
          <div class="col-6 col-lg-4">
            <p class="text-medium">{{ $t('balans') }}</p>
            <p class="text-medium text-dark-blue-2">{{ user.balance }} ALManat</p>
          </div>
          <div class="col-12 col-lg-4 mt-2 mt-lg-0">
            <button :class="['btn btn--green full-width', { pending }]" @click="getAnAd">
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
  </button>
</template>

<script>

import { PaymentMixin } from '~/mixins/payment';

export default {
  props: {
    className: {
      default: 'red'
    },
    announcement: {}
  },
  mixins: [PaymentMixin],
  data() {
    return {
      showModal: false,
      showTerminalInfo: false,
      pending: false,
      priceList: [], 
      paymentMethod: 'card',
      day: {
        value: 5,
        min: 1,
        max: 30
      },
      price: {
        value: 0,
        min: 0.5,
        max: 1
      }
    }
  },
  computed: {
    pricesForPlan() {
      return this.priceList.map((item) => parseFloat(item.price));
    },
    availablePlans() {
      return this.priceList.find(item => parseFloat(item.price) === this.price.value)?.prices || [];
    },
    daysForPlan() {
      return this.availablePlans.map((item) => item.days);
    },
    selectedPlan() {
      return this.availablePlans.find(item => item.days === this.day.value) || {};
    },
    haveBalanceForPlan() {
      return parseFloat(this.selectedPlan.price) <= parseFloat(this.user.balance);
    },
    paymentMethodOptions() {
      return [
        { key: 'card', name: this.$t('pay_with_card') },
        { key: 'balance', name: this.$t('pay_with_balance'), disabled: !this.haveBalanceForPlan },
      ]
    }
  },
  watch: {
    haveBalanceForPlan(value) {
      if (!value) {
        this.paymentMethod = 'card';
      }
    }
  },
  methods: {
    async getAnAd() {
      if (this.pending) return;
      this.pending = true;
      if (!this.haveBalanceForPlan) {
        this.paymentMethod = 'card';
      }
      const res = await this.$axios.$post(`/monetization/start?is_mobile=${this.isMobileBreakpoint ? 'true' : 'false'}`,{
        id_unique: this.announcement.id_unique,
        monetize_id: this.selectedPlan.id,
        type: this.paymentMethod
      });
      if (this.paymentMethod === 'card') {
        this.pending = false;
        this.showModal = false;
        this.handlePayment(res, false, this.$t('ad_started'));
      } else {
        await Promise.all([
          this.$nuxt.refresh(),
          this.$auth.fetchUser()
        ]);
        this.pending = false;
        this.$toasted.success(this.$t('ad_started'));
      }
    }
  },
  created() {
    this.$axios.$get('/monetization/price/list').then((res) => {
      this.priceList = res;
      this.price.min = this.pricesForPlan[0];
      this.price.value = this.pricesForPlan[2];
      this.price.max = this.pricesForPlan[this.pricesForPlan.length - 1];
    });
  }
}
</script>