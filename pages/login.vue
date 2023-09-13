<template>
   <div class="pages-login">
      <div class="container">

         <breadcrumbs :crumbs="crumbs"/>

         <div v-if="false"  class="login-card card no-pd mb-5">
            <div class="row no-gutters scrolling-box">
               <div v-if="isMobileBreakpoint" class="col-12 col-lg-6 col-xl-4">
                  <div class="tab-form">
                     <login-tabs :skip-sign-in="true" @update-tab="tab = $event"/>
                  </div>
               </div>

               <div v-if="!isMobileBreakpoint" class="col-12 col-lg-6 col-xl-4">
                  <div class="tab-form">
                     <login-tabs :skip-sign-in="true" @update-tab="tab = $event"/>
                  </div>
               </div>

               <div class="col-12 col-lg-6 col-xl-8">
                  <div class="login-image">
                     <h1>{{ $t('register_question1') }}</h1>
                     <p>{{ $t('register_question2') }}</p>
                     <img
                        v-show="isDarkMode"
                        :src="`/login_image_${
                  isMobileBreakpoint ? 'mobile_' : ''
                }${locale}_dark.svg`"
                        alt=""
                        style="width: 100%;"
                     />
                     <img
                        v-show="!isDarkMode"
                        :src="`/login_image_${
                  isMobileBreakpoint ? 'mobile_' : ''
                }${locale}.svg`"
                        alt=""
                        style="width: 100%;"
                     />
                  </div>
               </div>
            </div>
         </div>

         <div class="ma-login-tab" v-if="!isMobileBreakpoint">
            <div class="ma-login-tab--form">
               <h2 class="ma-title--md"> {{ $t('sign_in_to_account') }} </h2>
               <login-tabs :skip-sign-in="true" @update-tab="tab = $event"/>
            </div>
            <div class="ma-login-tab--image" v-if="settingsV2?.media?.login_image">
<!--               <img alt="" src="/images/login-image.png">-->
               <img alt="" :src="settingsV2.media?.login_image">
            </div>
         </div>

         <div class="ma-login-tab--mobile">
            <div v-if="isMobileBreakpoint" class="col-12 col-lg-6 col-xl-4">
               <div class="tab-form">
                  <login-tabs :skip-sign-in="true" @update-tab="tab = $event"/>
               </div>
            </div>
         </div>
      </div>
   </div>
</template>

<script>
import {mapActions, mapGetters} from 'vuex'
import MobileNav from '~/components/layout/MobileNav'

export default {
   name: 'pages-login',
   components: {MobileNav},
   middleware: 'guest',
   nuxtI18n: {
      paths: {
         az: '/daxil-ol',
      },
   },
   head() {
      return this.$headMeta({
         title: this.$t('meta-title_login'),
         description: this.$t('meta-descr_login'),
      })
   },
   data() {
      return {
         tab: 'sign-in',
      }
   },
   computed: {
      ...mapGetters(['settingsV2']),
      crumbs() {
         return [{name: this.$t('login_or_register')}]
      },
   },
   methods: {
      ...mapActions(['resetSellTokens']),

      handleLogin(auth) {
         if (!auth) return
         this.resetSellTokens()
         let path = '/profile/announcements'
         if (this.$route.query.param) path += '?' + this.$route.query.param
         if (this.loggedIn && [3, 4].includes(this.user.user_type))
            path = '/profile/btl'
         else if (this.$route.query.ref) path = this.$route.query.ref
         if (this.user.children.length) path = 'my-autosalons'
         this.$router.push(this.$localePath(path))
      },
      async getSettings() {
         await this.$store.dispatch('getSettingsV2')
      }
   },
   created() {
      this.$nuxt.$on('login', this.handleLogin);

   },
   mounted(){
      this.getSettings()
   },
   beforeDestroy() {
      this.$nuxt.$off('login', this.handleLogin)
   },
}
</script>
<style lang="scss">
.login-image {
   background: linear-gradient(69.9deg, #081a3e 0%, #246eb2 100%);
   padding: 37px 50px;

   p {
      font-size: 16px;
      color: white;
   }

   h1 {
      font-size: 26px;
      color: white;
   }
}

.scrolling-box {
   scroll-behavior: smooth !important;
}
</style>
