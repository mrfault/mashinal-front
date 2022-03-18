<template>
  <button
    class="btn__asan-login"
    @click="$emit('click')"
    :class="{ 'full-width mb-3': fullWidth, pending: pending }"
  >
    <div class="btn__asan-login--image">
      <img src="img/asan-login.svg" alt="" />
    </div>
    <p class="btn__asan-login--text">{{ $t('add_with') }}</p>
  </button>
</template>

<script>
import Asan_login from '~/mixins/asan_login'
import AnimatedSpinner from '~/components/elements/AnimatedSpinner'
export default {
  mixins: [Asan_login],
  components: {
    AnimatedSpinner,
  },
  props: {
    fullWidth: Boolean,
    redirectPath: {
      type: String,
      default: 'garage-services',
    },
    pending: Boolean,
    fromGarageNav: Boolean,
  },
    // computed: {
    //   hasAsanLogin(){
    //     return true;
    //   }
    // },
  methods: {
    async redirectToAsanLogin() {
      return;
      if (this.fromGarageNav) {
        this.$emit('closeAddCarPopup', true)
      }
      if (!this.$auth.loggedIn) {
        return await this.$router.push(
          this.$localePath(`/login?param=${this.redirectPath}`),
        )
      } else {
        // if (!hasAsanLogin) {

          await this.asanLogin(`${this.redirectPath}`)
          const data = await this.$axios.$get(
            '/attorney/get_vehicle_list/false',
          )
          this.vehicleList = data
        // }else{
          // this.$router.push(this.$localePath('/garage/asan-cars'))
        // }
      }
    },
  },
}
</script>
