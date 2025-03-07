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

        <div :class="{row : !isMobileBreakpoint }" v-if="filteredCars.data.length">
          <client-only>
           <component :is="isMobileBreakpoint ? 'div' : 'vue-scroll'"
                     :class="{row : isMobileBreakpoint }"
                      ref="vs"
                      :key="vsKey"
                      :style="!isMobileBreakpoint ? 'width: 100%;' : ''"
                     :ops="scrollOps"
          >
            <div
              class="col-6 col-lg-12 lg-xl-6 mb-2 mt-1"
              :class="{'mr-2':!isMobileBreakpoint }"
              v-for="(car, index) in filteredCars.data"
              :key="car.id"
            >
              <car-item
                style="margin-right: 10px;"
                :id="`car_${car.id}`"
                :car="car"
                :numerate="index+1"
                @set-active="updateActiveCar"
                :active="activeCarId === car.id"
              />
            </div>
          </component>
          </client-only>
          <div class="col-6 col-lg-12" v-if="isMobileBreakpoint">
            <add-car :has-asan-login="hasAsanLogin" tag="div" />
          </div>
        </div>
      </div>
    </div>
    <div class="col-12 col-lg-4-5">
      <div
        class="card with-margins"
        v-if="activeCar && !history && showInfo"
        v-show="carChosen || !isMobileBreakpoint"
      >
        <p class="p-title">{{ $t('about') }}</p>
        <car-info @refresh-data="refreshData" :car="activeCar" :key="'info_' + activeCar.id" />
      </div>

      <div
        class="card with-margins"
        :class="{'mt-4':!history }"
        v-if="activeCar && showInfo"
        v-show="carChosen || !isMobileBreakpoint"
      >
        <p class="p-title">{{ $t('fines') }}</p>
        <car-protocols
          :history="history ? 1 : 0"
          :car="activeCar"
          :key="'fines_' + activeCar.id"
          v-if="activeCar.car_id && showInfo"
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
  props: {
    filter_car_number:{},
    history: {
      type: Boolean,
      default: false,
    }
  },
  data() {
    let activeCars = this.$store.state.garage.cars.data?.filter(
      (car) => car.status === 1 && car.sync_status === 1,
    )
    return {
      showInfo: true,
      hasAsanLogin: false,
      tab: 'info',
      vsKey: 0,
      activeCarId: Number(this.$route.query.id) || activeCars[0]?.id || '',
      showNoActiveCarsAlert: true,
      carChosen: false,
    }
  },
  computed: {
    scrollOps() {
      return {
        scrollPanel: {
          maxHeight: 400,
        },
      }
    },
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
    if(this.$route.query.id) {
      //this.updateActiveCar(Number(this.$route.query.id))
    }
    setTimeout(() => this.vsKey++ , 1);

    this.$nuxt.$on('select-car', () => {
      let activeFilteredCars = this.filteredCars.data.filter((item) => item.status === 1)
      if(activeFilteredCars.length) {
        this.updateActiveCar(activeFilteredCars[0].id)
      }
    })
  },
  beforeDestroy() {
    this.$nuxt.$off('select-car')
  },
  methods: {
    refreshData() {
      //this.$store.dispatch('garage/getCarList',{})
    },
    updateActiveCar(id) {
      this.activeCarId = id
      this.showInfo = true;
      this.carChosen = true
      this.$emit('show-nav', false)
      this.$router.push({
        query: { id }
      })
      //this.$scrollTo('.container')
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
    'filteredCars.data.length'(length) {
      this.showInfo = length > 0
    }
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
