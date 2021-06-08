<template>
  <div class="pages-sell">
    <div class="container">
      <breadcrumbs :crumbs="crumbs" />
      <sell-progress v-if="!isMobileBreakpoint "/>
      <div class="row">
        <div class="col-lg-5">
          <div class="card mt-5 mt-lg-0">
            <h2 class="title-with-line full-width">
              <span>{{ $t('new_announce') }}</span>
            </h2>
            <div class="sell_tokens-info">
              <client-only>
                <template v-if="loggedIn || sellTokens !== false">
                  <template v-if="loggedIn && user.announce_left > 0">
                    <p v-html="$t('you_can_create_announcement', { 
                      phone: $parsePhone(user.phone).replace('+994 (', '(0'),
                      plural: $readPlural(user.announce_left, $t('plural_forms_announcements'), false),
                      left: user.announce_left
                    })"></p>
                  </template>
                  <template v-else-if="!loggedIn && sellTokens > 0">
                    <p v-html="$t('you_can_create_announcement', { 
                      phone: sellPhoneEntered.replace('+994 (', '(0'),
                      plural: $readPlural(sellTokens, $t('plural_forms_announcements'),  false),
                      left: sellTokens
                    })"></p>
                  </template>
                  <template v-else>
                    <p><strong class="text-red">*</strong> {{ $t('no_announcements_on_balance') }}</p><br/>
                    <p v-if="loggedIn && user.autosalon" v-html="$t('contact_for_more_info', { phone: '(055) 222-13-05', email: 'elchin.m@mashin.al' })"></p>
                    <p v-else v-html="$t('contact_for_more_info', { phone: '*8787', email: 'support@mashin.al' })"></p>
                  </template>
                </template>
                <template v-else>
                  <p v-html="$t('you_can_only_have_3_announce_within_30_days')"></p>
                  <sell-check-tokens />
                </template>
              </client-only>
            </div>
          </div>
        </div>
        <div class="col-lg-7">
          <div :class="['card mt-2 mt-lg-0', {disabled: disableSteps}]">
            <h2 class="title-with-line full-width">
              <span>{{ $t('vehicle_type') }}</span>
            </h2>
            <vehicle-options :options="searchMenus" :value="vehicleType" @change="handleVehicleType" />
            <template v-if="!disableSteps && hasCategories">
              <h2 class="title-with-line full-width mt-3" ref="categories">
                <span>{{ $t(searchMenus[selectedIndex].title) }}</span>
              </h2>
              <vehicle-options :options="searchMenus[selectedIndex].children" :value="vehicleCategory" @change="handleVehicleCategory" />
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex';

  import { MenusDataMixin } from '~/mixins/menus-data';

  import SellCheckTokens from '~/components/sell/SellCheckTokens';
  import VehicleOptions from '~/components/options/VehicleOptions';
import SellProgress from '~/components/sell/SellProgress';

  export default {
    name: 'pages-sell-index',
    components: {
      SellCheckTokens,
      VehicleOptions,
      SellProgress
    },
    mixins: [MenusDataMixin],
    nuxtI18n: {
      paths: {
        az: '/satmaq'
      }
    },
    head() {
      return this.$headMeta({
        title: this.$t('meta-title_sell'),
        description: this.$t('meta-descr_sell')
      });
    },
    async asyncData({ store, route }) {
      if (!route.query.phone) 
        store.dispatch('resetSellTokens');
      return {
        vehicleType: '',
        vehicleCategory: '',
        selectedIndex: ''
      }
    },
    computed: {
      ...mapGetters(['sellTokens', 'sellPhoneEntered']),

      crumbs() {
        return [
          { name: this.$t('place_an_ad') }
        ]
      },

      hasCategories() {
        return ['moto','commercial'].includes(this.vehicleType);
      },
      disableSteps() {
        return !(this.loggedIn && this.user.announce_left > 0) && !(!this.loggedIn && this.sellTokens > 0);
      }
    },
    methods: {
      handleVehicleType(e) {
        if (this.disableSteps) return;
        this.vehicleCategory = '';
        this.vehicleType = e.value;
        this.selectedIndex = e.index;
        if (this.hasCategories) {
          this.$nextTick(() => {
            if (this.isMobileBreakpoint) 
              this.scrollTo(this.$refs.categories, -20);
          });
        } else {
          this.nextSteps();
        }
      },
      handleVehicleCategory(e) {
        if (this.disableSteps) return;
        this.vehicleCategory = e.value;
        this.nextSteps();
      },
      nextSteps() {
        let category = this.hasCategories && this.searchMenus[this.selectedIndex].children
            .find(item => item.title === this.vehicleCategory).icon
            .split('-')
            .pop();
        let path = this.$localePath(`/sell/${this.vehicleType}${category ? `?category=${category}` : ''}`);
        this.$router.push(path);
      }
    }
  }
</script>