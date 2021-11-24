<template>
  <div class="pages-policy pt-2 pt-lg-5">
    <div class="container">
      <breadcrumbs :crumbs="crumbs" />
      <div :class="['card with-margins has-collapse', {'mb-2 mb-lg-3': index !== staticPages.length - 1}]" v-for="(page, index) in staticPages" :key="page.id">
        <collapse-content
          :title="page.title[locale]"
          :first-collapsed="true"
          :title-with-hr="true"
          :animate="false"
        >
          <div v-html="page.text[locale].replace(/&nbsp;/g, ' ')"></div>
        </collapse-content>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

import CollapseContent from '~/components/elements/CollapseContent';

export default {
  name: 'pages-policy',
  components: {
    CollapseContent
  },
  nuxtI18n: {
    paths: {
      az: '/qaydalar'
    }
  },
  head() {
    return this.$headMeta({
      title: this.$t('policy')
    });
  },
  computed: {
    ...mapGetters(['staticPages']),

    crumbs() {
      return [
        { name: this.$t('policy') }
      ]
    }
  }
}
</script>