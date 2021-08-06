<template>
  <div class="pages-profile-balance pt-2 pt-lg-5">
    <div class="container">
      <breadcrumbs :crumbs="crumbs" />
      <div class="card mb-2 mb-lg-3" v-if="isMobileBreakpoint">
        <h2 class="title-with-line mt-n1 mb-n1">
          <span>{{ $t('balans') }}</span>
        </h2>
      </div>
      <div class="row">
        <div class="col-lg-4">
          <div class="card mb-2 mb-lg-0">
            <div class="increase-balance">
              <div class="text-center">
                <icon name="wallet" class="mb-2" />
                <strong class="mb-1">{{ user.balance }} <icon name="azn" /></strong>
                <p>{{ $t('wallet_balance') }}</p>
              </div>
              <form class="form" @submit.prevent="increaseBalance" novalidate>
                <div class="mb-2 mb-lg-3">
                  <form-text-input type="number" v-model="form.money" :placeholder="$t('enter_the_amount_in_azn')" />
                </div>
                <button type="submit" :class="['btn btn--green full-width', {pending: pendingForm, disabled: form.money < 0.1}]">
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
                  <button :class="['btn btn--grey', {pending}]" @click="update">
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
              <div class="row less-cols justify-content-between flex-nowrap" v-for="row in myBalanceHistory.data" :key="row.id">
                <span class="payment-service">
                  <span>{{ $t(row.operation_key) }}</span>
                </span>
                <span class="payment-price">
                  <span :class="row.operation_type === '+' ? 'text-green' : 'text-red'">{{ row.price }} ₼</span>
                </span>
                <span class="payment-date"><span>{{ $moment(row.created_at).format('HH:SS | DD.MM.YYYY') }}</span></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex';

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
    async asyncData({store}) {
      await store.dispatch('getMyBalanceHistory');

      return { 
        pending: false,
        pendingForm: false,
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
      }
    },
    methods: {
      ...mapActions(['getMyBalanceHistory']),

      async update() {
        if (this.pending) return;
        this.pending = true;
        try {
          await this.getMyBalanceHistory();
          this.pending = false;
        } catch(err) {
          this.pending = false;
        }
      },
      async increaseBalance() {
        if (this.pendingForm || this.form.money < 0.1) return;
        this.pendingForm = true;
        try {
          const res = await this.$axios.$post('/payment/addBalance', this.form);
          this.pendingForm = false;
          this.form.money = '';
          this.handlePayment(res);
        } catch (err) {
          this.pendingForm = false;
        }
      },
    }
  }
</script>