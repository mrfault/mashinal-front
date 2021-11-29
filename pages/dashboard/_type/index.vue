<template>
  <div class="pages-dashboard pt-2 pt-lg-5">
    <div class="container">
      <breadcrumbs :crumbs="crumbs" />
      <div class="row mb-n2 mb-lg-n3">
        <div class="col-lg-3 mb-2 mb-lg-3" v-for="card in cards" :key="card.key">
          <dashboard-card :title="card.title" :path="card.path" :icon="card.icon" :class="`dashboard-card--${card.key}`">
            <template v-if="card.key === 'announcements'">
              <div class="statistics-sell-tokens">
                <ul>
                  <li class="text-green">{{ $t('from_possible_left') }}</li>
                  <li class="text-red">{{ $t('from_possible_used') }}</li>
                </ul>
                <div class="statistics-sell-tokens_bar">
                  <span class="bar-filled" :style="{width:`calc(${100*(announcementStats.left/announcementStats.possible)}% + 15px)`}" v-if="announcementStats.left">{{ announcementStats.left }}</span>
                  <span :class="salonDetails.unlimited ? 'bar-filled d-flex align-items-center justify-content-center' : 'bar-empty'" :style="{width:`calc(${100*(announcementStats.used/announcementStats.possible)}% - 15px)`}" v-if="announcementStats.used || salonDetails.unlimited">
                    <template v-if="salonDetails.unlimited"><icon name="infinity" /></template>
                    <template v-else>{{ announcementStats.used }}</template>
                  </span>
                </div>
              </div>
            </template>
            <template v-else-if="card.key === 'balance'">
              <p>{{ $t('wallet_balance') }}:<br/><strong>{{ $readNumber(salonDetails.balance) }} ALManat</strong></p>
            </template>
            <template v-else-if="card.key === 'calls'">
              <h4 class="text-dark-blue-2">{{ announcementStats.calls }}</h4>
              <p v-html="$t(`phone_visited_${announcementStats.calls > 0 ? 'n' : 'zero'}_times`, { count: $readPlural(announcementStats.calls, $t('plural_forms_times')) })"></p>
            </template>
            <template v-else-if="card.key === 'messages'">
              <ul>
                <li>{{ $t('vsego') }}: {{ countStats[3].value }}</li>
                <li :class="{'text-red': notreadMsgCount > 0}">{{ $t('notread_messages') }}: {{ notreadMsgCount }}</li>
              </ul>
            </template>
            <template v-else-if="card.key === 'salon'">
              <h4>{{ salonDetails.name }}</h4>
              <p>{{ salonDetails.short_description || '' }}</p>
            </template>
            <template v-else-if="card.key === 'contract'">
              <p class="mt-1" v-html="`${salonDetails.isShop ? $t('contract_end_time') : $t('package_end_time', { package: salonDetails.packageName })}: <strong>${announcementStats.contract.end_date}</strong>`"></p>
              <h4 class="skip-truncate">
                <strong :class="shouldExtendContract ? 'text-red' : 'text-green'">
                  {{ announcementStats.contract.left_days }}
                </strong> 
                {{ $readPlural(announcementStats.contract.left_days, $t('plural_forms_day'), false) }}
              </h4>
            </template>
            <template v-else-if="card.key === 'statistics'">
              <div class="statistics-announcements smaller">
                <div class="circle-bar" v-for="(stat, i) in countStats.slice(0,-1)" :key="i">
                  <div class="circle-bar_filled" :style="{borderColor: stat.color, color: stat.color}">
                    <strong>{{ stat.value }}</strong>
                  </div>
                  <div class="circle-bar_info">
                    <span>{{ $t(stat.label) }}</span>
                  </div>
                </div>
              </div>
            </template>
            <template #footer>
              <nuxt-link class="text-green" :to="$localePath('/sell')" v-if="card.key === 'announcements'">
                {{ $t(locale === 'az' ? 'place_an_ad' : 'to_sell') }}
              </nuxt-link>
              <nuxt-link class="text-green" :to="$localePath('/profile/balance?scrollto=increase')" v-else-if="card.key === 'balance'">
                {{ $t('replenish') }}
              </nuxt-link>
              <a class="text-green" href="javascript:void(0);" @click="showExtendContract = true" v-else-if="card.key === 'contract' && shouldExtendContract">
                {{ $t('extend_subscription') }}
              </a>
              <nuxt-link class="text-green" :to="$localePath('/business-profile') + '?type=1&scrollto=packages'" v-else-if="card.key === 'contract' && $route.params.type == 1">
                {{ $t('to_change_package') }}
              </nuxt-link>
            </template>
          </dashboard-card>
        </div>
        <div class="col-lg-3 mb-2 mb-lg-3">
          <dashboard-card :key="'support'">
            <div class="d-flex flex-column justify-content-center align-items-center full-height pt-2 pb-2">
              <div class="support-contact" v-for="(contact, i) in supportContacts" :key="i">
                <h5>
                  <a v-if="contact.phone" :href="`tel:${contact.phone}`">{{ contact.phone }}</a>
                  <a v-else-if="contact.email" :href="`mailto:${contact.email}`">{{ contact.email }}</a>
                </h5>
              </div>
            </div>
          </dashboard-card>
        </div>
        <modal-popup
          :toggle="showExtendContract"
          :title="$t('extend_subscription')"
          @close="showExtendContract = false"
        >
          <form class="form" @submit.prevent="extendContract" novalidate>
            <p v-html="$t('pay_till_date', { date: announcementStats.contract.end_date })" v-if="announcementStats.contract.left_days > 0"></p>
            <p v-else>{{ $t('pay_to_continue') }}</p>
            <h4>{{ $t('payment_method') }}</h4>
            <div class="mb-2 mb-lg-0">
              <form-buttons v-model="paymentMethod" :options="paymentMethodOptions" :group-by="2" />
            </div>
            <hr />
            <div class="row">
              <div class="col-6">
                <span class="total-price">
                  <span>{{ $t('total')}}</span>
                  <strong>{{ announcementStats.contract.price }} ₼</strong>
                </span>
              </div>
              <div class="col-6">
                <button type="submit" :class="['btn btn--green full-width', { pending }]">
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
  import { mapGetters, mapActions } from 'vuex';

  import { StatsMixin } from '~/mixins/statistics';
  import { PaymentMixin } from '~/mixins/payment';

  import DashboardCard from '~/components/profile/DashboardCard';

  export default {
    name: 'pages-dashboard',
    middleware: ['auth_general','auth_salon'],
    mixins: [StatsMixin, PaymentMixin],
    components: {
      DashboardCard
    },  
    nuxtI18n: {
      paths: {
        az: '/idareetme-paneli/:type'
      }
    },
    head() {
      return this.$headMeta({
        title: this.$t('dashboard')
      });
    },
    async asyncData({store, route, app}) {
      await store.dispatch('getAnnouncementStats', app.$getDashboardId(route.params.type)); 

      return {
        pending: false,
        showExtendContract: false,
        supportContacts: [
          { phone: '*8787' },
          { email: 'support@mashin.al' }
        ]
      }
    },
    computed: {
      ...mapGetters(['messages']),

      crumbs() {
        return [
          { name: this.$t('dashboard') }
        ]
      }, 

      salonDetails() {
        let id = this.$getDashboardId(this.$route.params.type);
        let isShop = id == this.user.part_salon?.id;
        let myPackage = this.user.autosalon?.current_package || {};
        return {
          isShop: isShop,
          short_description: this.user[isShop ? 'part_salon' : 'autosalon'].short_description || '',
          name: this.user[isShop ? 'part_salon' : 'autosalon'].name || this.user.full_name,
          balance: this.$sum(this.user.balance, this.user[isShop ? 'part_salon' : 'autosalon'].balance),
          unlimited: this.user[isShop ? 'part_salon' : 'autosalon']?.is_unlimited,
          packageName: isShop ? '' : `<span style='${myPackage.color ? ('color: ' + myPackage.color) : ''}'>${myPackage.name?.[this.locale]}</span>`
        }
      },

      cards() {
        let type = this.$route.params.type;
        return [
          { key: 'announcements', title: 'my_announces', route: '/profile/announcements?type=' + type, icon: 'photo' },
          { key: 'balance', title: 'balans', route: '/profile/balance', icon: 'wallet' },
          { key: 'statistics', title: 'statistics', route: '/dashboard/' + type + '/statistics', icon: 'analytics' },
          { key: 'messages', title: 'messages', route: '/profile/messages', icon: 'chat' },
          { key: 'calls', title: 'phone_call_count', route: '/dashboard/' + type + '/calls', icon: 'phone' },
          { key: 'salon', title: 'my_profile', route: '/dashboard/' + type + '/settings', icon: 'user' },
          { key: 'contract', title: 'contract', route: '/business-profile?type=' + type, icon: 'calendar-1' }
        ].map(link => ({ ...link,
          title: this.$t(link.title), 
          path: this.$localePath(link.route)
        }));
      },

      notreadMsgCount() {
        let notread = this.messages.filter((group) => {
          return group.last_message && !group.last_message.is_read && parseInt(group.last_message.sender_id) !== parseInt(this.user.id);
        });
        return notread.length;
      },

      shouldExtendContract() {
        return this.announcementStats.contract.left_days < 5;
      },
      
      haveBalanceToPay() {
        return parseFloat(this.announcementStats.contract.price) <= this.user.balance;
      }
    },
    methods: {
      async extendContract() {
        if (this.pending) return;
        this.pending = true;
        try {
          const res = await this.$axios.$post(`/payment/renew-package?is_mobile=${this.isMobileBreakpoint}`, {
            autosalon_id: this.$getDashboardId(this.$route.params.type),
            type: this.paymentMethod
          });
          if (this.paymentMethod === 'card') {
            this.pending = false;
            this.handlePayment(res, false, this.$t('renew_package'));
          } else {
            await Promise.all([
              this.$nuxt.refresh(),
              this.$auth.fetchUser()
            ]);
            this.pending = false;
            this.showModal = false;
            this.updatePaidStatus({ 
              type: 'success', 
              text: this.$t('renew_package'), 
              title: this.$t('success_payment') 
            });
          }
        } catch (err) {
          this.pending = false;
        }
      }
    }
  }
</script>