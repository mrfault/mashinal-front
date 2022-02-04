<template>
  <div class="pages-dashboard pt-2 pt-lg-5">
    <div class="container">
      <breadcrumbs :crumbs="crumbs" />
      <div class="row mb-n2 mb-lg-n3">
        <div
          class="col-lg-3 mb-2 mb-lg-3"
          v-for="(item, index) in cards"
          :key="index"
        >
          <e-service-card :item="item"></e-service-card>
        </div>
        <div class="col-lg-3 mb-2 mb-lg-3">
          <dashboard-card :key="'support'">
            <div
              class="d-flex flex-column justify-content-center align-items-center full-height pt-2 pb-2"
            >
              <div
                class="support-contact"
                v-for="(contact, i) in supportContacts"
                :key="i"
              >
                <h5>
                  <a v-if="contact.phone" :href="`tel:${contact.phone}`">
                    {{ contact.phone }}
                  </a>
                  <a
                    v-else-if="contact.email"
                    :href="`mailto:${contact.email}`"
                  >
                    {{ contact.email }}
                  </a>
                </h5>
              </div>
            </div>
          </dashboard-card>
        </div>
        <modal-popup
          :toggle="showPaymentModal"
          :title="$t('extend_subscription')"
          @close="showPaymentModal = false"
        >
          <form class="form" @submit.prevent="extendContract" novalidate>
            <p
              v-html="
                $t('pay_till_date', {
                  date: announcementStats.contract.end_date,
                })
              "
              v-if="announcementStats.contract.left_days > 0"
            ></p>
            <p v-else>{{ $t('pay_to_continue') }}</p>
            <h4>{{ $t('payment_method') }}</h4>
            <div class="mb-2 mb-lg-0">
              <form-buttons
                v-model="paymentMethod"
                :options="paymentMethodOptions"
                :group-by="2"
              />
            </div>
            <hr />
            <div class="row">
              <div class="col-6">
                <span class="total-price">
                  <span>{{ $t('total') }}</span>
                  <strong>{{ announcementStats.contract.price }} ₼</strong>
                </span>
              </div>
              <div class="col-6">
                <button
                  type="submit"
                  :class="['btn btn--green full-width', { pending }]"
                >
                  {{ $t('confirm') }}
                </button>
              </div>
            </div>
          </form>
        </modal-popup>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

import { StatsMixin } from '~/mixins/statistics'
import { PaymentMixin } from '~/mixins/payment'

import DashboardCard from '~/components/profile/DashboardCard'
import EServiceCard from '~/components/eservices/EServiceCard.vue'

export default {
  name: 'pages-dashboard',
  middleware: ['auth_general', 'auth_salon'],
  mixins: [StatsMixin, PaymentMixin],
  components: {
    DashboardCard,
    EServiceCard,
  },
  nuxtI18n: {
    paths: {
      az: '/idareetme-paneli/:type',
    },
  },
  head() {
    return this.$headMeta({
      title: this.$t('dashboard'),
    })
  },
  async asyncData({ store, route, app }) {
    await store.dispatch(
      'getAnnouncementStats',
      app.$getDashboardId(route.params.type),
    )

    return {
      pending: false,
      supportContacts: [{ phone: '*8787' }, { email: 'office@al.ventures' }],
    }
  },
  computed: {
    ...mapGetters(['messages']),

    crumbs() {
      return [{ name: this.$t('dashboard') }]
    },

    salonDetails() {
      let id = this.$getDashboardId(this.$route.params.type)
      let isShop = id == this.user.part_salon?.id
      let myPackage = this.user.autosalon?.current_package || {}
      let salon = this.user[isShop ? 'part_salon' : 'autosalon']
      return {
        isShop: isShop,
        short_description: salon.short_description || '',
        name: salon.name || this.user.full_name,
        balance: this.$sum(this.user.balance, salon.balance),
        unlimited: salon?.status === 1 && salon?.is_unlimited,
        packageName: isShop
          ? ''
          : `<span style='${
              myPackage.color ? 'color: ' + myPackage.color : ''
            }'>${myPackage.name?.[this.locale]}</span>`,
      }
    },

    notreadMsgCount() {
      let notread = this.messages.filter((group) => {
        return (
          group.last_message &&
          !group.last_message.is_read &&
          parseInt(group.last_message.sender_id) !== parseInt(this.user.id)
        )
      })
      return notread.length
    },

    shouldExtendContract() {
      return this.announcementStats.contract.left_days < 5
    },

    haveBalanceToPay() {
      return (
        parseFloat(this.announcementStats.contract.price) <= this.user.balance
      )
    },
  },
  methods: {
    async extendContract() {
      if (this.pending) return
      this.pending = true
      try {
        const res = await this.$axios.$post(
          `/payment/renew-package?is_mobile=${this.isMobileBreakpoint}`,
          {
            autosalon_id: this.$getDashboardId(this.$route.params.type),
            type: this.paymentMethod,
          },
        )
        if (this.paymentMethod === 'card') {
          this.pending = false
          this.handlePayment(res, false, this.$t('renew_package'))
        } else {
          await Promise.all([this.$nuxt.refresh(), this.$auth.fetchUser()])
          this.pending = false
          this.showModal = false
          this.updatePaidStatus({
            type: 'success',
            text: this.$t('renew_package'),
            title: this.$t('success_payment'),
          })
        }
      } catch (err) {
        this.pending = false
      }
    },
  },
  data() {
    let type = this.$route.params.type;
    return {
      cards: [
          {
            key: 'announcements',
            title: `${this.$t('my_announces')}`,
            url: '/profile/announcements?type=' + type,
            icon: 'photo',
            image: 'announcement',
            hasAction: true
          },
          {
            key: 'balance',
            title: `${this.$t('balans')}`,
            url: '/profile/balance',
            icon: 'wallet',
            image: 'wallet'
          },
          {
            key: 'statistics',
            title: `${this.$t('statistics')}`,
            url: '/dashboard/' + type + '/statistics',
            icon: 'analytics',
            image: 'pie-chart'
          },
          {
            key: 'messages',
            title: `${this.$t('messages')}`,
            url: '/profile/messages',
            icon: 'chat',
            image: 'messages'
          },
          {
            key: 'calls',
            title: `${this.$t('phone_call_count')}`,
            url: '/dashboard/' + type + '/calls',
            icon: 'phone',
            image: 'phone',
          },
          {
            key: 'salon',
            title:`${this.$t( 'my_profile')}`,
            url: '/dashboard/' + type + '/settings',
            icon: 'user',
            image: 'account'
          },
          {
            key: 'contract',
            title: `${this.$t('contract')}`,
            url: '/business-profile?type=' + type,
            icon: 'calendar-1',
            image: 'calendar'
          },
        ]

    }
  }
}
</script>
