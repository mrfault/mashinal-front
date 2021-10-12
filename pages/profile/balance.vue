<template>
  <div class="pages-profile-balance pt-2 pt-lg-5">
    <div class="container">
      <breadcrumbs :crumbs="crumbs" />
      <div class="row">
        <div class="col-lg-4">
          <div class="card mb-2 mb-lg-3">
            <h2 class="title-with-line mt-n1 mb-n1" v-if="isMobileBreakpoint">
              <span>{{ $t('wallet_balance') }}</span>
            </h2>
            <div class="increase-balance-info">
              <icon name="wallet" class="mb-2" />
              <strong class="mb-1">{{ $readNumber(totalBalance) }} ALManat</strong>
              <p v-if="!isMobileBreakpoint">{{ $t('wallet_balance') }}</p>
              <template v-if="user.autosalon || user.part_salon">
                <hr />
                <div class="row justify-content-center">
                  <div class="col-auto text-medium" v-if="user.autosalon">{{ $t('is_autosalon') }}: {{ $readNumber(user.autosalon.balance) }} ALM</div>
                  <div class="col-auto text-medium" v-if="user.part_salon">{{ $t('shop') }}: {{ $readNumber(user.part_salon.balance) }} ALM</div>
                </div>
              </template>
            </div>
          </div>
          <div class="card mb-2 mb-lg-0">
            <div class="increase-balance-form">
              <form class="form" @submit.prevent="increaseBalance" novalidate>
                <h2 class="title-with-line">
                  <span>{{ $t('replenishment') }}</span>
                </h2>
                <div class="mb-2 mb-lg-3">
                  <form-text-input type="number" v-model="form.money" :placeholder="$t('payment_amount')" />
                </div>
                <p>* {{ $t('enter_the_amount_in_azn', { min: minAmount }) }}</p>
                <hr />
                <button type="submit" :class="['btn btn--green full-width', {pending, disabled: form.money < this.minAmount}]">
                  {{ $t('replenish') }}
                </button>
              </form> 
            </div>
          </div>
        </div>
        <div class="col-lg-8">
          <div class="card mb-2 mb-lg-3" v-if="!isMobileBreakpoint && myBalanceHistory.data.length">
            <div class="payment-history-rows">
              <div class="row less-cols head justify-content-between flex-nowrap">
                <span class="payment-service"><span>{{ $t('transaction') }}</span></span>
                <span class="payment-price"><span>{{ $t('payment_amount') }}</span></span>
                <span class="payment-date"><span>{{ $t('date') }}</span></span>
              </div>
            </div>
          </div>
          <div class="card">
            <div class="payment-history-rows">
              <div :class="['payment-history-info text-center', {'mb-2 mb-lg-4': myBalanceHistory.data.length}]" :key="0">
                <template v-if="!isMobileBreakpoint && myBalanceHistory.data.length">
                  <button class="btn btn--grey pointer-events-none">
                    <icon name="refresh" /> {{ $moment(myBalanceHistory.data[0].created_at).format('DD.MM.YYYY') }}
                  </button>
                </template>
                <template v-else-if="myBalanceHistory.data.length">
                  <span class="d-flex justify-content-between">
                    <span>{{ $t('updated') }}</span>
                    <span>{{ $moment(myBalanceHistory.data[0].created_at).format('DD.MM.YYYY') }}</span>
                  </span>
                </template>
                <template v-else>
                  <span class="d-block text-left mt-0 mb-3 mb-lg-0">{{ $t('no_payments_yet') }}</span>
                </template>
              </div>
              <div class="row less-cols justify-content-between flex-nowrap" v-for="(row, i) in myBalanceHistory.data" :key="i + 1">
                <span class="payment-service">
                  <span>{{ $t(row.operation_key) }}</span>
                </span>
                <span class="payment-price">
                  <span :class="row.operation_type === '+' ? 'text-green' : 'text-red'">
                    {{ row.operation_type }}
                    {{ row.price }} {{ (row.provider === 'balance' || row.operation_key === 'ad_stopped') ? 'ALM' : '₼' }}
                  </span>
                </span>
                <span class="payment-date"><span>{{ $moment(row.created_at).format(isMobileBreakpoint ? 'DD.MM' : 'HH:mm | DD.MM.YYYY') }}</span></span>
              </div>
            </div>
          </div>
          <infinite-loading 
            action="getMyBalanceHistory" 
            getter="myBalanceHistory" 
            class-name="mt-3 mt-lg-4"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';

  import { PaymentMixin } from '~/mixins/payment';

  export default {
    name: 'pages-profile-balance',
    middleware: 'auth_general',
    mixins: [PaymentMixin],
    nuxtI18n: {
      paths: {
        az: '/profil/balans'
      }
    },
    head() {
      return this.$headMeta({
        title: this.$t('balans')
      });
    },
    async asyncData({ store, app, $auth }) {
      await Promise.all([
        store.dispatch('getMyBalanceHistory'),
        $auth.fetchUser()
      ]);

      return { 
        pending: false,
        minAmount: app.$env.DEV ? 0.01 : 1,
        form: {
          money: ''
        }
      }
    },
    computed: {
      ...mapGetters(['myBalanceHistory']),

      crumbs() {
        return [
          { name: this.$t('balans') }
        ]
      },

      totalBalance() {
        return this.user.balance + (this.user.autosalon?.balance || 0) + (this.user.part_salon?.balance || 0);
      }
    },
    methods: {    
      async increaseBalance() {
        if (this.pending || this.form.money < this.minAmount) return;
        this.pending = true;
        try {
          const res = await this.$axios.$post(`/payment/addBalance?is_mobile=${this.isMobileBreakpoint}`, this.form);
          this.pending = false;
          this.form.money = '';
          this.handlePayment(res, false, this.$t('balance_increased'));
        } catch (err) {
          this.pending = false;
        }
      },
    }
  }
</script>