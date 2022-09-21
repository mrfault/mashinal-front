<template>
  <div class="row">
    <transition-expand>
      <div class="col-12" v-if="!cars.data.length && showNoActiveCarsAlert">
        <div
          class="garage_no-active-cars d-flex align-items-center mb-2 mb-lg-3"
        >
          <img src="/img/speaker.svg" alt="" />
          <span class="text">{{ $t('no_active_cars') }}</span>
          <span
            class="cursor-pointer ml-auto"
            @click="showNoActiveCarsAlert = false"
          >
            <icon name="cross" />
            <!-- <inline-svg src="/icons/cross.svg" height="14"/> -->
          </span>
        </div>
      </div>
    </transition-expand>
    <div
      class="col-12"
      v-show="carChosen && isMobileBreakpoint"
      v-if="activeCar"
    >
      <div class="garage_go-back card with-margins mb-2 mb-lg-0">
        <div class="d-flex align-items-center justify-content-between">
          <icon
            name="chevron-left"
            @click.native.stop="showCarsList"
            class="cursor-pointer"
          />
          <span>{{ $readCarNumber(activeCar.car_number) }}</span>
        </div>
      </div>
    </div>
    <div class="col-12 col-lg-1-5" v-show="!carChosen || !isMobileBreakpoint">
      <div class="garage_cars-list mb-2 mb-lg-0">
        <div class="row">
          <div
            class="col-6 col-lg-12 lg-xl-6"
            v-for="car in filteredCars.data"
            :key="car.id"
          >
            <car-item
              :car="car"
              @set-active="updateActiveCar"
              :active="activeCarId === car.id"
            />
          </div>
          <div class="col-6 col-lg-12" v-if="isMobileBreakpoint">
            <add-car :has-asan-login="hasAsanLogin" tag="div" />
          </div>
        </div>
      </div>
    </div>
    <div class="col-12 col-lg-4-5">
      <div
        class="card with-margins"
        v-if="activeCar"
        v-show="carChosen || !isMobileBreakpoint"
      >
        <p class="p-title">{{ $t('about') }}</p>
        <car-info :car="activeCar" :key="'info_' + activeCar.id" />
      </div>

      <div
        class="card with-margins mt-4"
        v-if="activeCar"
        v-show="carChosen || !isMobileBreakpoint"
      >
        <p class="p-title">{{ $t('fines') }}</p>
        <car-protocols
          :car="activeCar"
          :key="'fines_' + activeCar.id"
          v-if="activeCar.car_id"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

import AddCar from '~/components/garage/AddCar'
import CarItem from '~/components/garage/CarItem'
import CarsNav from '~/components/garage/CarsNav'
import CarInfo from '~/components/garage/CarInfo'
import CarProtocols from '~/components/garage/CarProtocols'
import asan_login from '~/mixins/asan_login'

export default {
  components: {
    AddCar,
    CarItem,
    CarInfo,
    CarProtocols,
  },
  mixins:[asan_login],
  props: ['filter_car_number'],
  data() {
    let activeCars = this.$store.state.garage.cars.data?.filter(
      (car) => car.status === 1 && car.sync_status === 1,
    )
    return {
      hasAsanLogin: false,
      tab: 'info',
      activeCarId: activeCars[0]?.id || '',
      showNoActiveCarsAlert: true,
      carChosen: false,
    }
  },
  computed: {
    ...mapGetters({
      cars: 'garage/cars',
    }),
    filteredCars() {
      if(this.filter_car_number) {
        return {...this.cars, data: this.cars.data?.filter(item => item.car_number.includes(this.filter_car_number)) }
      }
      return this.cars;
    },
    activeCars() {
      return (
        this.cars.data?.filter((car) => car.status === 1 && car.status === 1) ||
        []
      )
    },
    activeCar() {
      return (
        this.activeCars.find((car) => car.id === this.activeCarId) ||
        this.activeCars?.[0]
      )
    },
  },
   async mounted() {
    if (await this.checkTokenOnly()) {
      this.hasAsanLogin = true
        this.vehicleList = this.$set(
          this,
          'vehicleList',
          await this.$axios.$get('/attorney/get_vehicle_list/false'),
        )
    } else {
      this.hasAsanLogin = false
    }
  },
  methods: {
    updateActiveCar(id) {
      this.activeCarId = id
      this.carChosen = true
      this.$emit('show-nav', false)
      this.$scrollTo('.container')
    },
    showCarsList() {
      this.carChosen = false
      this.$emit('show-nav', true)
    },
  },
  watch: {
    'activeCars.length'() {
      this.activeCarId = this.activeCar?.id || ''
    },
  },
}
</script>

<style lang="scss" scoped>
@media (min-width: 1025px) and (max-width: 1279px) {
  .lg-xl-6 {
    width: 50% !important;
    padding: 0 15px !important;
    max-width: 50%;
  }
}
</style>
