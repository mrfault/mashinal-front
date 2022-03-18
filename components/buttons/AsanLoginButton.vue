<template>
  <button
    class="btn__asan-login"
    @click="redirectToAsanLogin()"
    :class="{ 'full-width mb-3': fullWidth, pending: pending }"
  >
    <div class="btn__asan-login--image">
      <img src="img/asan-login.svg" alt="" />
    </div>
    <p class="btn__asan-login--text">{{ $t('add_with') }}</p>
    <modal-popup
      :toggle="showRedirect"
      :title="$t('add_car_with_asan_login')"
      :title-logo="isDarkMode ? '/asan_logo_dark_mode.svg' : '/asan_logo.svg'"
      :overflow-hidden="isMobileBreakpoint"
      @close="showRedirect = false"
    >
      <p>{{ $t('asan_login_redirect') }}</p>
      <div
        class="align-items-center d-flex justify-content-center position-relative"
      >
        <animated-spinner />
        <span style="position: absolute;">{{ timer }}</span>
      </div>
    </modal-popup>
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
      showRedirect: Boolean,
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
