<template>
  <nuxt-link :class="['btn full-width', `btn--${className} `]" :to="path">
    <icon name="edit" /> {{ $t('edit') }}
  </nuxt-link>
</template>

<script>
export default {
  props: {
    announcement: {},
    type: String,
    className: {
      default: 'dark-blue'
    }
  },
  computed: {
    path() {
      return this.$localePath(`/${this.type}/announcement/${this.$route.params.id}/edit`);
    }
  }
}
</script>