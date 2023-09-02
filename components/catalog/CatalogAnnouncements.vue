<template>
   <div class="mt-lg-n1 mb-n5 mb-lg-0">
      <grid
         v-if="catalogAnnouncements?.data?.length"
         where="catalog"
         :announcements="catalogAnnouncements?.data"
         :paginate="catalogAnnouncements?.meta"
         @change-page="changePage"
         :hasContainer="false"
      />
   </div>
</template>

<script>
   import Grid from '~/components/announcements/Grid';
   import { mapGetters, mapActions } from 'vuex';

   export default {
      props: {
         catalogId: Number
      },

      components: {
         Grid
      },

      computed: {
         ...mapGetters(['catalogAnnouncements'])
      },

      methods: {
         ...mapActions(['getCatalogAnnouncements']),

         changePage(page = 1) {

         }
      },

      created() {
         this.getCatalogAnnouncements(this.catalogId);
      }
   }
</script>
