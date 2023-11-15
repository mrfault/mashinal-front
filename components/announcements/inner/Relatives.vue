<template>
   <div>
      <template v-if="isShop">
         <grid
            class="dark-bg"
            v-if="shopAnnouncements?.data && shopAnnouncements?.data?.length"
            :announcements="shopAnnouncements?.data"
            :paginate="shopAnnouncements?.meta"
            @change-page="searchAnnouncements"
         >
            <template #cap>
               <Cap :className="'mb20'">
                  <template #left>
                     <h3>{{ title }}</h3>
                  </template>
               </Cap>
            </template>
         </grid>
      </template>

      <template v-else>
         <grid
            class="dark-bg"
            v-if="relativeAnnouncements.length"
            :announcements="relativeAnnouncements"
         >
            <template #cap>
               <Cap :className="'mb20'">
                  <template #left>
                     <h3>{{ title }}</h3>
                  </template>
               </Cap>
            </template>
         </grid>
      </template>
   </div>
</template>

<script>
   import Grid from '~/components/announcements/Grid';
   import Cap from "~/components/elements/Cap.vue";
   import { mapGetters, mapActions } from 'vuex';

   export default {
      components: { Grid, Cap },

      computed: {
         ...mapGetters(['announcement', 'relativeAnnouncements', 'shopAnnouncements']),

         isShop() {
            if (this.announcement?.is_part_salon) {
               return true;
            } else if (this.announcement?.is_auto_salon) {
               return this.announcement?.user?.auto_salon?.possible_announce_count > 5 ||
                      this.announcement?.user?.auto_salon?.possible_announce_count == 0;
            } else if (this.announcement?.is_external_salon) {
               return (this.announcement?.user?.external_salon?.possible_announce_count > 5 ||
                       this.announcement?.user?.external_salon?.possible_announce_count == 0);
            }

            return false
         },

         title() {
            if (this.announcement?.is_part_salon) {
               return this.$t('shop_other_announcements', {name: this.announcement?.user?.part_salon?.name});
            } else if (this.announcement?.is_auto_salon && (this.announcement?.user?.auto_salon?.possible_announce_count > 5 || this.announcement?.user?.auto_salon?.possible_announce_count == 0)) {
               return this.$t('salon_other_announcements', {name: this.announcement?.user?.auto_salon?.name});
            } else if (this.announcement?.is_external_salon && (this.announcement?.user?.external_salon?.possible_announce_count > 5 || this.announcement?.user?.external_salon?.possible_announce_count == 0)) {
               return this.$t('salon_other_announcements', {name: this.announcement?.user?.external_salon?.name});
            } else {
               return this.$t('relative_announcements');
            }
         }
      },

      methods: {
         ...mapActions([
             'getShopOtherAnnouncements',
            'getAutoSalonOtherAnnouncements',
            'getRelativeAnnouncements'
         ]),

         async searchAnnouncements(page = 1) {
            page = this.$route.query.page || 1;

            await this.getAutoSalonOtherAnnouncements({
               id: this.announcement?.user?.auto_salon?.id,
               excluded_id: this.announcement.id,
               page: page
            });
            this.scrollTo('.announcements-grid', [-90, -200]);
         }
      },

      created() {
         // if (this.announcement?.is_part_salon) this.getShopOtherAnnouncements(this.announcement.id);
         if (this.isShop) this.getAutoSalonOtherAnnouncements({
            id: this.announcement?.user?.auto_salon?.id || this.announcement?.user?.external_salon?.id,
            excluded_id: this.announcement.id,
            page: this.$route.query.page || 1
         });
         else this.getRelativeAnnouncements({type: this.announcement.type || 'light_vehicle', id: this.announcement.id});
      },

      beforeDestroy() {
         this.mutate({ property: 'relativeAnnouncements', value: {} });
         this.mutate({ property: 'temporaryLazyData', value: {} });
         this.mutate({ property: 'shopAnnouncements', value: {} });
      }
   }
</script>
