<template>
  <p class="mt-2 info-text"><icon name="alert-circle" /> 
    <span class="text-medium cursor-pointer text-red" @click="show">{{ $t('pay_with_terminal') }}</span>
  </p>
</template>

<script>
export default {
  props: {
    popupName: {
      type: String,
      default: 'payment-popup'
    }
  },
  methods: {
    show() {
      this.$nuxt.$emit('show-terminal-info', this.popupName);
    }
  }
}
</script>