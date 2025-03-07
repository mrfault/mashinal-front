<template>
  <div class="pages-sell">
    <div class="container">
      <breadcrumbs :crumbs="crumbs" />
      <sell-progress v-if="!isMobileBreakpoint" />
      <div class="row">
        <div class="col-lg-5">
          <div class="card mt-5 mt-lg-0">
            <!-- title -->
            <h2 class="title-with-line full-width">
              <span v-if="loggedIn">{{ $t('new_announce') }}</span>
              <span v-if="!loggedIn">{{ $t('login') }}</span>
            </h2>

            <!--  -->
            <div class="sell_tokens-info">
              <client-only>
                <template v-if="loggedIn || sellTokens !== false">
                  <p
                    v-html="getTextLines(sellPhoneEntered)"
                    v-if="!loggedIn"
                  ></p>
                  <p v-html="getTextLines($parsePhone(user.phone))" v-else></p>
                </template>
                <template v-else>
                  <p
                    v-html="
                      $t(
                        'you_can_only_have_some_free_announcement_within_30_days',
                      )
                    "
                  ></p>
                  <!-- login -->
                  <login-tabs
                    :tabOptions="tabOptions"
                    :sellCheckTokens="true"
                  ></login-tabs>
                  <!-- <sell-check-tokens /> -->
                </template>
              </client-only>
            </div>
            <!-- qrcode -->
            <qrcode-box :inSellPage="true"></qrcode-box>
          </div>
        </div>

        <div class="col-lg-7">
          <div class="card mt-2 mt-lg-0">
            <h2 class="title-with-line full-width">
              <span>{{ $t('vehicle_type') }}</span>
            </h2>
<!--             <pre>{{vehicleOptions}}</pre>-->
            <vehicle-options
              :group-by="2"
              :options="vehicleOptions"
              :value="vehicleType"
              @change="handleVehicleType"
            />
            <template v-if="hasCategories">
              <h2 class="title-with-line full-width mt-3" ref="categories">
                <span>{{ $t(vehicleOptions[selectedIndex].title) }}</span>
              </h2>
              <vehicle-options
                :group-by="2"
                :options="vehicleOptions[selectedIndex].children"
                :value="vehicleCategory"
                @change="handleVehicleCategory"
              />
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

import { MenusDataMixin } from '~/mixins/menus-data'

import SellCheckTokens from '~/components/sell/SellCheckTokens'
import VehicleOptions from '~/components/options/VehicleOptions'
import SellProgress from '~/components/sell/SellProgress'
import QrcodeBox from '~/components/login/Qrcode-box.vue'
import SignInForm from '~/components/login/SignInForm.vue'

