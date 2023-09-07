<template>
   <div class="pages-salons-id">
      <div class="container">
         <salon-inner />
      </div>

      <HandleIds
         :items="handleIdsOptions"
         :watchIds="false"
      />
   </div>
</template>

<script>
   import { mapGetters } from 'vuex';
   import SalonInner from '~/components/salons/SalonInner';
   import HandleIds from "~/components/announcements/HandleIds.vue";

   export default {
      name: 'pages-salons-id',

      components: {
         SalonInner,
         HandleIds
      },

      nuxtI18n: {
         paths: {
            az: '/xaricden-avto/:id'
         }
      },

      // head() {
      //    return this.$headMeta({
      //       title: `${this.$t('autosalon')} "${this.salonSingle.name || this.salonSingle.user.full_name}" | ${this.$t('salons')}`,
      //       description: this.salonSingle.short_description
      //    });
      // },

      async asyncData({store, route}) {
         await Promise.all([
            store.dispatch('getSalonById', {slug: route.params.id}),
            store.dispatch('getMotoOptions')
         ]);

           await store.dispatch('fetchAutosalonAnnouncementsId', {
              id: store?.getters?.salonSingle?.id,
              page: route.query.page || 1
           });

         // store.dispatch('fetchAutosalonAnnouncementsId', {id: store.getters.salonSingle.id});
      },

      mounted() {
         // this.$store.commit('mutate', {
         //    property: 'announcement',
         //    value: {}
         // })
      },

      computed: {
         ...mapGetters(['salonSingle', 'autosalonAnnouncementsId']),

         crumbs() {
            return [
               { name: this.$t('external-salons'), route: '/external-salons' },
               { name: this.salonSingle.name || this.salonSingle.user.full_name }
            ]
         },

         handleIdsOptions() {
            let ids = [];

            ids.push({
               type: 'commercial',
               ids: [...this.autosalonAnnouncementsId?.data?.map(item => item.id)]
            });

            return ids;
         }
      }
   }
</script>
