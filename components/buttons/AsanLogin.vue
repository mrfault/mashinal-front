<template>
  <button
    class="btn__asan-login"
    @click="redirectToAsanLogin()"
    :class="{ 'full-width mb-3': fullWidth }"
  >
    <div class="btn__asan-login--image">
      <img src="img/asan-login.svg" alt="">
    </div>
    <p class="btn__asan-login--text">{{ $t('add_with') }}</p>
  </button>
</template>

<script>
import Asan_login from '~/mixins/asan_login'
// import AnimatedSpinner from '~/components/elements/AnimatedSpinner'
export default {
  mixins: [Asan_login],
  props: {
    fullWidth: Boolean,
  },
  computed: {},
  methods: {
    async redirectToAsanLogin() {
      if (!this.$auth.loggedIn)
        return await this.$router.push(this.$localePath('/login?param=garage'))
      await this.asanLogin('garage')
      const data = await this.$axios.$get('/attorney/get_vehicle_list/false')
    },
  },
}
</script>
