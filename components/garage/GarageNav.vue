<template>
  <div class="garage_nav card with-margins mb-2 mb-lg-3">
    <div class="row">
      <div class="col-6 col-lg-auto" style="margin-bottom: 10px;">
        <button
          :class="['btn btn--pale-red-outline', {'active': tab === 'cars', 'full-width': isMobileBreakpoint}]"
          @click="$emit('change-tab', 'cars')"
          v-html="$t('my_cars')"
        />
      </div>
      <div class="col-6 col-lg-auto">
        <button
          :class="['btn btn--pale-red-outline', {'active': tab === 'check-points', 'full-width': isMobileBreakpoint}]"
          @click="$emit('change-tab', 'check-points')"
          v-html="$t('check_points')"
        />
      </div>
      <div class="col-6 col-lg-auto">
        <button
          :class="['btn btn--pale-red-outline', {'active': tab === 'attorney-list', 'full-width': isMobileBreakpoint}]"
          @click="$emit('change-tab', 'attorney-list')"
          v-html="$t('attorneys')"
          v-if="false"
        />
      </div>
      <div class="col-auto ml-auto" v-if="!isMobileBreakpoint">
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
