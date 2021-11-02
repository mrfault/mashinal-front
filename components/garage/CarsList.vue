<template>
  <div class="row">
    <div class="col-12 col-lg-1-5">
      <div class="garage_cars-list">
        <car-item 
          v-for="car in cars.data"
          :key="car.id"
          :car="car"
        />
      </div>
    </div>
    <div class="col-12 col-lg-5-5">
      
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

import CarItem from '~/components/garage/CarItem';

export default {
  components: {
    CarItem
  },
  computed: {
    ...mapGetters({
      cars: 'garage/cars'
    })
  }
}
</script>