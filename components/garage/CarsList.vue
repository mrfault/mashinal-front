<template>
  <div class="row">
    <transition-expand>
      <div class="col-12" v-if="!activeCars.length && showNoActiveCarsAlert">
        <div class="garage_no-active-cars d-flex align-items-center mb-2 mb-lg-3">
          <img src="/img/speaker.svg" alt="" />
          <span class="text">{{ $t('no_active_cars') }}</span>
          <span class="cursor-pointer ml-auto" @click="showNoActiveCarsAlert = false">
            <icon name="cross" />
          </span>
        </div>
      </div>
    </transition-expand>
    <div class="col-12 col-lg-1-5">
      <div class="garage_cars-list mb-2 mb-lg-0">
        <div class="row">
          <div class="col-6 col-lg-12" v-for="car in cars.data" :key="car.id">
            <car-item :car="car" @set-active="activeCarId = $event"/>
          </div>
        </div>
      </div>
    </div>
    <div class="col-12 col-lg-4-5">
      <div class="card with-margins" v-if="activeCar">
        <cars-nav :tab="tab" @change-tab="tab = $event" />
        <car-info :car="activeCar" v-if="tab === 'info'" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

import CarItem from '~/components/garage/CarItem';
import CarsNav from '~/components/garage/CarsNav';
import CarInfo from '~/components/garage/CarInfo';

export default {
  components: {
    CarItem,
    CarsNav,
    CarInfo
  },
  data() {
    let activeCars = this.$store.state.garage.cars.data?.filter(car => car.status === 1);
    return {
      tab: 'info',
      activeCarId: activeCars[0]?.id || '',
      showNoActiveCarsAlert: true
    }
  },
  computed: {
    ...mapGetters({
      cars: 'garage/cars'
    }),

    activeCars() {
      return this.cars.data?.filter(car => car.status === 1) || [];
    },
    activeCar() {
      return this.activeCars.find(car => car.id === this.activeCarId) || this.activeCars?.[0];
    }
  }
}
</script>