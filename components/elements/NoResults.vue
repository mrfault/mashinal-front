<template>
  <div class="no-results">
    <img src="/img/car.svg" alt="" />
    <span>{{ text || $t('no_results_found') }}</span>
    <slot />
  </div>
</template>

<script>
export default {
  props: {
    text: String
  }
}
</script>