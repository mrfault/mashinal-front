<template>
  <div class="card with-margins dashboard-card">
    <h3 v-if="title">{{ title }}</h3>
    <icon v-if="icon" :name="icon" class="dashboard-card_icon" />
    <div class="dashboard-card_content full-height">
      <slot />
    </div>
    <div class="dashboard-card_footer" v-if="path">
      <slot name="footer" />
      <nuxt-link :to="path" @click.native="setPageRef($route.path)">
        {{ $t('more_details') }}
        <!-- <icon name="chevron-right" /> -->
        <inline-svg src="/icons/chevron-right.svg" :height="14" />
      </nuxt-link>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: String,
    icon: String,
    path: String,
  },
}
</script>
