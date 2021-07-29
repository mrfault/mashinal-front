<template>
  <div class="pages-profile-dashboard pt-2 pt-lg-5">
    <div class="container">
      <breadcrumbs :crumbs="crumbs" />
    </div>
  </div>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex';

  export default {
    name: 'pages-profile-dashboard',
    middleware: ['auth_general','auth_autosalon'],
    nuxtI18n: {
      paths: {
        az: '/profil/idareetme-paneli'
      }
    },
    head() {
      return this.$headMeta({
        title: this.$t('dashboard')
      });
    },
    async asyncData({store}) {
      
    },
    computed: {
      ...mapGetters([]),

      crumbs() {
        return [
          { name: this.$t('dashboard') }
        ]
      }
    },
    methods: {
      ...mapActions([]),
     
    }
  }
</script>