<template>
  <div :class="['mobile-status', mobileStatusData.type]">
    <div class="top">
      <span class="cursor-pointer" @click="$removeQueryParam('success'), $emit('close')">
        <icon name="cross" />
      </span>
    </div>
    <div class="status-text">
      <icon :name="`${mobileStatusData.type === 'error' ? 'alert' : 'check'}-circle`" />
      <div>
        <h4>{{ mobileStatusData.title }}</h4>
        <p v-if="mobileStatusData.text">{{ mobileStatusData.text }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  computed: {
    ...mapGetters(['mobileStatusData'])
  },
  mounted() {
    this.setBodyOverflow('hidden');
  },
  beforeDestroy() {
    this.setBodyOverflow('scroll');
  }
}
</script>