<template>
  <div class="promote-card card mb-lg-3">
    <promote view="card"
      :announcement="announcement" 
      :promotion-type="promotion.type || 1"
      @select-service-option="selectServiceOption($event), showModal = true"
    />
    <modal-popup 
      :toggle="showModal" 
      :title="$t('promoting')"
      @close="showModal = false"
      :modal-class="'larger'"
    >
      <promote view="popup"
        :announcement="announcement" 
        :promotion-type="promotion.type"
      />
    </modal-popup>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

import Promote from '~/components/announcements/Promote';

export default {
  components: {
    Promote
  },
  data() {
    return {
      showModal: false
    }
  },
  computed: {
    ...mapGetters(['announcement', 'promotion'])
  },
  methods: {
    selectServiceOption(id) {

    }
  }
}
</script>