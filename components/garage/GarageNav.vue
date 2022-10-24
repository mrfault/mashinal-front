<template>
  <div class="garage_nav card with-margins mb-2 mb-lg-3">
    <div class="row">
      <div class="col-6 col-lg-auto" style="margin-bottom: 10px;display: flex;gap: 20px;">
        <div>
          <button
            :class="['btn btn--pale-red-outline', {'active': tab === 'cars', 'full-width': isMobileBreakpoint}]"
            @click="$emit('change-tab', 'cars')"
            v-html="$t('my_cars')+ ` (${cars.data.length})`"
          />
        </div>


        <button
          :class="['btn btn--pale-red-outline', {'active': tab === 'penalty_history', 'full-width': isMobileBreakpoint}]"
          @click="$emit('change-tab', 'penalty_history')"
          v-html="$t('penalty_history')"
        />
        <form-text-input input-class="car-number-show-popover"
                         icon-name="search"
                         :placeholder="$t('car_number')"
                         v-model="car_number"
                         v-if="!isMobileBreakpoint"
                         @input="$emit('filterCarNumber', getValue)"
                         @change="$emit('filterCarNumber', getValue)"
        />
      </div>
      <form-text-input input-class="car-number-show-popover"
                       icon-name="search"
                       style="margin-left: 5px;margin-right: 20px;"
                       v-if="isMobileBreakpoint"
                       :placeholder="$t('car_number')"
                       v-model="car_number"
                       @input="$emit('filterCarNumber', getValue)"
                       @change="$emit('filterCarNumber', getValue)"
      />
<!--      <div class="col-6 col-lg-auto">-->
<!--        <button-->
<!--          :class="['btn btn&#45;&#45;pale-red-outline', {'active': tab === 'check-points', 'full-width': isMobileBreakpoint}]"-->
<!--          @click="$emit('change-tab', 'check-points')"-->
<!--          v-html="$t('check_points')"-->
<!--        />-->
<!--      </div>-->

      <div class="col-auto ml-auto" v-if="!isMobileBreakpoint">
        <add-car />
      </div>
    </div>
  </div>
</template>

<script>
import AddCar from '~/components/garage/AddCar';
import {mapGetters} from "vuex";

export default {
  props: {
    tab: String
  },
  components: {
    AddCar
  },
  data() {
    return {
      car_number: '',
    }
  },
  computed: {
    ...mapGetters({cars: 'garage/cars'}),
    getValue() {
      return (this.car_number).toUpperCase().replace(/[^a-z0-9]/gi,'');
    }
  }
}
</script>
