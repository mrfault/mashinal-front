<template>
  <div class="container">
    <div class="row">
      <div class="col-12 col-lg-3 my-3" @click="loginToSubAccount(child.id, child.autosalon || child.part_salon)"  v-for="child in user.children">
        <salon-login-card v-if="child.autosalon" :count="child.announcements_count" :salon="child.autosalon" />
        <salon-login-card v-if="child.part_salon" :count="child.announcements_count" :salon="child.part_salon" :shop="true" />
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
    loginToSubAccount(user_id,shop) {
      this.$axios
        .$post('/login_sub_account', {
          sub_account_id: user_id
        })
        .then(async (data) => {
          this.$auth.setUser(data.user.original)
          await this.$auth.setUserToken(data.meta.token)

          this.$nuxt.$emit('login', true)

          this.$nuxt.$emit('closeModal')
          if(shop) await this.$router.push('/dashboard/2')
          else await this.$router.push('/dashboard/1')
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
