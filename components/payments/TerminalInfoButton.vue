<template>
   <p class="info-text text-left cursor-pointer" @click="show">
<!--      <inline-svg src="/icons/alert-circle.svg"/>-->
      <span class="text-medium cursor-pointer text-red">{{ $t('pay_with_terminal') }}</span>
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
