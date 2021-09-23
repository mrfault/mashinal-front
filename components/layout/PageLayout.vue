<template>
  <div :class="['wrapper', { loading }, `${colorMode}-mode`]">
    <component :is="loadingKey < 3 ? 'transition' : 'div'" name="fade">
      <div class="layout" v-show="!loading" :key="loadingKey">
        <mobile-menu>
          <theme-switch v-if="isMobileBreakpoint"/>
        </mobile-menu>
        <page-header />
        <slot name="after-header" />
        <main>
          <slot name="nuxt" />
          <theme-switch :floating="true" v-if="!isMobileBreakpoint" />
          <scroll-top />
        </main>
        <slot name="before-header" />
        <backdrop @click="closeLogin" v-if="showLoginPopup">
          <template #default="{ show }">
            <transition name="translate-fade">
              <login-tabs :popup="true" :skip-sign-in="true" v-if="show" @close="closeLogin" />
            </transition>
          </template>
        </backdrop>
        <modal-popup
          v-if="!isMobileBreakpoint" 
          :toggle="!!paidStatusData" 
          :modal-class="'larger promote-popup'"
          @close="updatePaidStatus(false)"
        >
          <paid-status v-if="paidStatusData" />
        </modal-popup>
        <paid-status v-else-if="paidStatusData" />
        <!-- portal targets -->
        <portal-target name="modals" multiple />
        <portal-target name="mobile-dropdown" multiple />
        <portal-target name="mobile-screen" />
        <portal-target name="backdrop" />
        <!-- /portal targets -->
        <comparison-badge />
        <mobile-nav />
        <page-footer v-if="!hideFooter" />
      </div>
    </component>
  </div>
</template>

<script>
import { LayoutMixin } from '~/mixins/layout';

import PageHeader from '~/components/layout/PageHeader';
import PageFooter from '~/components/layout/PageFooter';
import MobileMenu from '~/components/layout/MobileMenu';
import MobileNav from '~/components/layout/MobileNav';
import PaidStatus from '~/components/elements/PaidStatus';
import ThemeSwitch from '~/components/elements/ThemeSwitch';
import ScrollTop from '~/components/elements/ScrollTop';
import ComparisonBadge from '~/components/elements/ComparisonBadge';

export default {
  mixins: [LayoutMixin],
  components: {
    PageHeader,
    PageFooter,
    MobileMenu,
    MobileNav,
    PaidStatus,
    ThemeSwitch,
    ScrollTop,
    ComparisonBadge
  }
}
</script>