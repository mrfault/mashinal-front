<template>
   <div style="text-align: center">
      <br><br>
      <span v-if="!data.access">
      <h3>{{ $t(`${data.reason}`) }}</h3>
      <br><br>
     {{ timer }} : {{ $t('after_seconds_auto_reload_with') }}
    </span>
   </div>
</template>

<script>
export default {
   async asyncData({store, $axios, $auth, route}) {
      await $auth.setUserToken(`Bearer ${route.query.token}`);

      const admin_user = await $axios.$get('/user');

      if (!admin_user.user.is_admin) {
         return false;
      }

      let announceType = route.params.access.split('_');
      let announceId = route.params.id;

      let data = await $axios.$get('/ticket/' + announceType[0] + '/' + announceId + '/getAccess');

      return {
         data,
         announceType,
      }
   },
   data() {
      return {
         timer: 5,
      }
   },
   mounted() {
      if (!this.data.access) {
         setInterval(() => {
            if (this.timer === 0) {
               location.reload();
            } else {
               this.timer--;
            }
         }, 1000);
      } else {
         let query = {
            token: this.$route.query.token
         };
         let type = {
            'motoatv': 'moto_atv',
            'scooter': 'scooters',
            'motorcycle': 'moto',
         };
         if (['motoatv', 'scooter', 'motorcycle'].includes(this.announceType[0])) {
            query.type = type[this.announceType[0]];
            this.announceType[0] = 'moto'; // open moto.vue
         }

         this.$router.push({
            path: '/moderator/ticket/' + this.announceType[0],
            query: query
         });
      }
   },
}
</script>
