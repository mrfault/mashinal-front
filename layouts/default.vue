<template>
  <div class="layout">
    <mobile-menu />
    <page-header />
    <main>
      <nuxt />
    </main>
    <page-footer />
    <mobile-nav />
  </div>
</template>

<script>
  import { LayoutMixin } from '~/mixins/layout';

  import PageHeader from '~/components/layout/PageHeader';
  import PageFooter from '~/components/layout/PageFooter';
  import MobileMenu from '~/components/layout/MobileMenu';
  import MobileNav from '~/components/layout/MobileNav';

  export default {
    mixins: [LayoutMixin],
    components: {
      PageHeader,
      PageFooter,
      MobileMenu,
      MobileNav
    }
  }
</script>