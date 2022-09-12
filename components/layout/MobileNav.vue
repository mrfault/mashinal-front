<template>
  <div class="mobile-nav d-lg-none" >
    <div class="container">
      <ul>
        <li v-for="menu in bottomMenus.filter(menu => !menu.hide)" :key="menu.title">
          <nuxt-link :to="$localePath(menu.route)" :class="{'pseudo-active': isPseudoActive(menu)}">
            <icon :name="menu.icon" />
            <span>{{ $t(menu.title) }}</span>
            <template v-if="menu.title === 'messages' && countNewMessages > 0">
              <span class="badge-counter">{{ countNewMessages }}</span>
            </template>
          </nuxt-link>
        </li>
      </ul>
    </div>
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
    isPseudoActive(menu) {
      return (this.hasSearchNav && menu.title === 'main')
          || (this.routeName === 'profile-messages' && menu.title === 'messages')
          || (this.routeName === 'garage' && menu.title === 'garage')
          || (this.routeName?.includes('catalog') && menu.title === 'catalog');
    }
  }
}
</script>
