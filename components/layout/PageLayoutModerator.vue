<template>
  <div :class="['wrapper', { loading }, `${colorMode}-mode`]"
  :style="loading ? 'background-image: url(' + ($env.NEW_YEAR_SOON ? ('/img/logo-white-newyear.svg') : ('/img/logo-white-2.svg')) + ')' : ''"
  >

    <transition name="fade">
      <div class="layout" v-show="!loading" :class="{'layoutForMap': checkRouteIfSalon}">
        <mobile-menu/>

        <page-header/>

         <!-- v-if="!isMobileBreakpoint && !close && !$cookies.get('smartbanner_exited')" -->
        <slot name="after-header"/>
        <main :class="{'min-height-if-notification':  !cookiesHasNotificationOn || storeBannerIsOn, 'min-height-if-not-notification':  cookiesHasNotificationOn || !storeBannerIsOn, 'positionInitial' : checkRouteIfSalon}">

          <site-banner
            v-if="windowWidth > 1800"
            :check-emitting="checkEmitting"
            type="left"
            absolute
          />

          <slot name="nuxt"/>

        </main>
        <slot name="before-header"/>
        <backdrop @click="closeLogin" v-if="showLoginPopup">
          <template #default="{ show }">
            <transition name="translate-fade">
              <login-tabs :popup="true" :skip-sign-in="true" :initial-form="loginInitialForm" v-if="show"
                          @close="closeLogin"/>
            </transition>
          </template>
        </backdrop>
        <modal-popup
          v-if="!isMobileBreakpoint"
          :toggle="!!paidStatusData"
          :modal-class="'status-popup'"
          @close="updatePaidStatus(false)"
        >
          <paid-status v-if="paidStatusData"/>
        </modal-popup>
        <paid-status v-else-if="paidStatusData"/>
        <!-- portal targets -->
        <portal-target name="modals" multiple/>
        <portal-target name="mobile-dropdown" multiple/>
        <portal-target name="mobile-screen"/>
        <portal-target name="backdrop"/>
        <!-- /portal targets -->
        <comparison-badge :window-width="windowWidth"/>
        <mobile-nav/>
        <page-footer v-if="!hideFooter"/>


      </div>
    </transition>
  </div>
</template>
<style>
.smartb-background {
  background: #D0DBF9 url("/img/smartbanner.png") no-repeat center center !important;
  background-size: 260px !important;
}
.small-logo {
  width: 94px;
}
</style>
<script>
import {LayoutMixin} from '~/mixins/layout';
import { mapState } from 'vuex'
import PageHeader from '~/components/layout/PageHeader';
import PageFooter from '~/components/layout/PageFooter';
import MobileMenu from '~/components/layout/MobileMenu';
import MobileNav from '~/components/layout/MobileNav';
import PaidStatus from '~/components/payments/PaidStatus';
import ScrollTop from '~/components/elements/ScrollTop';
import ComparisonBadge from '~/components/elements/ComparisonBadge';
import MapSwitch from '~/components/salons/MapSwitch';
import SiteBanner from "~/components/banners/SiteBanner";

export default {
  mixins: [LayoutMixin],
  components: {
    SiteBanner,
    PageHeader,
    PageFooter,
    MobileMenu,
    MobileNav,
    PaidStatus,
    ScrollTop,
    ComparisonBadge,
    MapSwitch
  },
  data() {
    return {
      newYearConditionalCss: 'background-image: url(' + (this.$env.NEW_YEAR_SOON ? ('/img/logo-white-newyear.svg') : ('/img/logo-white-2.svg')) + ')',
      showPopupBanner: true,
      checkEmitting: 0,
    }
  },
  methods: {
    detectDevice() {
      const userAgent = window.navigator.userAgent;
      const isIphone = userAgent.includes('iPhone');
      const isAndroid = userAgent.includes('Android');

      if(isIphone) {
        window.location.href = "https://apps.apple.com/ru/app/mashin-al/id1588371190"
      }
      else if (isAndroid) {
        window.location.href = "https://play.google.com/store/apps/details?id=ventures.al.mashinal";
      }
    },
    closePromotion() {
      this.$cookies.set('smartbanner_exited', 1)
      this.showPopupBanner = false
      this.$store.commit('closeSmartBanner', false)
    },
  },
  computed:{
    ...mapState(['mapView','timestamp']),
    cookiesHasNotificationOn() {
      var cookie = this.$cookies.get('smartbanner_exited');
      if (cookie) {
        return true;
      }else{
        return false;
      }
    },
    storeBannerIsOn(){
      return this.$store.state.smartBanner;
    },
    checkRouteIfSalon(){
      return this.mapView && (this.$route.name == "salons___az"  || this.$route.name == "salons___ru" || this.$route.name == "parts-shops___az" || this.$route.name == "parts-shops___ru")
    }
  },

}
</script>

