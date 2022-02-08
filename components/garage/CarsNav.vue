<template>
  <div class="garage_cars-nav mb-2 mb-lg-4">
    <div class="row">
      <div class="col-6 col-lg-auto">
        <button
          :class="['btn btn--pale-red-outline', {'active': tab === 'info', 'full-width': isMobileBreakpoint}]"
          @click="$emit('change-tab', 'info')"
          v-html="$t('about')"
        />
      </div>
      <div class="col-6 col-lg-auto">
        <button
          :class="['btn btn--pale-red-outline', {'active': tab === 'fines', 'full-width': isMobileBreakpoint}]"
          @click="$emit('change-tab', 'fines')"
          v-html="$t('fines')"
        />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    tab: String
  }
}
</script>
