<template>
  <div class="no-results">
    <img :src="`/img/${type}.svg`" alt="" />
    <span>{{ text || $t('no_results_found') }}</span>
    <slot />
  </div>
</template>

<script>
export default {
  props: {
    text: String,
    type: {
      type: String,
      required: false,
      default: 'car',
      validator(val) {
        return ['car', 'part'].includes(val)
      }
    }
  }
}
</script>
