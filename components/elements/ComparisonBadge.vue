<template>
  <transition-group name="fade">
    <div v-if="badgeVisible && !isMobileBreakpoint" :key="'badgeVisible'">
      <div class="comparison-badge" @click="handleClick">
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
import ComparisonPreview from '~/components/elements/ComparisonPreview'

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
  methods: {
    handleClick() {
      if (this.list.length < 2) {
        this.previewVisible = !this.previewVisible
      } else {
        this.$router.push(this.$localePath('/comparison'))
      }
    }
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