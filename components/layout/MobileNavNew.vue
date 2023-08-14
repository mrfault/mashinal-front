<template>
   <div class="mobile-nav-new d-lg-none">
      <ul>
         <li v-for="menu in bottomMenus.filter(item => !item.hide)" :key="menu.title">
            <nuxt-link :to="$localePath(menu.route)" @click="toggleSidebarMenu()" :active-class="''" :exact-active-clas="'active'">
               <inline-svg :src="menu.icon" />
               <span>{{ $t(menu.title) }}</span>
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
      ...mapGetters(['countNewMessages'])
   },
   methods: {
      toggleSidebarMenu() {
         this.$root?.$refs?.MobileMenuNew?.toggleSidebarMenu(false);
      }
   }
}
</script>
