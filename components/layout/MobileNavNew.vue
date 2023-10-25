<template>
   <div class="mobile-nav-new d-lg-none" >
<!--      v-if="!announcementInner"-->
      <ul>
         <li v-for="menu in bottomMenus.filter(item => !item.hide)" :key="menu.title">
            <nuxt-link
               class="position-relative"
               :to="$localePath(menu.route)"
               @click="toggleSidebarMenu()"
               :active-class="''"
               :exact-active-clas="'active'"
            >
               <inline-svg :src="menu.icon" />
               <span>{{ $t(menu.title) }}</span>

               <template v-if="menu.title === 'messages' && countNewMessages > 0">
                  <span class="badge-counter">{{ countNewMessages }}</span>
               </template>

               <template v-else-if="menu.title === 'favorites' && notViewedFavorites > 0">
                  <span class="badge-counter">{{ notViewedFavorites }}</span>
               </template>
            </nuxt-link>
         </li>
      </ul>
   </div>

<!--   <div v-else>-->
<!--      <AnnouncementBar />-->
<!--   </div>-->
</template>

<script>
   import AnnouncementBar from "~/components/announcements/inner/AnnouncementBar.vue";
   import { mapGetters } from 'vuex';
   import { MenusDataMixin } from '~/mixins/menus-data';

   export default {
      components: {AnnouncementBar},

      mixins: [MenusDataMixin],

      computed: {
         ...mapGetters(['countNewMessages', 'notViewedFavorites']),

         announcementInner() {
            return this.$route?.params?.id;
         }
      },

      methods: {
         toggleSidebarMenu() {
            this.$root?.$refs?.MobileMenuNew?.toggleSidebarMenu(false);
         }
      }
   }
</script>
