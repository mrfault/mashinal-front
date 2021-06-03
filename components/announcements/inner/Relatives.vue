<template>
  <grid
    v-if="relativeAnnouncements.length"
    :announcements="relativeAnnouncements" 
    :title="$t('relative_announcements')"
  />
</template>

<script>
  import { mapGetters, mapActions } from 'vuex';

  import Grid from '~/components/announcements/Grid';

  export default {
    components: {
      Grid
    },
    computed: {
      ...mapGetters(['relativeAnnouncements'])
    },
    methods: {
      ...mapActions(['getRelativeAnnouncements'])
    },
    created() {
      this.getRelativeAnnouncements(this.$route.params.id);
    }
  }
</script>