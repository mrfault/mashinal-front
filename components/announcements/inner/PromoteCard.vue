<template>
  <div class="promote-card card mb-lg-3">
    <promote :view="'card'" 
      :announcement="announcement" 
      :promotion-type="promotion.type || 1"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

import Promote from '~/components/announcements/Promote';

export default {
  components: {
    Promote
  },
  computed: {
    ...mapGetters(['announcement', 'promotion'])
  }
}
</script>