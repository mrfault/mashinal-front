<template>
  <div :class="['wrapper', { loading }, `${colorMode}-mode`]">
    <transition name="fade">
      <div class="layout" v-show="!loading">
        <mobile-menu/>

        <page-header/>
         <!-- v-if="!isMobileBreakpoint && !close && !$cookies.get('smartbanner_exited')" -->
        <slot name="after-header"/>
        <main :class="{'min-height-if-notification':  !cookiesHasNotificationOn || storeBannerIsOn, 'min-height-if-not-notification':  cookiesHasNotificationOn || !storeBannerIsOn}">
          <slot name="nuxt"/>
          <scroll-top v-if="!hideFooter"/>
          <map-switch v-if="['salons','parts-shops'].includes(routeName)"/>
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
        <comparison-badge/>
        <mobile-nav/>
        <page-footer v-if="!hideFooter"/>
      </div>
    </transition>
  </div>
</template>

<script>
import {LayoutMixin} from '~/mixins/layout';

import PageHeader from '~/components/layout/PageHeader';
import PageFooter from '~/components/layout/PageFooter';
import MobileMenu from '~/components/layout/MobileMenu';
import MobileNav from '~/components/layout/MobileNav';
import PaidStatus from '~/components/payments/PaidStatus';
import ScrollTop from '~/components/elements/ScrollTop';
import ComparisonBadge from '~/components/elements/ComparisonBadge';
import MapSwitch from '~/components/salons/MapSwitch';

export default {
  mixins: [LayoutMixin],
  components: {
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
    }
  }
}
</script>
