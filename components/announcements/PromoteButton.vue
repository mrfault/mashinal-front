<template>
  <button class="btn btn--grey-outline full-width" @click.stop="showModal = true">
    <icon name="crown" /> {{ $t('promoting') }}
    <modal-popup 
      :toggle="showModal" 
      :title="$t('promoting')"
      @close="showModal = false"
    >
      <ul class="list-line-separated">
        <li v-for="service in staticServices" :key="service.type" @click="selectService(service.type)">
          <icon :name="service.name" />
          {{ $t(service.name) }}
        </li>
      </ul>
    </modal-popup>
    <template v-if="promotionType">
      <portal to="modals">
        <promote :view="isMobileBreakpoint && 'screen'" 
          :announcement="announcement" 
          :promotion-type="promotionType"
          @close="promotionType = ''" 
        />
      </portal>
    </template>
  </button>
</template>

<script>
import { ServicesMixin } from '~/mixins/services';

import Promote from '~/components/announcements/Promote';

export default {
  mixins: [ServicesMixin],
  components: {
    Promote
  },
  props: {
    announcement: {}
  },
  data() {
    return {
      showModal: false,
      promotionType: ''
    }
  },
  methods: {
    selectService(type) {
      this.showModal = false;
      this.promotionType = type;
    }
  }
}
</script>