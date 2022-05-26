<template>
  <footer
    class="page-footer d-none d-lg-block"
    :class="{ 'mt--2': isPromotionsPage }"
  >
    <div class="container">
      <div class="row">
        <div class="col-6">
          <nuxt-link
            class="logo"
            :to="$localePath('/')"
            @click.native="$nuxt.$emit('logo-click')"
          >
            <img src="/img/logo-white.svg" alt="logo" v-if="!btlCookie" />
          </nuxt-link>
          <p>{{ $t('learn_about_emerging_product_text') }}</p>
          <newsletter />
          <share-it type="contact" />
          <mark>
            &copy; {{ currentYear }} Mashin.AL Developed by
            <a href="//al.ventures" target="_blank" rel="noopener">
              AlVentures
            </a>
          </mark>
        </div>
        <div class="col-3">
          <h4>{{ $t('site_map') }}</h4>
          <ul class="menu">
            <li v-for="menu in navbarMenus" :key="menu.title">
              <nuxt-link :to="$localePath(menu.route)">
                {{ $t(menu.title) }}
              </nuxt-link>
            </li>
          </ul>
        </div>
        <div class="col-3">
          <h4>{{ $t('useful_links') }}</h4>
          <ul class="menu">
            <li v-for="menu in pageMenus" :key="menu.url">
              <nuxt-link :to="$localePath(menu.route)">
                {{ menu.title[locale] || $t(menu.title) }}
              </nuxt-link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
import { MenusDataMixin } from '~/mixins/menus-data'

import Newsletter from '~/components/elements/Newsletter'

export default {
  components: {
    Newsletter,
  },
  data() {
    return {

    }
  },
  mixins: [MenusDataMixin],
  watch: {
    $route(to, from) {
      if (this.$route.meta.name == 'promotions-page') {
        this.isPromotionsPage = true
      }
    },
  },
  computed:{
    isPromotionsPage(){
      if (this.$route.meta.name == 'promotions-page') {
        return true
      }else{
        return false
      }

    }
  }
}
</script>
