<template>
  <div class="mobile-nav d-lg-none" v-if="routeName !== 'login'">
    <div class="container">
      <ul>
        <li v-for="menu in bottomMenus.filter(menu => !menu.hide)" :key="menu.title">
          <nuxt-link :to="$localePath(menu.route)">
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
  mixins: [MenusDataMixin]
}
</script>