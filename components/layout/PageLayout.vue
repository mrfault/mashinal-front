<template>
  <div :class="['wrapper', { loading }, `${colorMode}-mode`]">

    <transition name="fade">
      <div class="layout" v-show="!loading" :class="{'layoutForMap': checkRouteIfSalon}">
        <site-banner type="top" />
        <mobile-menu/>

        <page-header/>

         <!-- v-if="!isMobileBreakpoint && !close && !$cookies.get('smartbanner_exited')" -->
        <slot name="after-header"/>
        <main :class="{'min-height-if-notification':  !cookiesHasNotificationOn || storeBannerIsOn, 'min-height-if-not-notification':  cookiesHasNotificationOn || !storeBannerIsOn, 'positionInitial' : checkRouteIfSalon}">

          <site-banner
            v-if="windowWidth > 1800"
            :key="timestamp"
            type="left"
            absolute
          />

          <slot name="nuxt"/>

          <site-banner
            v-if="windowWidth > 1800"
            :key="timestamp+1"
            type="right"
            absolute
          />
          <scroll-top :style="windowWidth > 1800 ? 'right: calc((100% - 1200px) / 2);':''" v-if="!hideFooter"/>
          <map-switch :style="windowWidth > 1800 ? 'right: calc((100% - 1200px) / 2);':''" v-if="['salons','parts-shops'].includes(routeName)"/>
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
  computed:{
    ...mapState(['mapView','timestamp']),
    cookiesHasNotificationOn(){
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

