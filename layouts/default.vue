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

  import PageHeader from '~/components/layout/PageHeader';
  import PageFooter from '~/components/layout/PageFooter';

  export default {
    mixins: [LayoutMixin],
    components: {
      PageHeader,
      PageFooter
    }
  }
</script>