<template>
  <nav class="breadcrumbs d-none d-lg-flex align-items-center full-width">
    <ul aria-label="breadcrumb">
      <li :key="-1">
        <nuxt-link :to="$localePath('/')"><icon name="home" /></nuxt-link>
        <icon name="chevron-right" />
      </li>
      <template v-for="(crumb, index) in crumbs">
        <li v-if="crumb.route" :key="index">
          <nuxt-link :to="$localePath(crumb.route || '/')">{{ crumb.name }}</nuxt-link>
          <icon v-if="index !== crumbs.length - 1" name="chevron-right" />
        </li>
        <li v-else :key="index" class="active" aria-current="page">
          <span>{{ crumb.name }}</span>
        </li>
      </template>
    </ul>
    <slot />
  </nav>
</template>

<script>
export default {
  props: {
    crumbs: Array
  }
}
</script>