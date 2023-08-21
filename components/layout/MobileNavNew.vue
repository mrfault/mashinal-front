<template>
   <div class="mobile-nav-new d-lg-none">
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
</template>

<script>
import { mapGetters } from 'vuex';
import { MenusDataMixin } from '~/mixins/menus-data';

export default {
   mixins: [MenusDataMixin],

   computed: {
      ...mapGetters(['countNewMessages', 'notViewedFavorites'])
   },
   methods: {
      toggleSidebarMenu() {
         this.$root?.$refs?.MobileMenuNew?.toggleSidebarMenu(false);
      }
   }
}
</script>
