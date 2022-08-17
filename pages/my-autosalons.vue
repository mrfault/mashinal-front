<template>
  <div class="container">
    <div class="row">
      <div class="col-3" @click="loginToSubAccount(child.id)" v-if="child.autosalon" v-for="child in user.children">
        <salon-login-card :salon="child.autosalon" />
      </div>
    </div>
  </div>
</template>

<script>
import SalonLoginCard from '~/components/salons/SalonLoginCard'

export default {
  components: {
    SalonLoginCard
  },
  middleware({redirect, $auth}) {
    if (!$auth.user.children.length) {
      return redirect('/garage-services')
    }
  },
  head() {
    return this.$headMeta({
      title: this.$t('autosalon'),
      description: this.$t('autosalon')
    });
  },
  methods: {
    loginToSubAccount(user_id) {
      this.$axios
        .$post('/login_sub_account', {
          sub_account_id: user_id
        })
        .then(async (data) => {
          this.$auth.setUser(data.user.original)
          await this.$auth.setUserToken(data.meta.token)

          this.$nuxt.$emit('login', true)

          this.$nuxt.$emit('closeModal')
          this.$router.push('/garage-services')
        })
        .catch((err) => {})
    }
  },
  nuxtI18n: {
    paths: {
      az: '/autosalonlarim'
    }
  },
}
</script>

<style scoped>

</style>
