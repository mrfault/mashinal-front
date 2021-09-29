<template>
  <div :class="{'monetization-card card mb-lg-3': type !== 'button'}">
    <button class="btn btn--grey-outline full-width" @click.stop="showModal = true" v-if="type === 'button'">
      <icon name="crown" /> {{ $t('get_an_ad') }}
    </button>
    <button class="btn btn--white-outline full-width" @click.stop="showModal = true" v-else>
      {{ $t('get_an_ad') }}
    </button>
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
      <p><span class="star">* </span> {{ $t('ad_can_be_paused') }}</p>
      <hr/>
      <div class="row">
        <div class="col-6 col-lg-4">
          <p class="text-medium">{{ $t('total') }}</p>
          <p class="text-medium text-dark-blue-2">{{ selectedPlan.price }} ₼ - {{ $readPlural(selectedPlan.days, $t('plural_forms_day')) }}</p>
        </div>
        <div class="col-6 col-lg-4">
          <p class="text-medium">{{ $t('balans') }}</p>
          <p class="text-medium text-dark-blue-2">{{ user.balance }} ₼</p>
        </div>
        <div class="col-12 col-lg-4 mt-2 mt-lg-0">
          <button :class="['btn btn--green full-width', { pending }]" @click="getAnAd">
            {{ $t('go_further') }}
          </button>
        </div>
      </div>
    </modal-popup>
  </div>
</template>

<script>

import { PaymentMixin } from '~/mixins/payment';

export default {
  props: {
    type: String,
    announcement: {}
  },
  mixins: [PaymentMixin],
  data() {
    return {
      showModal: false,
      pending: false,
      priceList: [], 
      paymentMethod: 'balance',
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
        this.handlePayment(res);
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