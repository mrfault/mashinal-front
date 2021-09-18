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
import ComparisonAnnouncements from '~/components/comparison/ComparisonAnnouncements'
import ComparisonModels from '~/components/comparison/ComparisonModels'
import NotFound from '~/components/elements/NotFound'

export default {
  components:{
    ComparisonAnnouncements,
    ComparisonModels,
    NotFound
  },
  mounted() {
    this.$store.commit('comparison/mutate', {
      property: 'filter',
      key: 'compareType',
      value: this.$route.hash.replace('#', '')
    })
  },
  computed: {
    ...mapGetters({
      filter: 'comparison/filter',
      announcements: 'comparison/announcementIds'
    }),
    showNotFound() {
      return this.filter.compareType === 'announcements' && !this.announcements.length
    }
  },
  watch: {
    '$route'(val) {
      this.$store.commit('comparison/mutate', {
        property: 'filter',
        key: 'compareType',
        value: val.hash.replace('#', '')
      })
    }
  }
}
</script>