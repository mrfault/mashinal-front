<template>
  <div class="pages-profile-btl pt-5">
    <div class="container">
      <breadcrumbs :crumbs="crumbs" />
      <div class="card with-margins">
        <button class="btn btn--green" @click="setBtlCookie">{{ $auth.user.user_type === 3 ? $t('start_to_work') : $t('create_salon') }}</button>
      </div>
    </div>
  </div>
</template>

<script>
  import { UserDataMixin } from '~/mixins/user-data';

  export default {
    name: 'pages-profile-btl',
    mixins: [UserDataMixin],
    middleware: ['auth_general'],
    nuxtI18n: {
      paths: {
        az: '/profil/btl'
      }
    },
    head() {
      return this.$headMeta({
        title: 'BTL'
      });
    },
    async asyncData({ $auth }) {
      await $auth.fetchUser();
    },
    computed: {
      crumbs() {
        return [
          { name: 'BTL' }
        ]
      }
    },
    methods: {
      async setBtlCookie() {
        const data = await this.$axios.$get('/btl_token');
        this.$cookies.set('btl', this.user.id, { maxAge: 60 * 60 * 12, path: '/' });
        this.$cookies.set('btl_token',data.data.token,{ maxAge: 60 * 60 * 12, path: '/' });
        await this.logout();
      }
    }
  }
</script>
