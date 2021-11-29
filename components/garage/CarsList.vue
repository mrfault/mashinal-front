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
    <div class="col-12" v-show="carChosen && isMobileBreakpoint" v-if="activeCar">
      <div class="garage_go-back card with-margins mb-2 mb-lg-0">
        <div class="d-flex align-items-center justify-content-between">
          <icon name="chevron-left" @click.native.stop="showCarsList" class="cursor-pointer" />
          <span>{{ activeCarNumber }}</span>
        </div>
      </div>
    </div>
    <div class="col-12 col-lg-1-5" v-show="!carChosen || !isMobileBreakpoint">
      <div class="garage_cars-list mb-2 mb-lg-0">
        <div class="row">
          <div class="col-6 col-lg-12" v-for="car in cars.data" :key="car.id">
            <car-item :car="car" @set-active="updateActiveCar" :active="activeCarId === car.id" />
          </div>
          <div class="col-6 col-lg-12" v-if="isMobileBreakpoint">
            <add-car tag="div" />
          </div>
        </div>
      </div>
    </div>
    <div class="col-12 col-lg-4-5">
      <div class="card with-margins" v-if="activeCar" v-show="carChosen || !isMobileBreakpoint">
        <cars-nav :tab="tab" @change-tab="tab = $event" />
        <car-info :car="activeCar" v-show="tab === 'info'" :key="'info_' + activeCar.id" />
        <car-protocols :car="activeCar" v-show="tab === 'fines'" :key="'fines_' + activeCar.id" v-if="activeCar.car_id"/>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

import AddCar from '~/components/garage/AddCar';
import CarItem from '~/components/garage/CarItem';
import CarsNav from '~/components/garage/CarsNav';
import CarInfo from '~/components/garage/CarInfo';
import CarProtocols from '~/components/garage/CarProtocols';

export default {
  components: {
    AddCar,
    CarItem,
    CarsNav,
    CarInfo,
    CarProtocols
  },
  data() {
    let activeCars = this.$store.state.garage.cars.data?.filter(car => car.status === 1 && car.sync_status === 1);
    return {
      tab: 'info',
      activeCarId: activeCars[0]?.id || '',
      showNoActiveCarsAlert: true,
      carChosen: false
    }
  },
  computed: {
    ...mapGetters({
      cars: 'garage/cars'
    }),

    activeCars() {
      return this.cars.data?.filter(car => car.status === 1 && car.status === 1) || [];
    },
    activeCar() {
      return this.activeCars.find(car => car.id === this.activeCarId) || this.activeCars?.[0];
    },
    activeCarNumber() {
      return this.activeCar?.car_number.replace(/([A-Z]{1,2})/, ' $1 ');
    }
  },
  methods: {
    updateActiveCar(id) {
      this.activeCarId = id;
      this.carChosen = true;
      this.$emit('show-nav', false);
    },
    showCarsList() {
      this.carChosen = false;
      this.$emit('show-nav', true);
    }
  },
  watch: {
    'activeCars.length'() {
      this.activeCarId = this.activeCar?.id || '';
    }
  }
}
</script>