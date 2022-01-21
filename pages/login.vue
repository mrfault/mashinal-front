<template>
  <div class="pages-login">
    <div class="container">
      <breadcrumbs :crumbs="crumbs" />
      <div class="login-card card no-pd">
        <div class="row no-gutters">
          <div class="col-12 col-lg-6">
            <div class="tab-info">
              <h1 style="font-size: 40px;" v-html="$t('sign-in')"></h1>
              <h2 style="font-weight: normal;">{{ $t('sign-in_info') }}</h2>

              <img src="/img/sign-up-car.png" alt=""  />

              <div class="tab-bg"></div>
            </div>
          </div>
          <div class="col-12 col-lg-6">
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

export default {
  name: 'pages-login',
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
      let path = '/garage';
      if (this.loggedIn && this.user.user_type === 3) path = '/profile/btl';
      else if (this.$route.query.ref) path = this.$route.query.ref;
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
