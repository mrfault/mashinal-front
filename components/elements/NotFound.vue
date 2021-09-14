<template>
  <div class="not-found">
    <img :src="`/img/404${isDarkMode ? '-dark-mode' : ''}.svg`" :alt="text || $t('no_results_found')" />
    <h1>{{ text || $t('no_results_found') }}</h1>
    <slot />
  </div>
</template>

<script>
export default {
  props: {
    text: String,
    required: false
  }
}
</script>