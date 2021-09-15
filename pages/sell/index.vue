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
                  <p v-html="getTextLines(sellTokens.transport, sellTokens.parts, sellPhoneEntered)" v-if="!loggedIn"></p>
                  <p v-html="getTextLines(user.announce_left, user.part_announce_left, $parsePhone(user.phone))" v-else></p>
                </template>
                <template v-else>
                  <p v-html="$t('you_can_only_have_some_free_announcement_within_30_days')"></p>
                  <sell-check-tokens />
                </template>
              </client-only>
            </div>
          </div>
        </div>
        <div class="col-lg-7">
          <div class="card mt-2 mt-lg-0">
            <h2 class="title-with-line full-width">
              <span>{{ $t('vehicle_type') }}</span>
            </h2>
            <vehicle-options :group-by="2" :options="vehicleOptions" :value="vehicleType" @change="handleVehicleType" />
            <template v-if="hasCategories">
              <h2 class="title-with-line full-width mt-3" ref="categories">
                <span>{{ $t(vehicleOptions[selectedIndex].title) }}</span>
              </h2>
              <vehicle-options :group-by="2" :options="vehicleOptions[selectedIndex].children" :value="vehicleCategory" @change="handleVehicleCategory" />
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
      vehicleOptions() {
        let hasTransportTokens = !this.loggedIn ? this.sellTokens?.transport > 0 : this.user.announce_left > 0;
        let hasPartsTokens = !this.loggedIn ? this.sellTokens?.parts > 0 : this.user.part_announce_left > 0;
        return this.announcementsMenus.map(menu => ({
          ...menu,
          disabled: (menu.title === 'parts' && !hasPartsTokens) || (menu.title !== 'parts' && !hasTransportTokens)
        }))
      }
    },
    methods: {
      handleVehicleType(e) {
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
        this.vehicleCategory = e.value;
        this.nextSteps();
      },
      nextSteps() {
        let category = this.hasCategories && this.vehicleOptions[this.selectedIndex].children
            .find(item => item.title === this.vehicleCategory).icon
            .split('-')
            .pop();
        let path = this.$localePath(`/sell/${this.vehicleType}${category ? `?category=${category}` : ''}`);
        this.$router.push(path);
      },
      getTextLines(transportTokens, partsTokens, phone) {
        let firstLine, secondLine, thirdLine;
        let canSellTransport = transportTokens > 0, 
            canSellParts = partsTokens > 0, 
            isSalon = this.loggedIn && this.user.autosalon;
        let firstLocaleEnding  = (canSellTransport && canSellParts) ? '' : (canSellTransport ? '_transport' : '_parts');
        let secondLocaleEnding  = (!canSellTransport && !canSellParts) ? '' : (!canSellTransport ? '_transport' : '_parts');
        if (canSellTransport || canSellParts) {
          firstLine = this.$t(`you_can_create_announcement${firstLocaleEnding}`, { 
            phone: phone.replace('+994 (', '(0'),
            plural: this.$readPlural(transportTokens, this.$t('plural_forms_announcements'), false),
            plural_parts: this.$readPlural(partsTokens, this.$t('plural_forms_announcements'), false),
            left: transportTokens, 
            left_parts: partsTokens
          });
        }
        if (!canSellTransport || !canSellParts) {
          secondLine = '<strong class="text-red">*</strong> ' + this.$t(`no_announcements_on_balance${secondLocaleEnding}`);
          thirdLine = this.$t('contact_for_more_info', { 
            phone: isSalon ? '(055) 222-13-05' : '*8787', 
            email: isSalon ? 'elchin.m@mashin.al' : 'support@mashin.al' 
          });
        }
        return [firstLine,secondLine,thirdLine].filter(line => line).map(line => `${line}`).join('<br/><br/>');
      }
    }
  }
</script>