<template>
  <transition-group name="fade">
    <div v-if="badgeVisible" :key="'badgeVisible'">
      <div class="comparison-badge" @click="previewVisible = !previewVisible">
        <icon name="compare" />
      </div>
      <comparison-preview
        :visible="previewVisible"
        @close="previewVisible = false"
      />
    </div>
  </transition-group>
</template>

<script>
import ComparisonPreview from '~/components/elements/ComparisonPreview.vue'

export default {
  components: {
    ComparisonPreview
  },
  data() {
    return {
      badgeVisible: false,
      previewVisible: false
    }
  },
  mounted() {
    this.$store.dispatch('comparison/getInitialAnnouncements')
  },
  computed: {
    list() {
      return this.$store.state.comparison.announcementsList
    }
  },
  watch:{
    list() {
      this.badgeVisible = Boolean(this.list.length)
      if (!this.badgeVisible) {
        this.previewVisible = false
      }
    }
  },
  
}
</script>