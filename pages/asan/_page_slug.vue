<template>
<div>
  <div class="btn d-flex justify-content-center p-5 m-5" :class="{ pending }">
    Asan Login yüklənir...
  </div>
</div>
</template>

<script>
import asan_login from "~/mixins/asan_login";

export default {
  data() {
    return {
      pending: true,
    }
  },
  mixins: [ asan_login ],
  async mounted() {
    this.pending = false;
    this.$router.push(this.$localePath(this.$route.params.page_slug))
  }
}
</script>

<style scoped>

</style>
