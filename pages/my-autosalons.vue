<template>
  <div class="container">
    <div class="row">
      <div class="col-12 col-lg-3 my-3" @click="loginToSubAccount(child.id, child.part_salon)"  v-for="child in user.children">
        <salon-login-card v-if="child.autosalon" :count="auto_count(child)" :salon="child.autosalon" :shop="false" />
        <salon-login-card v-if="child.part_salon" :count="child.parts_count" :salon="child.part_salon" :shop="true" />
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
    auto_count(user) {
     return user.announcements_count + user.moto_atvs_count + user.motorcycles_count + user.scooters_count;
    },
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
