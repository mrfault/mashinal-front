<template>
  <div class="pages-404">
    <div class="container">
      <breadcrumbs :crumbs="crumbs" />
      <NotFound :title="errorTitle">
        <nuxt-link class="btn btn--green" :to="$localePath('/')">
          <icon name="arrow-left" /> {{ $t('back_to_home') }}
        </nuxt-link>
      </NotFound>
    </div>
  </div>
</template>

<script>
import { LayoutMixin } from '~/mixins/layout';
import NotFound from '@/components/elements/NotFound.vue'

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
  components: {
    NotFound
  },
  computed: {
    crumbs() {
      return [
        { name: this.errorTitle }
      ]
    },
    errorTitle() {
      if (this.error.statusCode == 404) 
        return this.$t('page_not_found_error');
      return this.$t('server_error');
    }
  }
}
</script>