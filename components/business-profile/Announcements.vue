<template>
  <grid :announcements="announcements" />
</template>

<script>
import Grid from '~/components/announcements/Grid';

export default {
  components: {
    Grid
  },
  async fetch() {
    const announcements = await this.$axios.post('/grid/cars')
    this.announcements = announcements.data.data.slice(0, 5)
  },
  data() {
    return {
      announcements: []
    }
  }
}
</script>