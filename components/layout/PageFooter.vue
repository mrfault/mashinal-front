<template>
  <footer class="page-footer d-none d-lg-block">
    <div class="container">
      <div class="row">
        <div class="col-6">
          <nuxt-link class="logo" :to="$localePath('/')">
            <img src="/img/logo-white.svg" alt="logo" />
          </nuxt-link>
          <p>{{ $t('learn_about_emerging_product_text') }}</p>
          <newsletter />
          <div class="socials">
            <a v-for="(link, key) in socialLinks" :key="key" :href="link" rel="noopener" target="_blank">
              <icon :name="key" />
            </a>
          </div>
          <mark>&copy; {{ currentYear }} Mashin.al Developed by 
            <a href="//al.ventures" target="_blank" rel="noopener">AlVentures</a>
          </mark>
        </div>
        <div class="col-3">
          <h4>{{ $t('site_map') }}</h4>
          <ul class="menu">
            <li v-for="menu in navbarMenus" :key="menu.url">
              <nuxt-link :to="$localePath(menu.url)">{{ menu.name[locale] }}</nuxt-link>
            </li>
          </ul>
        </div>
        <div class="col-3">
          <h4>{{ $t('useful_links') }}</h4>
          <ul class="menu">
            <li v-for="menu in pageMenus" :key="menu.url">
              <nuxt-link :to="menu.url">{{ menu.name }}</nuxt-link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

import Newsletter from '~/components/elements/Newsletter';

export default {
  components: {
    Newsletter
  },
  computed: {
    ...mapGetters(['navbarMenus', 'staticPages']),

    pageMenus() {
      return [{
        name: this.$t('contact_us'),
        url: this.$localePath('/contact-us')
      }].concat(this.staticPages.map(page => ({
        name: page.title[this.locale], 
        url: this.$localePath('/page/:page').replace(':page', page.slug[this.locale])
      })));
    },
    socialLinks() {
      return {
        facebook: 'https://facebook.com/mashinal',
        instagram: 'https://instagram.com/mashin.al'
      }
    }
  },
  methods: {
    ...mapActions([])
  }
}
</script>