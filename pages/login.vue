<template>
  <div class="pages-login">
    <div class="container">
      <div class="card no-pd">
        <div class="row">
          <div class="tab-info col-12 col-md-6">
            <h1 v-html="$t(tab)"></h1>
            <p>{{ $t(tab+'_info') }}</p>
            <img :src="`/img/${tab}-car.png`" alt="" />
          </div>
          <div class="tab-form col-12 col-md-6">
            <login-tabs 
              @login="handleAfterLogin" 
              @updateTab="tab = $event" 
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
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
      tab: 'sign-in',
    }
  },
  methods: {
    handleAfterLogin() {
      this.$store.dispatch('resetSellTokens');
      let path = this.user.autosalon ? 'profile-dashboard' : '/';
      if (this.$route.query.ref) path = this.$route.query.ref;
      this.$router.push(this.$localePath(path));
    }
  }
}
</script>