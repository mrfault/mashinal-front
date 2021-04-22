<template>
  <div class="pages-404">
    <div class="container">
      <breadcrumbs :crumbs="crumbs" />
      <div class="info-404 text-center">
        <img :src="`/img/404${theme === 'dark' ? '-dark-mode' : ''}.svg`" :alt="errorTitle" />
        <h1>{{ errorTitle }}</h1>
        <button class="btn btn--green" @click="$router.back()">
          <icon name="arrow-left" /> {{ $t('return_back') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { LayoutMixin } from '~/mixins/layout';

export default {
  props: ['error'],
  mixins: [LayoutMixin],
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