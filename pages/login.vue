<template>
  <div class="pages-login">
    <div class="container">
      <breadcrumbs :crumbs="crumbs" />
      <div class="login-card card no-pd mb-5">
        <div class="row no-gutters">
          <div class="col-12 col-lg-6 col-xl-8">
            <div class="login-image">
              <h1>{{ $t('register_question1') }}</h1>
              <p>{{ $t('register_question2') }}</p>
              <img v-show="isDarkMode" style="width: 100%;" :src="`/login_image_${isMobileBreakpoint ? 'mobile_':''}${locale}_dark.svg`" alt=""  />
              <img v-show="!isDarkMode" style="width: 100%;" :src="`/login_image_${isMobileBreakpoint ? 'mobile_':''}${locale}.svg`" alt=""  />
            </div>

          </div>
          <div class="col-12 col-lg-6 col-xl-4" style="padding: 50px;">
            <div class="tab-form">
              <login-tabs @update-tab="tab = $event" :skip-sign-in="true" />
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import MobileNav from "~/components/layout/MobileNav";

export default {
  name: 'pages-login',
  components: {MobileNav},
  middleware: 'guest',
  nuxtI18n: {
    paths: {
      az: '/daxil-ol'
    }
  },
  head() {
    return this.$headMeta({
      title: this.$t('meta-title_login'),
      description: this.$t('meta-descr_login')
    });
  },
  data() {
    return {
      tab: 'sign-in'
    }
  },
  computed: {
    crumbs() {
      return [
        { name: this.$t('login_or_register') }
      ]
    }
  },
  methods: {
    ...mapActions(['resetSellTokens']),

    handleLogin(auth) {
      if (!auth) return;
      this.resetSellTokens();
      let path = '/garage-services';
      if(this.$route.query.param) path+='?'+this.$route.query.param;
      if (this.loggedIn && [3,4].includes(this.user.user_type)) path = '/profile/btl';
      else if (this.$route.query.ref) path = this.$route.query.ref;
      if(this.user.children.length) path = 'my-autosalons'
      this.$router.push(this.$localePath(path));
    }
  },
  created() {
    this.$nuxt.$on('login', this.handleLogin);
  },
  beforeDestroy() {
    this.$nuxt.$off('login', this.handleLogin);
  }
}
</script>
<style lang="scss">

.login-image {
  background: linear-gradient(69.9deg, #081A3E 0%, #246EB2 100%);
  padding:37px 50px;

  p {
    font-size: 16px;
    color:white;
  }
  h1 {
    font-size: 26px;
    color: white;
  }
}

</style>
