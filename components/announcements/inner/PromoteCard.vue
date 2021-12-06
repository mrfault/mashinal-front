<template>
  <!-- deprecated component -->
  <div class="promote-card card mb-lg-3">
    <promote view="card"
      :announcement="announcement" 
      :promotion-type="promotion.type || 1"
      @select-service-option="showModal = true"
    />
    <modal-popup 
      :toggle="showModal" 
      :title="paidStatusData ? '' : $t('promoting')"
      :modal-class="'larger promote-popup'"
      @close="showModal = false, updatePaidStatus(false)"
    >
      <paid-status v-if="paidStatusData" />
      <promote view="popup" v-else
        :announcement="announcement" 
        :promotion-type="promotion.type"
      />
    </modal-popup>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

import Promote from '~/components/announcements/Promote';
import PaidStatus from '~/components/payments/PaidStatus';

export default {
  components: {
    Promote,
    PaidStatus
  },
  data() {
    return {
      showModal: false
    }
  },
  computed: {
    ...mapGetters(['announcement', 'promotion', 'paidStatusData'])
  },
  methods: {
    ...mapActions(['updatePaidStatus'])
  }
}
</script>