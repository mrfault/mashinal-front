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
                  <p v-html="getTextLines(sellPhoneEntered)" v-if="!loggedIn"></p>
                  <p v-html="getTextLines($parsePhone(user.phone))" v-else></p>
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

      tokens() {
        let tokens = {
          cars: 0,
          moto: 0,
          commercial: 0,
          parts: 0
        }

        for (let type in tokens) {
          let tokenKey = `announce_left_${type}`;
          if (type === 'cars') tokenKey = tokenKey.slice(0, -1);
          else if (type === 'parts') tokenKey = 'part_announce_left';
          if (this.loggedIn) tokens[type] = this.user[tokenKey];
          else if (this.sellTokens) tokens[type] = this.sellTokens[type];
        };

        return tokens;
      },
      hasCategories() {
        return ['moto','commercial'].includes(this.vehicleType);
      },
      vehicleOptions() {
        return this.announcementsMenus.map(menu => ({
          ...menu,
          disabled: this.tokens[menu.title] <= 0
        }));
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
      getTextLines(phone) {
        let isSalon = this.loggedIn && this.user.autosalon;
        let isShop = this.loggedIn && this.user.part_salon;

        let firstLine, secondLine, thirdLine;

        let transportTokens = this.$maxInArray([this.tokens.cars, this.tokens.moto, this.tokens.commercial]);
        let partTokens = this.tokens.parts;

        let firstLocaleEnding = (transportTokens > 0 && partTokens > 0) ? '' : (transportTokens ? '_transport' : '_parts');
        let secondLocaleEnding  = (transportTokens <= 0 && partTokens <= 0) ? '' : (transportTokens <= 0 ? '_transport' : '_parts');

        if (transportTokens || partTokens) {
          firstLine = this.$t(`you_can_create_announcement${firstLocaleEnding}`, { 
            phone: phone.replace('+994 (', '(0'),
            plural: this.$readPlural(transportTokens, this.$t('plural_forms_announcements'), false),
            plural_parts: this.$readPlural(partTokens, this.$t('plural_forms_announcements'), false),
            left: transportTokens, 
            left_parts: partTokens
          });
        }

        if (!transportTokens || !partTokens) {
          secondLine = '<strong class="text-red">*</strong> ' + this.$t(`no_announcements_on_balance${secondLocaleEnding}`);
          thirdLine = this.$t('contact_for_more_info', { 
            phone: (isSalon || isShop) ? '(055) 222-13-05' : '*8787', 
            email: (isSalon || isShop) ? 'elchin.m@mashin.al' : 'support@mashin.al' 
          });
        }
        return [firstLine,secondLine,thirdLine].filter(line => line).map(line => `${line}`).join('<br/><br/>');
      }
    }
  }
</script>