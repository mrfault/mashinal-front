<template>
   <div class="pages-sell">
      <div class="container">
         <breadcrumbs :crumbs="crumbs" />
         <div class="announce_container">
            <div class="card">
               <form class="add_announce_form">
                  <part_form isEdit :announcement="announcement" :isReady="isReady"
                             @getForm="getPartForm($event)" />
                  <button type="button" @click="onClick()" class="btn full-width btn--pale-green-outline active">
                     {{ $t("place_announcement") }}
                  </button>
               </form>
               <div class="vehicle_card_info" v-if="!isMobileBreakpoint">
                  <template>
                     <grid-item :announcement="form"/>
                  </template>
               </div>
            </div>
         </div>
      </div>
   </div>
</template>

<script>
import {mapActions, mapGetters} from 'vuex';

import SellProgress from '~/components/sell/SellProgress';
import SellPreview from '~/components/sell/SellPreview';
import SellPartsForm from '~/components/sell/SellPartsForm';
import Part_form from "~/components/sell/part_form.vue";
import GridItem from "~/components/announcements/GridItem.vue";

export default {
   name: 'pages-parts-announcement-edit',
   middleware: 'auth_general',
   nuxtI18n: {
      paths: {
         az: '/ehtiyat-hisseleri/elan/:id/redakte'
      }
   },
   head() {
      return this.$headMeta({
         title: this.$t('your_announcements')
      });
   },
   data() {
      return {
         isReady: false
      }
   },
   async asyncData({ store, route }) {
      store.dispatch('setSellPreviewData', { value: {} });
      await Promise.all([
         store.dispatch('getMyAnnouncement', route.params.id),
         store.dispatch('getPartCategories'),
      ]);

   },
   components: {
      GridItem,
      Part_form,
      SellProgress,
      SellPreview,
      SellPartsForm
   },
   computed: {
      ...mapGetters({
         announcement: 'myAnnouncement',
         form: 'parts/form'
      }),
      crumbs() {
         return [
            { name: this.$t('my_announces'), route: `/profile/announcements` },
            { name: `#${this.$route.params.id}`, route: `/parts/announcement/${this.$route.params.id}` },
            { name: this.$t('edit_ad') }
         ]
      }
   },
   methods: {
      ...mapActions(['partEdit']),
      async getPartForm(form) {

         try {
            await this.partEdit({id: this.$route.params.id.slice(0, -1), form})
            this.$router.push(this.$localePath('/profile/announcements'))
         }catch(e){}
      },
      onClick() {
         this.isReady = !this.isReady
      },
   }
}
</script>

<style lang="scss" scoped>
.announce_container {
   display: flex;
   column-gap: 16px;

   .card {
      flex-grow: 3;
      display: flex;
      gap: 68px;

      .add_announce_form {
         display: flex;
         flex-grow: 1;
         flex-direction: column;
         gap: 20px;
      }
   }
}
</style>
