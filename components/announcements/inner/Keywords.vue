<template>
  <div class="keywords card mb-lg-3" v-if="announcement.tags.length">
    <div
      v-for="keyword in announcement.keywords"
      :key="keyword.id"
      class="keyword"
    >
      {{ keyword.name }}
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