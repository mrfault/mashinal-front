<template>
   <div class="monetizedPage">
      <div class="container">
         <grid
            :announcements="announcements?.data"
            :paginate="announcements?.meta"
            :hasContainer="false"
            :pending="pending"
            @change-page="changePage"
         >
            <template #cap>
               <Cap :className="'mb40'">
                  <template #left>
                     <h3>{{ $t('featured_ads') }}</h3>
                  </template>
               </Cap>
            </template>
         </grid>
      </div>

<!--      <infinite-loading-->
<!--         :per-page="20"-->
<!--         :per-page-b="4"-->
<!--         :offset="5000"-->
<!--         action="getInfiniteMainSearchWithoutMutate"-->
<!--         action-b="getInfiniteMainPartsSearchWithoutMutate"-->
<!--         getter="mainAnnouncements"-->
<!--         getter-b="mainPartsAnnouncements"-->
<!--      />-->

      <HandleIds :items="handleIdsOptions" />
   </div>
</template>

<script>
   import Grid from "~/components/announcements/Grid.vue";
   import Cap from "~/components/elements/Cap.vue";
   import HandleIds from "~/components/announcements/HandleIds.vue";
   import { mapActions, mapGetters } from "vuex";

   export default {
      name: 'monetized-page',

      transition: 'fade-y-20',

      head() {
         return this.$headMeta({
            title: this.$t('featured_ads'),
            // description: this.$t('meta-descr_main-page'),
         })
      },

      nuxtI18n: {
         paths: {
            az: '/one-cekilmish-elanlar'
         }
      },

      components: { Grid, Cap, HandleIds },

      data() {
        return {
           pending: false
        }
      },

      methods: {
         // ...mapActions(['getInfiniteMainSearch', 'clearSavedSearch', 'fetchInfiniteMainMonetizedHome']),

         async changePage(page = 1) {
            page = this.$route.query.page || 1;

            this.pending = true;
            await this.$store.dispatch('fetchMonetizedAnnouncementsPage', `page=${page}`);
            this.pending = false;

            // setTimeout(() => {
               this.scrollTo('.announcements-grid', [-70, -200]);
            // }, 100)
         }
      },

      computed: {
         ...mapGetters({
             announcements: 'monetizedPage'
         }),

         handleIdsOptions() {
            let ids = [];

            ids.push({
               type: 'car',
               ids: [...this.announcements?.data?.filter(car => car.type === 'light_vehicle').map(item => item.id)]
            });

            ids.push({
               type: 'motorcycle',
               ids: [...this.announcements?.data?.filter(car => car.type === 'motorcycle').map(item => item.id)]
            });

            ids.push({
               type: 'scooter',
               ids: [...this.announcements?.data?.filter(car => car.type === 'scooter').map(item => item.id)]
            });

            ids.push({
               type: 'motoatv',
               ids: [...this.announcements?.data?.filter(car => car.type === 'motoatv').map(item => item.id)]
            });

            ids.push({
               type: 'commercial',
               ids: [...this.announcements?.data?.filter(car => car.type === 'commercial').map(item => item.id)]
            });

            ids.push({
               type: 'parts',
               ids: [...this.announcements?.data?.filter(car => car.type === 'parts').map(item => item.id)]
            });

            return ids;
         }
      },

      async asyncData({ store }) {
         await store.dispatch('fetchMonetizedAnnouncementsPage', 'page=1');
      },

      // mounted() {
      //    this.$store.dispatch('getInfiniteMainSearch')
      //    this.$store.dispatch('fetchInfiniteMainMonetizedHome');
      // }
   }
</script>

<style lang="scss" scoped>
   .featuredAds {
      margin-top: 200px;
   }
</style>
