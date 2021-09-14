<template>
  <div>
    <div id="comparison" class="comparison card" v-if="!showNotFound">
      <comparison-announcements v-if="filter.compareType === 'announcements'" />
      <comparison-models v-else />
    </div>
    <not-found v-else :text="$t('no_cars_found')">
      <nuxt-link class="btn btn--green" :to="$localePath('/')">
        {{ $t('to_add_an_advert') }}
      </nuxt-link>
    </not-found>
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