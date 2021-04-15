<template>
  <div class="layout">
    <page-header />
    <main>
      <nuxt />
    </main>
    <page-footer />
  </div>
</template>

<script>
  import { LayoutMixin } from '~/mixins/layout';

  const PageHeader = () => import('~/components/elements/layout/PageHeader');
  const PageFooter = () => import('~/components/elements/layout/PageFooter');

  export default {
    mixins: [LayoutMixin],
    components: {
      PageHeader,
      PageFooter
    }
  }
</script>