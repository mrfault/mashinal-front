<template>
  <div class="row">
    <div class="col-12 col-md-12 col-lg-6">
      <div class="garage_no-cars card">
        <div class="text-center">
          <img src="/img/car-garage.svg" alt="" />
          <p class="text-red mb-1 mb-lg-3">{{ $t('no_cars_found') }}</p>
          <div class="garage_no-cars__buttons">
            <add-car class="mb-2 mb-xl-0" />
            <button class="btn__asan-login" @click="redirectToAsanLogin()" v-if="false">
              <div class="btn__asan-login--image">
                <img
                  src="img/asan-login.svg"
                  alt="https://asanlogin.my.gov.az/assets/images/CDSSO_LOGO.svg"
                />
              </div>
              <p class="btn__asan-login--text">{{ $t('add_with') }}</p>
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="col-12 col-md-12 col-lg-6 h-100 mb-5 mb-lg-0">
      <div class="card height-100">
        <h2 class="title-with-line">
          <span>{{ $t('empty_garage_title') }}</span>
        </h2>
        <p class="mb-2">{{ $t('empty_garage_part_1') }}</p>
        <p class="mb-2">{{ $t('empty_garage_part_2') }}</p>
        <p class="mb-2">{{ $t('empty_garage_part_3') }}</p>
      </div>
    </div>
    <modal-popup
      :toggle="showRedirect"
      :title="$t('add_car')"
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
  </div>
</template>

<script>
import AddCar from '~/components/garage/AddCar'
import Asan_login from '~/mixins/asan_login'
import AnimatedSpinner from '~/components/elements/AnimatedSpinner'
// import AsanLogin from '~/components/buttons/AsanLogin'

export default {
  components: {
    // AsanLogin,
    AddCar,
    AnimatedSpinner,
  },
  mixins: [Asan_login],
  methods: {
    async redirectToAsanLogin() {
      // await this.asanLogin()
      // this.$router.push($localePath(garage))
    },
  },
}
</script>
