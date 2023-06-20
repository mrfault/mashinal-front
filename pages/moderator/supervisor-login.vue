<template>
  <div v-show="false">
    <h1>Salam</h1>
    <div>
      <div style="text-align: center">
        <br><br>
        <h2>{{ $t('not_have_panding_cars') }}</h2>
        <a href="https://admin.mashin.al/alvcp/resources/announce-moderators">
          <button class="section-post__btn add_announce">{{ $t('back_to_moderator_page') }}</button>
        </a>
        <br><br>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  layout: 'ticket',
  async mounted() {
    this.$nuxt.$emit('loading_status', true);
    await this.$auth.setUserToken(`Bearer ${this.$route.query.token}`);
    const admin_user = await this.$axios.$get('/user');
    if (!admin_user.user.is_admin) return false;
    if (admin_user.user.admin_group == 1) {
      this.$router.push('/moderator/ticket/car?token=643480%7CA2dfm32FCaCtZyOmBc1sJ03sW7d9pbW63NvV71tw');
      this.$nuxt.$emit('loading_status', false);
    }else{
      this.$router.push('/e-services');
    }


  },
}
</script>

