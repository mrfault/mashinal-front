<template>
  <div class="garage_nav-card card with-margins mb-2 mb-lg-3">
    <div class="row">
      <div class="col-auto">
        <button 
          :class="['btn btn--pale-red-outline', {'active': tab === 'cars'}]" 
          @click="$emit('change-tab', 'cars')"
          v-html="$t('my_cars')"
        />
      </div>
      <div class="col-auto">
        <button 
          :class="['btn btn--pale-red-outline', {'active': tab === 'check-points'}]" 
          @click="$emit('change-tab', 'check-points')"
          v-html="$t('check_points')"
        />
      </div>
      <div class="col-auto ml-auto">
        <add-car />
      </div>
    </div>
  </div>
</template>

<script>
import AddCar from '~/components/garage/AddCar';

export default {
  props: {
    tab: String
  },
  components: {
    AddCar
  }
}
</script>