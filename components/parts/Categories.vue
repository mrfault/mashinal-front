<template>
  <ul class="part-categories card">
    <li v-for="category in categories" :key="category.title">
      <nuxt-link :to="$localePath(category.route)">
        <icon :name="category.icon" />
        {{ $t(category.title) }}
      </nuxt-link>
    </li>
  </ul>
</template>

<script>
import { RoutesMixin } from '~/mixins/routes'

export default {
  mixins: [RoutesMixin],
  computed: {
    categories() {
      return this.partsRoutes.filter(r => r.showOnMenu)
    }
  }
}
</script>