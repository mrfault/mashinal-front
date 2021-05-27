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
    
  </button>
</template>

<script>
import { ServicesMixin } from '~/mixins/services';

export default {
  mixins: [ServicesMixin],
  props: {
    announcement: {}
  },
  data() {
    return {
      showModal: false
    }
  },
  methods: {
    selectService(type) {
      thi
    }
  }
}
</script>