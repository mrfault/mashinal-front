<template>
   <footer
      class="page-footer d-none d-lg-block"
      :class="{ 'mt--2': isPromotionsPage }"
   >
      <a style="display: none" href="https://www.liveinternet.ru/click"
         target="_blank"><img id="licntBC4A" width="88" height="31" style="border:0"
                              title="LiveInternet: number of pageviews for 24 hours, of visitors for 24 hours and for today is shown"
                              src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAEALAAAAAABAAEAAAIBTAA7"
                              alt=""/></a>
      <div class="container">
         <div class="row">
            <div class="col-6">
               <nuxt-link
                  class="logo"
                  :to="$localePath('/')"
                  @click.native="$nuxt.$emit('logo-click')"
               >
                  <img
                     :src="$env.NEW_YEAR_SOON ? '/img/logo-white-newyear.svg' : '/img/logo-white.svg'"
                     alt="logo"
                     :style="$env.NEW_YEAR_SOON ? 'height: 50px;': ''"
                     v-if="!btlCookie"
                  />
               </nuxt-link>
               <p>{{ $t('learn_about_emerging_product_text') }}</p>
               <newsletter/>
               <share-it type="contact"/>
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
import {MenusDataMixin} from '~/mixins/menus-data'

import Newsletter from '~/components/elements/Newsletter'

export default {
   components: {
      Newsletter,
   },
   data() {
      return {}
   },
   mounted() {
      (function (d, s) {
         d.getElementById("licntBC4A").src =
            "https://counter.yadro.ru/hit?t12.6;r" + escape(d.referrer) +
            ((typeof (s) == "undefined") ? "" : ";s" + s.width + "*" + s.height + "*" +
               (s.colorDepth ? s.colorDepth : s.pixelDepth)) + ";u" + escape(d.URL) +
            ";h" + escape(d.title.substring(0, 150)) + ";" + Math.random()
      })
      (document, screen)
   },
   mixins: [MenusDataMixin],
   watch: {
      $route(to, from) {
         if (this.$route.meta.name == 'promotions-page') {
            this.isPromotionsPage = true
         }
         (function (d, s) {
            d.getElementById("licntBC4A").src =
               "https://counter.yadro.ru/hit?t12.6;r" + escape(d.referrer) +
               ((typeof (s) == "undefined") ? "" : ";s" + s.width + "*" + s.height + "*" +
                  (s.colorDepth ? s.colorDepth : s.pixelDepth)) + ";u" + escape(d.URL) +
               ";h" + escape(d.title.substring(0, 150)) + ";" + Math.random()
         })
         (document, screen)
      },

   },
   computed: {
      isPromotionsPage() {
         if (this.$route.meta.name == 'promotions-page') {
            return true
         } else {
            return false
         }

      }
   }
}
</script>
