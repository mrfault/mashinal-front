<template>
  <div class="pages-profile-payments pt-5">
    <div class="container">
      <breadcrumbs :crumbs="crumbs" />
      <div class="card mb-lg-3" v-if="isMobileBreakpoint || myServiceHistory.length">
        <h2 class="title-with-line mb-n1" v-if="isMobileBreakpoint">
          <span>{{ $t('payment_history') }}</span>
        </h2>
        <div class="payment-history-rows" v-else>
          <div class="row head justify-content-between flex-nowrap">
            <span class="payment-service"><span>{{ $t('service') }}</span></span>
            <span class="payment-period"><span>{{ $t('period_time') }}</span></span>
            <span class="payment-price"><span>{{ $t('payment_amount') }}</span></span>
            <span class="payment-date"><span>{{ $t('date') }}</span></span>
          </div>
        </div>
      </div>
      <div class="card">
        <div class="payment-history-rows">
          <div :class="['payment-history-info text-center', {'mb-2 mb-lg-4': myServiceHistory.length}]" :key="0">
            <template v-if="!isMobileBreakpoint && myServiceHistory.length">
              <button :class="['btn btn--grey', {pending}]" @click="update">
                <icon name="refresh" /> {{ myServiceHistory[0].created_at.split(' ')[0] }}
              </button>
            </template>
            <template v-else-if="myServiceHistory.length">
              <span class="d-flex justify-content-between">
                <span>{{ $t('updated') }}</span>
                <span>{{ myServiceHistory[0].created_at.split(' ')[0] }}</span>
              </span>
            </template>
            <template v-else>
              <span class="d-block text-left mt-0 mb-3 mb-lg-0">{{ $t('no_payments_yet') }}</span>
            </template>
          </div>
          <div class="row justify-content-between flex-nowrap" v-for="row in myServiceHistory" :key="row.id">
            <span class="payment-service">
              <icon :name="getServiceIcon(row.service_type)" v-if="row.active_label !== 'autosalon'"/>
              <span>{{ getReplacedName(row.action.val) }}</span>
            </span>
            <span class="payment-period text-lowercase">
              <span>{{ getServiceLabel(row.period, row.active_label === 'autosalon' ? 'day' : row.active_label) }}<template v-if="row.count > 1"> x {{ row.count }}</template></span>
            </span>
            <span class="payment-price">
              <span :class="{'text-green': row.is_paid, 'text-red': !row.is_paid}">{{ row.price }} ₼</span>
            </span>
            <span class="payment-date"><span>{{ row.created_at.split(' ')[0] }}</span></span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex';

  import { ServicesMixin } from '~/mixins/services';

  export default {
    name: 'pages-profile-payments',
    middleware: 'auth_general',
    mixins: [ServicesMixin],
    nuxtI18n: {
      paths: {
        az: '/profil/odenisler'
      }
    },
    head() {
      return this.$headMeta({
        title: this.$t('payment_history')
      });
    },
    async asyncData({store}) {
      await store.dispatch('getMyServiceHistory');

      return { pending: false }
    },
    computed: {
      ...mapGetters(['myServiceHistory']),

      crumbs() {
        return [
          { name: this.$t('payment_history') }
        ]
      }
    },
    methods: {
      ...mapActions(['getMyServiceHistory']),

      async update() {
        if (this.pending) return;
        this.pending = true;
        try {
          await this.getMyServiceHistory();
          this.pending = false;
        } catch(err) {
          this.pending = false;
        }
      }
    }
  }
</script>