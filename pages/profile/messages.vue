<template>
  <div class="pages-profile-messages pt-2 pt-lg-5">
    <div class="container">
      <breadcrumbs :crumbs="crumbs" />
    </div>
  </div>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex';

  import { MessagesMixin } from '~/mixins/messages';

  export default {
    name: 'pages-profile-messages',
    middleware: 'auth_general',
    mixins: [MessagesMixin],
    nuxtI18n: {
      paths: {
        az: '/profil/mesajlar'
      }
    },
    head() {
      return this.$headMeta({
        title: this.$t('messages')
      });
    },
    async asyncData({store}) {
    },
    computed: {
      ...mapGetters([]),

      crumbs() {
        return [
          { name: this.$t('messages') }
        ]
      }
    },
    methods: {
      ...mapActions([]),
     
    }
  }
</script>