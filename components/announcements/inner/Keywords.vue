<template>
  <div class="keywords card mb-lg-3" v-if="announcement.tags.length">
    <h3>{{ $t('keywords') }}</h3>
    <div class="keywords__list">
      <nuxt-link
        v-for="keyword in announcement.tags"
        :key="keyword.id"
        class="keyword"
        :to="`${$localePath('/parts')}?parts_filter=${JSON.stringify({text: keyword.name})}`"
      >
        {{ keyword.name }}
      </nuxt-link>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  computed: {
    ...mapGetters(['announcement'])
  }
}
</script>