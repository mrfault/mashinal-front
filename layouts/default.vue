<template>
  <div :class="['wrapper', {loading}, `${colorMode}-mode`]">
    <transition name="fade">
      <div class="layout" v-show="!loading">
        <mobile-menu v-if="isMobileBreakpoint">
          <theme-switch />
        </mobile-menu>
        <page-header v-else />
        <search-nav v-if="isMobileBreakpoint && showSearchNav" />
        <main>
          <nuxt />
          <theme-switch :floating="true" v-if="!isMobileBreakpoint" />
          <scroll-top />
        </main>
        <backdrop @click="closeLogin" v-if="showLoginPopup">
          <template #default="{ show }">
            <transition name="translate-fade">
              <login-tabs :popup="true" :skip-sign-in="true" v-if="show" />
            </transition>
          </template>
        </backdrop>
        <mobile-nav v-if="isMobileBreakpoint" />
        <page-footer v-else />
      </div>
    </transition>
  </div>
</template>

<script>
import { LayoutMixin } from '~/mixins/layout';

import PageHeader from '~/components/layout/PageHeader';
import PageFooter from '~/components/layout/PageFooter';
import MobileMenu from '~/components/layout/MobileMenu';
import MobileNav from '~/components/layout/MobileNav';
import SearchNav from '~/components/layout/SearchNav';
import ThemeSwitch from '~/components/elements/ThemeSwitch';
import ScrollTop from '~/components/elements/ScrollTop';

export default {
  mixins: [LayoutMixin],
  components: {
    PageHeader,
    PageFooter,
    MobileMenu,
    MobileNav,
    SearchNav,
    ThemeSwitch,
    ScrollTop
  }
}
</script>