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
   </div>
</template>

<script>
   import Grid from "~/components/announcements/Grid.vue";
   import Cap from "~/components/elements/Cap.vue";
   import { mapGetters } from "vuex";

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

      components: { Grid, Cap },

      data() {
        return {
           pending: false
        }
      },

      methods: {
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
        })
      },

      async asyncData({ store }) {
         await store.dispatch('fetchMonetizedAnnouncementsPage', 'page=1');
      }
   }
</script>

<style lang="scss" scoped>
   .featuredAds {
      margin-top: 200px;
   }
</style>
