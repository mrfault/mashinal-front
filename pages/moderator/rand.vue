<template>
  <div>
    <div v-if="types.length"></div>
    <div v-else>
      <div style="text-align: center">
        <br><br>
        <h2>{{$t('not_have_panding_cars')}}</h2>
        <a href="/alvcp/resources/announce-moderators">
          <button class="section-post__btn add_announce">{{$t('back_to_moderator_page')}}</button>
        </a>
        <br><br>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    layout: 'ticket',
    data() {
      return {
        types: ['car', 'moto', 'moto_atv', 'scooters', 'commercial', 'part', 'plate']
      }
    },
    async mounted() {
      this.$nuxt.$emit('loading_status', true);
      await this.$auth.setUserToken(`Bearer ${this.$route.query.token}`);
      const admin_user = await this.$axios.$get('/user');
      if (!admin_user.user.is_admin) return false;
      if (admin_user.user.admin_group !== 2) return false;

      let havePendingAnnounce = await this.$axios.$get(`/ticket/checkNonCompletedTask`);
      if (havePendingAnnounce.data.length > 0){
        this.$router.push('/moderator/ticket/'+havePendingAnnounce.data[0]+'?token='+this.$route.query.token+'&type='+havePendingAnnounce.data[1]);
        return false;
      }

      let data = await this.getAnnounce(this.getRandomData());

      if (data.data){
        if (['moto', 'moto_atv', 'scooters'].includes(data.randomType)){
          this.$router.push('/moderator/ticket/moto?token='+this.$route.query.token+'&type='+data.randomType);
        }
        else{
          this.$router.push('/moderator/ticket/'+data.randomType+'?token='+this.$route.query.token);
        }
      }

      this.$nuxt.$emit('loading_status', false);
    },
    methods: {
      getRandomData() {
        return this.types[Math.floor(Math.random() * this.types.length)];
      },
      async getAnnounce(randomType) {
        let data = false;
        try {
          if (['moto', 'moto_atv', 'scooters'].includes(randomType)){
            data = await this.$axios.$get(`/ticket/moto?type=${randomType}`);
          }else{
            data = await this.$axios.$get('/ticket/'+randomType);
          }

          if (data.code !== undefined && data.code !== 200){
            let index = this.types.indexOf(randomType);
            this.types.splice(index, 1);
            if (this.types.length){
              return await this.getAnnounce(this.getRandomData());
            }
          }

        } catch (e) {
          let index = this.types.indexOf(randomType);
          this.types.splice(index, 1);
          if (this.types.length){
            return await this.getAnnounce(this.getRandomData());
          }
        }

        return {data:data, randomType:randomType};
      }
    }
  }
</script>