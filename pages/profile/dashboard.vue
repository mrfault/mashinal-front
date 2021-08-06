<template>
  <div class="pages-profile-dashboard pt-2 pt-lg-5">
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
                  <span class="bar-filled" :style="{width:`calc(${100*(announceStats.left/announceStats.possible)}% + 15px)`}" v-if="announceStats.left">{{ announceStats.left }}</span>
                  <span class="bar-empty" :style="{width:`calc(${100*(announceStats.used/announceStats.possible)}% - 15px)`}" v-if="announceStats.used">{{ announceStats.used }}</span>
                </div>
              </div>
            </template>
            <template v-else-if="card.key === 'calls'">
              <h4 class="text-dark-blue-2">{{ announceStats.calls }}</h4>
              <p v-html="$t('phone_visited_n_times', { count: $readPlural(announceStats.calls, $t('plural_forms_times')) })"></p>
            </template>
            <template v-else-if="card.key === 'messages'">
              <ul>
                <li>{{ $t('vsego') }}: {{ circleStats[3].value }}</li>
                <li :class="{'text-red': unreadMsgCount > 0}">{{ $t('unread_messages') }}: {{ unreadMsgCount }}</li>
              </ul>
            </template>
            <template v-else-if="card.key === 'autosalon'">
              <h4>{{ user.autosalon.name }}</h4>
              <p>{{ user.autosalon.short_description || '' }}</p>
            </template>
            <template v-else-if="card.key === 'services'">
              <div class="statistics-services">
                <ul>
                  <li v-for="(stat, i) in packageStats" :key="i">
                    <icon class="text-red" :name="stat.icon" />
                    <span>{{ stat.label }} - <strong>{{ stat.have }}</strong></span>
                  </li>
                </ul>
              </div>
            </template>
            <template v-else-if="card.key === 'contract'">
              <p class="mt-1">{{ $t('contract_end_time') }}:<br/><strong>{{ announceStats.contract.end_date }}</strong></p>
              <h4 class="skip-truncate">
                <strong :class="shouldExtendContract ? 'text-red' : 'text-green'">
                  {{ announceStats.contract.left_days }}
                </strong> 
                {{ $readPlural(announceStats.contract.left_days, $t('plural_forms_day'), false) }}
              </h4>
            </template>
            <template v-else-if="card.key === 'statistics'">
              <div class="statistics-announcements smaller">
                <div class="circle-bar" v-for="(stat, i) in circleStats.slice(0,-1)" :key="i">
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
              <a class="text-green" href="javascript:void(0);" @click="showExtendContract = true" v-else-if="card.key === 'contract' && shouldExtendContract">
                {{ $t('pay') }}
              </a>
            </template>
          </dashboard-card>
        </div>
        <div class="col-lg-3 mb-2 mb-lg-3">
          <dashboard-card :key="'support'">
            <div class="d-flex flex-column justify-content-between align-items-center full-height pt-2 pb-2">
              <div class="support-contact" v-for="(contact, i) in supportContacts" :key="i">
                <h5><a :href="`tel:${contact.call}`">{{ contact.phone }}</a></h5>
                <p><a :href="`mailto:${contact.email}`">{{ contact.email }}</a></p>
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
            <p v-html="$t('pay_till_date', { date: announceStats.contract.end_date })"></p>
            <h4>{{ $t('payment_method') }}</h4>
            <div class="mb-2 mb-lg-0">
              <form-buttons v-model="selectedPaymentMethod" :options="paymentMethodOptions" :group-by="2" />
            </div>
            <hr />
            <div class="row">
              <div class="col-6">
                <span class="total-price">
                  <span>{{ $t('total')}}</span>
                  <strong>{{ announceStats.contract.price }} ₼</strong>
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
    name: 'pages-profile-dashboard',
    middleware: ['auth_general','auth_autosalon'],
    mixins: [StatsMixin, PaymentMixin],
    components: {
      DashboardCard
    },  
    nuxtI18n: {
      paths: {
        az: '/profil/idareetme-paneli'
      }
    },
    head() {
      return this.$headMeta({
        title: this.$t('dashboard')
      });
    },
    async asyncData({store}) {
      await Promise.all([
        store.dispatch('getAnnouncementStats'),
        store.dispatch('getPackageStats')
      ]); 

      return {
        pending: false,
        showExtendContract: false,
        supportContacts: [
          { phone: '055-222-13-51', call: '+994552221351', email: 'adalat@al.ventures' },
          { phone: '055-222-13-51', call: '+994552221351', email: 'elchin.m@al.ventures' }
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

      cards() {
        return [
          { key: 'announcements', title: 'my_announces', route: '/profile/announcements', icon: 'photo' },
          { key: 'services', title: 'services', route: '/profile/payments', icon: 'crown' },
          { key: 'statistics', title: 'statistics', route: '/profile/statistics', icon: 'analytics' },
          { key: 'messages', title: 'messages', route: '/profile/messages', icon: 'chat' },
          { key: 'calls', title: 'phone_call_count', route: '/profile/calls', icon: 'phone' },
          { key: 'autosalon', title: 'my_profile', route: '/profile/autosalon', icon: 'user' },
          { key: 'contract', title: 'contract', route: '/profile/payments', icon: 'calendar-1' }
        ].map(link => ({ ...link,
          title: this.$t(link.title), 
          path: this.$localePath(link.route)
        }));
      },

      unreadMsgCount() {
        let unread = this.messages.filter((group) => {
          return group.last_message && !group.last_message.is_read && parseInt(group.last_message.sender_id) !== parseInt(this.user.id);
        });
        return unread.length;
      },

      shouldExtendContract() {
        return this.announceStats.contract.left_days < 8;
      }
    },
    methods: {
      async extendContract() {
        if (this.pending) return;
        this.pending = true;
        try {
          const res = await this.$axios.$get(`/payment/package`);
          this.pending = false;
          this.handlePayment(res);
        } catch (err) {
          this.pending = false;
        }
      }
    }
  }
</script>