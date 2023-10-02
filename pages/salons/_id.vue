<template>
   <div class="pages-salons-id">
      <div class="container">
         <salon-inner />
      </div>

<!--      <HandleIds-->
<!--         :items="handleIdsOptions"-->
<!--         :watchIds="false"-->
<!--      />-->
   </div>
</template>

<script>
   import HandleIds from "~/components/announcements/HandleIds.vue";
   import SalonInner from '~/components/salons/SalonInner';
   import {mapGetters} from 'vuex';

   export default {
      name: 'pages-salons-id',

      components: {
         SalonInner,
         HandleIds
      },

      nuxtI18n: {
         paths: {
            az: '/salon/:id'
         }
      },

      head() {
         return this.$headMeta({
            title: `${this.$t('autosalon')} "${this.salonSingle.name || this.salonSingle.user.full_name}" | ${this.$t('salons')}`,
            description: this.salonSingle.short_description
         });
      },

      async asyncData({store, route}) {
         await store.dispatch('getSalonById', {slug: route.params.id});
         await store.dispatch('getMotoOptions');
         // await store.dispatch('getAutoSalonOtherAnnouncements', {id: store?.getters?.salonSingle?.id});

         // await store.dispatch('fetchAutosalonAnnouncementsId', {
         //    id: store?.getters?.salonSingle?.id,
         //    page: route.query.page || 1
         // })
      },

      computed: {
         ...mapGetters(['salonSingle', 'shopAnnouncements']),

         crumbs() {
            return [
               {name: this.$t('salons'), route: '/salons'},
               {name: this.salonSingle.name || this.salonSingle.user.full_name}
            ]
         },

         handleIdsOptions() {
            let ids = [];

            ids.push({
               type: 'commercial',
               ids: [...this.shopAnnouncements?.data?.map(item => item.id)]
            });

            return ids;
         }
      },

      // mounted() {
      //     this.$store.commit('mutate', {
      //         property: 'announcement',
      //         value: {}
      //     })
      // },
   }
</script>

<style lang="scss">
   .pages-salons-id {
      .announcements-grid {
         margin: 0;
      }
   }
</style>
