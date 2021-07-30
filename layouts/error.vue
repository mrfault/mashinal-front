<template>
  <div class="pages-404">
    <div class="container">
      <breadcrumbs :crumbs="crumbs" />
      <div class="info-404 text-center">
        <img :src="`/img/404${isDarkMode ? '-dark-mode' : ''}.svg`" :alt="errorTitle" />
        <h1>{{ errorTitle }}</h1>
        <nuxt-link class="btn btn--green" :to="$localePath('/')">
          <icon name="arrow-left" /> {{ $t('back_to_home') }}
        </nuxt-link>
      </div>
    </div>
  </div>
</template>

<script>
import { LayoutMixin } from '~/mixins/layout';

export default {
  name: 'layout-error',
  props: ['error'],
  mixins: [LayoutMixin],
  scrollToTop: true,
  head() {
    return this.$headMeta({
      title: this.errorTitle
    })
  },
  computed: {
    crumbs() {
      return [
        { name: this.errorTitle }
      ]
    },
    errorTitle() {
      if(this.error.statusCode == 404) 
        return this.$t('page_not_found_error');
      return this.$t('server_error');
    }
  }
}
</script>