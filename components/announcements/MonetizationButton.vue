<template>
  <component :is="tag"
    :class="classes ? classes : `btn btn--${className} full-width`"
    @click.stop="openPaymentModal()"
  >
    {{ $t('get_an_ad') }}
    <modal-popup
      :toggle="showPaymentModal"
      :title="$t('get_an_ad')"
      :modal-class="'larger monetization-popup'"
      @close="showPaymentModal = false"
    >
      <p class="text-dark-blue-3">{{ $t('ad_views_count') }}</p>
      <h4 class="text-dark-blue-2">
        {{ selectedPlan.min_view }} - {{ selectedPlan.max_view }}
      </h4>
      <hr />
      <h4>{{ $t('daily_budget') }}</h4>
      <form-range
        v-model="price.value"
        :min="price.min"
        :max="price.max"
        :step="0.1"
        :data="pricesForPlan"
        :tooltip-template="`{value} ALM`"
      />
      <h4>{{ $t('duration') }}</h4>
      <form-range
        v-model="day.value"
        :min="day.min"
        :max="day.max"
        :step="1"
        :data="daysForPlan"
        :tooltip-template="`{value} day`"
      />
      <p class="mb-2 mb-lg-3">
        <span class="star">*</span>
        {{ $t('ad_can_be_paused') }}
      </p>
      <h4>{{ $t('payment_method') }}</h4>
      <form-buttons
        v-model="paymentMethod"
        :options="paymentMethodOptions"
        :group-by="2"
      />
      <select-banking-card
        v-if="loggedIn"
        :show-card-image="false"
        :value="bankingCard"
        @input="bankingCard = $event"
        class="mt-2 mt-lg-3"
        v-show="paymentMethod === 'card'"
      />
      <terminal-info-button popup-name="monetization-popup" />
      <div class="modal-sticky-bottom">
        <hr />
        <div class="row">
          <div class="col-6 col-lg-4">
            <p class="text-medium">{{ $t('total') }}</p>
            <p class="text-medium text-dark-blue-2">
              {{ multiple ? multipleAnnouncements.length * selectedPlan.price : selectedPlan.price }} ALM -
              {{ $readPlural(selectedPlan.days, $t('plural_forms_day')) }}
            </p>
          </div>
          <div class="col-6 col-lg-4">
            <template v-if="$auth.loggedIn">
              <p class="text-medium">{{ $t('balans') }}</p>
              <p class="text-medium text-dark-blue-2">{{ totalBalance }} ALM</p>
            </template>
          </div>
          <div class="col-12 col-lg-4 mt-2 mt-lg-0">
            <button
              :class="['btn btn--green full-width', { pending }]"
              @click="getAnAd"
            >
              {{ $t('go_further') }}
            </button>
          </div>
        </div>
      </div>
    </modal-popup>
    <terminal-info-popup
      name="monetization-popup"
      @open="showPaymentModal = false"
      @close="showPaymentModal = true"
    />
  </component>
</template>

<script>
import { PaymentMixin } from '~/mixins/payment'
import { mapGetters } from 'vuex'

export default {
  props: {
    className: {
      default: 'red',
    },
    multipleAnnouncements: {
      default: () => []
    },
    multiple: {
      type: Boolean,
      default: false,
    },
    classes: {
      default: '',
    },
    tag:{
      default: 'button',
      type: String
    },
    announcement: {},
  },
  mixins: [PaymentMixin],
  data() {
    return {
      pending: false,
      priceList: [],
      day: {
        value: 5,
        min: 1,
        max: 30,
      },
      price: {
        value: 0,
        min: 0.5,
        max: 1,
      },
    }
  },
  computed: {
    ...mapGetters(['user']),
    ...mapGetters({
      bankingCards: 'bankingCards/bankingCards'
    }),
    totalBalance() {
      let balance = this.user.balance
      if (this.announcement.is_autosalon)
        return this.$sum(balance, this.announcement.user.autosalon.balance)
      else if (this.announcement.is_part_salon)
        return this.$sum(balance, this.announcement.user.part_salon.balance)
      else if (this.announcement.is_external_salon)
        return this.$sum(balance, this.announcement.user.external_salon.balance)
      return balance
    },
    pricesForPlan() {
      return this.priceList.map((item) => parseFloat(item.price))
    },
    availablePlans() {
      return (
        this.priceList.find(
          (item) => parseFloat(item.price) === this.price.value,
        )?.prices || []
      )
    },
    daysForPlan() {
      return this.availablePlans.map((item) => item.days)
    },
    selectedPlan() {
      return (
        this.availablePlans.find((item) => item.days === this.day.value) || {}
      )
    },
    haveBalanceToPay() {
      return parseFloat(this.selectedPlan.price) <= this.totalBalance
    },
  },
  methods: {
    async getAnAd() {
      if (this.pending) return
      this.pending = true
      if (!this.haveBalanceToPay) {
        this.paymentMethod = 'card'
      }
      let form = {
        id_unique: this.announcement.id_unique,
        monetize_id: this.selectedPlan.id,
        type: this.paymentMethod,
        card_id: this.bankingCard
      };

      if(this.multiple) {
        delete form.id_unique;
        form['announcements'] = this.multipleAnnouncements.map(item => ({ id_unique: item.id_unique}))
      }
      const res = await this.$axios.$post(
        `/monetization/start?is_mobile=${
          this.isMobileBreakpoint ? 'true' : 'false'
        }`,
        form,
      )
      if (this.paymentMethod === 'card') {
        if (!res?.data?.redirect_url) {
          await this.$nuxt.refresh();
          this.updatePaidStatus({
            type: 'success',
            text: this.$t('ad_started'),
            title: this.$t('success_payment')
          });
          this.pending = false;
        }else {
          this.pending = false
          this.showPaymentModal = false
          this.$nuxt.$emit('refresh-my-announcements')
          this.handlePayment(res, false, this.$t('ad_started'))
        }
      } else {
        await Promise.all([this.$nuxt.refresh(), this.$auth.fetchUser()])
        this.pending = false
        this.showPaymentModal = false
        this.$nuxt.$emit('refresh-my-announcements')
        this.updatePaidStatus({
          type: 'success',
          text: this.$t('ad_started'),
          title: this.$t('success_payment'),
        })
      }
    },
    openPaymentModal() {
       this.showPaymentModal = true
    },
  },
  created() {
    this.$axios.$get('/monetization/price/list').then((res) => {
      this.priceList = res
      this.price.min = this.pricesForPlan[0]
      this.price.value = this.pricesForPlan[2]
      this.price.max = this.pricesForPlan[this.pricesForPlan.length - 1]
      if (this.haveBalanceToPay) this.paymentMethod = 'balance'
    })
  },
}
</script>
