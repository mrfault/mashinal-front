<template>
  <div class="pages-404">
    <div class="container">
      <breadcrumbs :crumbs="crumbs" />
      <not-found 
        :text="notFound ? errorTitle : $t('dev_will_solve')" 
        :text-class="(notFound ? 'text-red' : 'text-dark-blue-2') + ' text-center'"
        :img-src="notFound ? '' : '/img/programmers.svg'"
      >
        <nuxt-link class="btn btn--green" :to="$localePath('/')">
          <icon name="arrow-left" /> {{ $t('back_to_home') }}
        </nuxt-link>
      </not-found>
    </div>
  </div>
</template>

<script>
import { LayoutMixin } from '~/mixins/layout';

import NotFound from '~/components/elements/NotFound';

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
    notFound() {
      return this.error.statusCode == 404;
    },
    errorTitle() {
      if (this.notFound) 
        return this.$t('page_not_found_error');
      return this.$t('server_error');
    }
  }
}
</script>
