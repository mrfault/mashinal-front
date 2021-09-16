<template>
  <div class="pages-profile-btl pt-5">
    <div class="container">
      <breadcrumbs :crumbs="crumbs" />
      <div class="card with-margins">
        <button class="btn btn--green" @click="setBtlCookie">{{ $t('start_to_work') }}</button>
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
        this.$cookies.set('btl', this.user.id, { maxAge: 60 * 60 * 12, path: '/' });
        await this.logout();
      }
    }
  }
</script>