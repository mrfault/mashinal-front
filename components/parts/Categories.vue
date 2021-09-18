<template>
  <ul class="part-categories card">
    <li
      v-for="category in categories"
      :key="category.title"
      :class="{'active': isActive(category)}"
    >
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
  methods: {
    isActive(category) {
      let route = this.$route.path;
      const activeCategory = this.partsRoutes.find(c => this.$localePath(c.route) === route)

      if (activeCategory)  {
        if (activeCategory.title === category.title) {
          return true
        } else if (category.title === 'tyres_and_rims') {
          return ['rims', 'tyres'].includes(activeCategory.title)
        }
      }
      return false
    }
  },
  computed: {
    categories() {
      return this.partsRoutes.filter(r => r.showOnMenu)
    }
  }
}
</script>