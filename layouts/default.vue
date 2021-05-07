<template>
  <page-layout>
    <template #nuxt>
      <nuxt />
    </template>
  </page-layout>
</template>

<script>
import PageLayout from '~/components/layout/PageLayout';

export default {
  name: 'layout-default',
  components: {
    PageLayout
  }
}
</script>