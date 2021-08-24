<template>
  <div>
    <div id="comparison" class="comparison card" v-if="!showNotFound">
      <ComparisonAnnouncements v-if="filter.compareType === 'announcements'" />
      <ComparisonModels v-else />
    </div>
    <NotFound v-else text="Avtomobil yoxdur"/>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import ComparisonAnnouncements from '~/components/comparison/ComparisonAnnouncements.vue'
import ComparisonModels from '~/components/comparison/ComparisonModels.vue'
import NotFound from '~/components/elements/NotFound.vue'

export default {
  components:{
    ComparisonAnnouncements,
    ComparisonModels,
    NotFound
  },
  computed: {
    ...mapGetters({
      filter: 'comparison/filter',
      announcements: 'comparison/announcementIds'
    }),
    showNotFound() {
      return this.filter.compareType === 'announcements' && !this.announcements.length
    }
  }
}
</script>