export default {
  name: 'pages-sell-index',
  components: {
    SellCheckTokens,
    VehicleOptions,
    SellProgress,
    QrcodeBox,
    SignInForm,
  },
  mixins: [MenusDataMixin],
  nuxtI18n: {
    paths: {
      az: '/satmaq',
    },
  },
  data() {
    return {
      tabOptions: {
        header: false,
        signInForm: true,
        confirmPhone: true,
        qrCode: false,
      },
    }
  },
  head() {
    return this.$headMeta({
      title: this.$t('meta-title_sell'),
      description: this.$t('meta-descr_sell'),
    })
  },
  async asyncData({ store, route }) {
    if (!route.query.phone) store.dispatch('resetSellTokens')
    return {
      vehicleType: '',
      vehicleCategory: '',
      selectedIndex: '',
    }
  },
  computed: {
    ...mapGetters(['sellTokens', 'sellPhoneEntered']),

    crumbs() {
      return [{ name: this.$t('place_an_ad') }]
    },

    tokens() {
      let tokens = {
        cars: 0,
        moto: 0,
        commercial: 0,
        parts: 0,
         registration_marks: 0,

        parts_unlimited: this.loggedIn
          ? true
          : this.sellTokens.parts_unlimited,
        salon_unlimited: this.loggedIn
          ? this.user?.autosalon?.status === 1 &&
            this.user?.autosalon?.is_unlimited
          : this.sellTokens.salon_unlimited,
      }

      for (let type of ['cars', 'moto', 'commercial', 'parts', 'registration_marks']) {
        let tokenKey = `announce_left_${type}`;

        if (type === 'cars') tokenKey = tokenKey.slice(0, -1);
        else if (type === 'parts') tokenKey = 'part_announce_left';

        if (this.loggedIn) tokens[type] = this.user[tokenKey];
        else if (this.sellTokens) tokens[type] = this.sellTokens[type];
      }

      return tokens
    },
    hasCategories() {
      return ['moto', 'commercial'].includes(this.vehicleType)
    },
    vehicleOptions() {
      return this.searchMenus.map((menu) => ({
        ...menu,
         disabled: (this.user?.external_salon ? menu.title === 'parts' : false) || this.tokens[menu.title] <= 0 && !this.tokens[menu.title === 'parts' ? 'parts_unlimited' : 'salon_unlimited']
      }))
    },
  },
  methods: {
    handleVehicleType(e) {
      this.vehicleCategory = ''
       e.value === "registration_marks" ? this.vehicleType = '/registration-marks/create' : this.vehicleType = e.value;
      this.selectedIndex = e.index
      if (this.hasCategories) {
        this.$nextTick(() => {
          if (this.isMobileBreakpoint) this.scrollTo(this.$refs.categories, -20)
        })
      } else {
        this.nextSteps()
      }
    },
    handleVehicleCategory(e) {
      this.vehicleCategory = e.value
      this.nextSteps()
    },
    nextSteps() {
       let path;
       if (this.vehicleType === '/registration-marks/create') {
          path = this.$localePath(`${this.vehicleType}${this.vehicleCategory ? `?category=${this.vehicleCategory}` : ''}`);
       } else {
          path = this.$localePath(`/sell/${this.vehicleType}${this.vehicleCategory ? `?category=${this.vehicleCategory}` : ''}`);
       }
      this.$router.push(path);
    },
    getTextLines(phone) {
      let isSalon = this.loggedIn && this.user.autosalon || this.user.external_salon;
      let isShop = this.loggedIn && this.user.part_salon

      let firstLine, secondLine, thirdLine

      let transportTokens = this.$maxInArray([
        this.tokens.cars,
        this.tokens.moto,
        this.tokens.commercial,
        0,
      ])
      let partTokens = this.$maxInArray([this.tokens.parts, 0])

      let hasTransportTokens =
        transportTokens > 0 || this.tokens.salon_unlimited
      let hasPartsTokens = this.user.external_salon ? 0 : (partTokens > 0 || this.tokens.parts_unlimited);

      let firstLocaleEnding =
        hasTransportTokens && hasPartsTokens
          ? ''
          : hasTransportTokens
          ? '_transport'
          : '_parts'
      let secondLocaleEnding =
        !hasTransportTokens && !hasPartsTokens
          ? ''
          : !hasTransportTokens
          ? '_transport'
          : '_parts'

      if (hasTransportTokens || hasPartsTokens) {
        firstLine = this.$t(`you_can_create_announcement${firstLocaleEnding}`, {
          phone: phone.replace('+994 (', '(0'),
          plural: this.$readPlural(
            this.tokens.salon_unlimited ? 1000 : transportTokens,
            this.$t('plural_forms_announcements'),
            false,
          ),
          plural_parts: this.$readPlural(
            this.tokens.parts_unlimited ? 1000 : partTokens,
            this.$t('plural_forms_announcements'),
            false,
          ),
          left: this.tokens.salon_unlimited
            ? this.$t('unlimited_count')
            : transportTokens,
          left_parts: this.tokens.parts_unlimited
            ? this.$t('unlimited_count')
            : partTokens,
        })
      }
        if (!hasTransportTokens || !hasPartsTokens) {
          if(!(secondLocaleEnding && this.user.external_salon) || !this.user.external_salon)  {
            secondLine =
              '<strong class="text-red">*</strong> ' +
              this.$t(`no_announcements_on_balance${secondLocaleEnding}`)
          }
          thirdLine = this.$t('contact_for_more_info', {
            phone:'*8787',
            email:
              isSalon || isShop ? 'sales@al.ventures' : 'office@al.ventures',
          })
        }
      return [firstLine, secondLine, thirdLine]
        .filter((line) => line)
        .map((line) => `${line}`)
        .join('<br/><br/>')
    },
  },
}
</script>

<style lang="scss">
   .pages-sell {
      .card {
         .item {
            .selectable-block {
               &.custom-width {
                  justify-content: center;
                  width: calc(200% + 20px);
                  .block-info {
                     width: unset;
                  }
               }
            }
         }
      }

      .login-forms {
         margin: 0;
         width: 100%;
      }
   }
</style>
