<template>
  <transition-group name="fade">
    <div v-if="badgeVisible"  :key="'badgeVisible'">
      <div class="comparison-badge" :style="windowWidth > 1800 ? 'right: calc(((100% - 1200px) / 2) - 25px);':''" @click="handleClick">
        <inline-svg class="comparison-white" src="/icons/compare-icon.svg" />
        <span v-if="count" class="comparison-badge__count">{{ count }}</span>
      </div>
      <comparison-preview
        :visible="previewVisible"
        @close="previewVisible = false"
      />
    </div>
  </transition-group>
</template>
<style lang="scss">
.comparison-white {
  fill: white;
  width: 35px;
  height: 35px;
  path {
    fill:white;
    stroke:white;
  }
}
</style>
<script>
import { mapGetters } from 'vuex'
import ComparisonPreview from '~/components/elements/ComparisonPreview'

export default {
  components: {
    ComparisonPreview,
  },
  props:['windowWidth'],
  data() {
    return {
      badgeVisible: false,
      previewVisible: false,
    }
  },
  mounted() {
    this.$store.dispatch('comparison/getInitialAnnouncements')
    this.updateVisible()
  },
  methods: {
    handleClick() {
      if (this.isMobileBreakpoint) {
          this.$router.push(this.$localePath('/comparison'))
      } else {
        this.previewVisible = !this.previewVisible
      }
    },
    updateVisible() {
      this.badgeVisible = Boolean(this.$store.getters['comparison/count']) && !(this.$route.name == "comparison___az" || this.$route.name == "comparison___ru");
      if (!this.badgeVisible) {
        this.previewVisible = false
      }
    },
  },
  computed: {
    ...mapGetters({
      count: 'comparison/count',
    }),
  },
  watch: {
    count() {
      this.updateVisible()
    },
  },
}
</script>
