<template>
  <div class="ma-tiremeter__speedometer">
    <h6 class="ma-tiremeter-small-title">
      {{ $t('speedometer_error_percentage') }}
    </h6>
    <div class="ma-tiremeter__clearance--image">
      <img src="/tiremeter/speedometer.png" alt="" />
    </div>
    <h6 class="ma-tiremeter-small-title mt-1">
      <template v-if="percententage > 0">+</template>{{percententage}} %
    </h6>
  </div>
</template>

<script>
export default {
  props: {
    percententage: {
      type: Number,
      default: 0,
    },
  },
}
</script>

<style></style>
