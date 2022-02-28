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
  middleware: ['guest'],
  async mounted() {
    await this.asanLogin();
    const data = await this.$axios.$post('/asan/login');
    this.$auth.setUser(data.user.original)
    this.$emit('setFinished',true)
    await this.$auth.setUserToken(data.meta.token);

    this.pending = false;
    this.$nuxt.$emit('login', true);
    this.$router.push(this.$localePath(this.$route.params.page_slug))
  }
}
</script>

<style scoped>

</style>
