<template>
  <transition-group name="fade">
    <div v-if="badgeVisible && !isMobileBreakpoint" :key="'badgeVisible'">
      <div class="comparison-badge" @click="handleClick">
        <icon name="compare" />
        <span v-if="count" class="comparison-badge__count">{{ count }}</span>
      </div>
      <comparison-preview
        :visible="previewVisible"
        @close="previewVisible = false"
      />
    </div>
  </transition-group>
</template>

<script>
import { mapGetters } from 'vuex';
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
    this.updateVisible()
  },
  methods: {
    handleClick() {
      this.previewVisible = !this.previewVisible
    },
    updateVisible()  {
      this.badgeVisible = Boolean(this.$store.getters['comparison/count'])
      if (!this.badgeVisible) {
        this.previewVisible = false
      }
    }
  },
  computed: {
    ...mapGetters({
      count: 'comparison/count'
    })
  },
  watch:{
    count() {
      this.updateVisible()
    }
  },
  
}
</script>