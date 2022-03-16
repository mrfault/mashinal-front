<template>
  <div class="row">
    <div class="col-12 mb-4 mb-xl-0 col-xl-6">
      <div class="garage_no-cars card">
        <div class="text-center">
          <img src="/img/car-garage.svg" alt="" />
          <p class="text-red mb-1 mb-lg-3" v-if="!hasCars">
            {{ $t('no_cars_found') }}
          </p>
          <div class="garage_no-cars__buttons">
            <add-car class="mb-2 mb-xl-0" />
            <button
              class="btn__asan-login"
              @click="redirectToAsanLogin()"
              :class="{ 'full-width mb-3': false }"
              v-if="!hasAsanLogin"
            >
              <div class="btn__asan-login--image">
                <img src="img/asan-login.svg" alt="" />
              </div>
              <p class="btn__asan-login--text">{{ $t('add_with') }}</p>
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="col-12 col-md-12 col-xl-6 h-100 mb-5 mb-lg-0">
      <!-- <div class="card height-100" v-if="!vehicleList.ownVehicles"> -->
      <div class="card height-100" v-if="false">
        <h2 class="title-with-line">
          <span>{{ $t('empty_garage_title') }}</span>
        </h2>
        <p class="mb-2">{{ $t('empty_garage_part_1') }}</p>
        <p class="mb-2">{{ $t('empty_garage_part_2') }}</p>
        <p class="mb-2">{{ $t('empty_garage_part_3') }}</p>
      </div>
      <!-- <div class="garage__asan-cars" v-if="vehicleList.ownVehicles && vehicleList.ownVehicles.length"> -->
      <div class="garage__asan-cars" v-if="true">
        <div class="row mt-5 mt-lg-0">
          <!-- <div
            class="col-12 col-lg-6 col-xl-4"
            v-for="(item, index) in vehicleList.ownVehicles"
            :key="index"
          > -->
          <div
            class="col-12 col-lg-6 col-xl-4"
            v-for="(item, index) in demo"
            :key="index"
          >
            <div class="asan-card">
              <div class="asan-card__top">
                <div class="asan-card__top--image">
                  <img
                    src="img/asan-car.svg"
                    alt="https://media.istockphoto.com/photos/generic-modern-suv-car-in-concrete-garage-picture-id1307086567?s=612x612"
                  />
                </div>
              </div>
              <div class="asan-card__bottom">
                <p class="asan-card__bottom--number">
                  {{ item.vehicleNumber }}
                  
                </p>
                <form-checkbox
                  class="d-contents"
                  transparent
                  v-model="selectedVehicles"
                ></form-checkbox>
              </div>
            </div>
          </div>
          <div class="col-12">
            <div class="asan-card__summary">
              <div class="asan-card__summary--info">
                <p>{{ $t('total') }}</p>
                <h4>8 ₼ {{ $t('must_pay') }}</h4>
              </div>
              <button class="asan-card__summary--button btn btn--green px-3">
                {{ $t('pay') }}
              </button>
            </div>
          </div>
        </div>
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
import AsanLoginButton from '~/components/buttons/AsanLogin'

export default {
  components: {
    AsanLoginButton,
    AddCar,
    AnimatedSpinner,
  },
  mixins: [Asan_login],
  data() {
    return {
      hasCars: true,
      hasAsanLogin: false,
      vehicleList: [],
      selectedVehicles: [],
      cars: [
        {
          selected: true,
        },
      ],
      demo: [
        {
          name: 'MƏMMƏD',
          surname: 'QURBANOV',
          fatherName: 'BƏHRAM OĞLU',
          vehicleNumber: '90GX601',
        },
        {
          name: 'MƏMMƏD',
          surname: 'QURBANOV',
          fatherName: 'BƏHRAM OĞLU',
          vehicleNumber: '90GX602',
        },
        {
          name: 'MƏMMƏD',
          surname: 'QURBANOV',
          fatherName: 'BƏHRAM OĞLU',
          vehicleNumber: '90GX603',
        },
        {
          name: 'MƏMMƏD',
          surname: 'QURBANOV',
          fatherName: 'BƏHRAM OĞLU',
          vehicleNumber: '90GX604',
        },
        {
          name: 'MƏMMƏD',
          surname: 'QURBANOV',
          fatherName: 'BƏHRAM OĞLU',
          vehicleNumber: '90GX605',
        },
        {
          name: 'MƏMMƏD',
          surname: 'QURBANOV',
          fatherName: 'BƏHRAM OĞLU',
          vehicleNumber: '90GX606',
        },
      ],
    }
  },

  methods: {
    async redirectToAsanLogin() {
      if (!this.$auth.loggedIn)
        return await this.$router.push(this.$localePath('/login?param=garage'))
      await this.asanLogin('garage')
      const data = await this.$axios.$get('/attorney/get_vehicle_list/false')
      this.vehicleList = data
      console.log('1', data)
    },
  },
  async mounted() {
    if (await this.checkTokenOnly()) {
      this.hasAsanLogin = true
    } else {
      this.hasAsanLogin = false
    }
  },
  mounted() {
    if (this.hasAsanLogin) {
      let data = this.$axios.$get('/attorney/get_vehicle_list/false')
      console.log('123', data)
    }
  },
}
</script>
