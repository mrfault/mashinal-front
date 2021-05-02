<template>
  <div class="pages-login">
    <div class="container">
      <breadcrumbs :crumbs="crumbs" />
      <div class="login-card card no-pd">
        <div class="row no-gutters">
          <div class="col-12 col-lg-6">
            <div class="tab-info">
              <h1 v-html="$t(tab)"></h1>
              <p>{{ $t(tab+'_info') }}</p>
              <transition-group name="translate-fade">
                <template v-for="type in ['sign-in','sign-up']">
                  <img :src="`/img/${type}-car.png`" alt="" v-show="tab === type" :key="type" />
                </template>
              </transition-group>
              <div class="tab-bg"></div>
            </div>
          </div>
          <div class="col-12 col-lg-6">
            <div class="tab-form">
              <login-tabs @updateTab="tab = $event" />
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
      let path = this.loggedIn && this.user.autosalon ? '/profile/dashboard' : '/';
      if (this.$route.query.ref) path = this.$route.query.ref;
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