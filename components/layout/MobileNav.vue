<template>
  <div class="mobile-nav d-lg-none" v-if="routeName !== 'login'">
    <div class="container">
      <ul>
        <li v-for="menu in bottomMenus.filter(menu => !menu.hide)" :key="menu.title">
          <nuxt-link :to="$localePath(menu.route)" :class="{'pseudo-active': isPseudoActive(menu)}">
            <icon :name="menu.icon" />
            <span>{{ $t(menu.title) }}</span>
          </nuxt-link>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { MenusDataMixin } from '~/mixins/menus-data';

export default {
  mixins: [MenusDataMixin],
  computed: {
    hasSearchNav() {
      return [
        'index', 'cars', 'cars-vip', 'cars-premium', 'cars-assistant', 'cars-advanced-search',
        'moto', 'moto-moto', 'commercial','commercial-commercial'
      ].includes(this.routeName);
    },
    hasProfileData() {
      return [
        'profile', 'profile-settings'
      ].includes(this.routeName);
    }
  },
  methods: {
    isPseudoActive(menu) {
      return (this.hasSearchNav && menu.title === 'search') 
          || (this.hasProfileData && menu.title === 'my_account');
    }
  }
}
</script>