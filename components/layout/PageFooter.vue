<template>
   <footer class="footer">
      <a
         style="display: none"
         href="https://www.liveinternet.ru/click"
         target="_blank"
      >
         <img
            id="licntBC4A"
            width="88"
            height="31"
            style="border:0"
            title="LiveInternet: number of pageviews for 24 hours, of visitors for 24 hours and for today is shown"
            src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAEALAAAAAABAAEAAAIBTAA7"
            alt=""
         />
      </a>

      <div class="container">
         <div class="footer__content">
            <div class="footer__content-item">
               <div class="d-flex">
                  <nuxt-link
                     class="logo"
                     :to="$localePath('/')"
                     @click.native="$nuxt.$emit('logo-click')"
                  >
                     <inline-svg
                        :src="$env.NEW_YEAR_SOON ? '/img/logo-white-newyear.svg' : '/img/logo_new.svg'"
                        v-if="!btlCookie"
                     />
                  </nuxt-link>

                  <div class="call-center">
                     <inline-svg :src="'/icons/subtract.svg'"/>
                     <span>*8787</span>
                  </div>
               </div>

               <share-it class="socials_footer" type="contact" iconsColor="#697586" />
            </div>

            <div
               class="footer__content-item"
               v-for="(item, i) in $chunk(footerMenus, Math.ceil(footerMenus.length / 3))"
               :key="i"
            >
               <nuxt-link
                  class="footer__content-link"
                  v-for="menu in item"
                  :key="menu.title"
                  :to="$localePath(menu.route)"
               >
                  {{ $t(menu.title) }}
               </nuxt-link>
            </div>
         </div>
      </div>

      <div class="footer__copyright">Copyright 2023 Mashin.al Developed by AlVentures</div>
   </footer>
</template>

<script>
   import { MenusDataMixin } from '~/mixins/menus-data'

   export default {
      mixins: [MenusDataMixin],

      data() {
         return {

         }
      },

      // mounted() {
      //    (function (d, s) {
      //       d.getElementById("licntBC4A").src =
      //          "https://counter.yadro.ru/hit?t12.6;r" + escape(d.referrer) +
      //          ((typeof (s) == "undefined") ? "" : ";s" + s.width + "*" + s.height + "*" +
      //             (s.colorDepth ? s.colorDepth : s.pixelDepth)) + ";u" + escape(d.URL) +
      //          ";h" + escape(d.title.substring(0, 150)) + ";" + Math.random()
      //    })
      //    (document, screen)
      // },

      // watch: {
      //    $route(to, from) {
      //       if (this.$route.meta.name == 'promotions-page') {
      //          this.isPromotionsPage = true
      //       }
      //       (function (d, s) {
      //          d.getElementById("licntBC4A").src =
      //             "https://counter.yadro.ru/hit?t12.6;r" + escape(d.referrer) +
      //             ((typeof (s) == "undefined") ? "" : ";s" + s.width + "*" + s.height + "*" +
      //                (s.colorDepth ? s.colorDepth : s.pixelDepth)) + ";u" + escape(d.URL) +
      //             ";h" + escape(d.title.substring(0, 150)) + ";" + Math.random()
      //       })
      //       (document, screen)
      //    },
      // },

      // computed: {
      //    isPromotionsPage() {
      //       return this.$route.meta.name === 'promotions-page';
      //    }
      // }
   }
</script>

<style lang="scss" scoped>
.dark-mode{
   .footer{
      border-top: 1px solid #364152;
   }
}
</style>
