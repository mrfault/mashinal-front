<template>
  <div class="row">
    <div class="col-lg-6 mb-2 mb-lg-0">
      <nuxt-link class="d-block" :to="$localePath('/business-profile?scrollto=packages&type=' + (reverse ? 2 : 1))">
        <img class="round-4 full-width" :src="`/img/create-${reverse ? 'shop' : 'salon'}-${type}-${locale}.jpg`" alt="" />
      </nuxt-link>
    </div>
    <div class="col-lg-6">
      <nuxt-link class="d-block" :to="$localePath('/business-profile?type=' + (reverse ? 1 : 2))">
        <img class="round-4 full-width" :src="`/img/create-${reverse ? 'salon' : 'shop'}-${type}-${locale}.jpg`" alt="" />
      </nuxt-link>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    type: {
      type: String,
      default: '1'
    },
    reverse: Boolean
  }
}
</script>
