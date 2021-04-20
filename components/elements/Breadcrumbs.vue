<template>
  <nav class="breadcrumbs d-none d-lg-block" aria-label="breadcrumb">
    <ul>
      <li :key="-1">
        <nuxt-link :to="$localePath('/')"><icon name="home" /></nuxt-link>
        <icon name="chevron-right" />
      </li>
      <template v-for="(crumb, index) in crumbs">
        <li v-if="index !== crumbs.length - 1" :key="index">
          <nuxt-link :to="$localePath(crumb.route)">{{ $t(crumb.name) }}</nuxt-link>
          <icon name="chevron-right" />
        </li>
        <li v-else :key="index" class="active" aria-current="page">
          <span>{{ $t(crumb.name) }}</span>
        </li>
      </template>
    </ul>
  </nav>
</template>

<script>
export default {
  props: {
    crumbs: Array
  }
}
</script>