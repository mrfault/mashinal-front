<template>
  <div class="pages-page-page pt-2 pt-lg-5">
    <div class="container">
      <breadcrumbs :crumbs="crumbs" />
      <div class="card">
        <h1>{{ page.title[locale] }}</h1>
        <div v-html="page.text[locale]"></div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'pages-page-slug',
    nuxtI18n: {
      paths: {
        az: '/sehfe/:page'
      }
    },
    head() {
      return this.$headMeta({
        title: this.page.title[this.locale]
      });
    },
    async asyncData({ store, route, app }) {
      let page = store.getters.staticPages.find(page => page.slug[app.i18n.locale] === route.params.page);
      await store.dispatch('i18n/setRouteParams', { 
        az: { page: page.slug.az }, 
        ru: { page: page.slug.ru } 
      });
      return { page }
    },
    computed: {
      crumbs() {
        return [
          { name: this.page.title[this.locale] }
        ]
      }
    }
  }
</script>