<template>
  <div :class="['wrapper', {loading}, `${colorMode}-mode`]">
    <transition name="fade">
      <div class="layout" v-show="!loading">
        <mobile-menu>
          <theme-switch />
        </mobile-menu>
        <page-header />
        <slot name="after-header" />
        <main>
          <slot name="nuxt" />
          <theme-switch :floating="true" />
          <scroll-top />
        </main>
        <slot name="before-header" />
        <backdrop @click="closeLogin" v-if="showLoginPopup">
          <template #default="{ show }">
            <transition name="translate-fade">
              <login-tabs :popup="true" :skip-sign-in="true" v-if="show" />
            </transition>
          </template>
        </backdrop>
        <portal-target name="mobile-screen" />
        <portal-target name="modals" />
        <mobile-nav />
        <page-footer />
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
import ThemeSwitch from '~/components/elements/ThemeSwitch';
import ScrollTop from '~/components/elements/ScrollTop';

export default {
  mixins: [LayoutMixin],
  components: {
    PageHeader,
    PageFooter,
    MobileMenu,
    MobileNav,
    ThemeSwitch,
    ScrollTop
  }
}
</script>