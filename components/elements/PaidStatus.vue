<template>
  <div :class="['paid-status', (isMobileBreakpoint ? 'full-screen' : 'in-popup'), paidStatusData.type]" v-if="paidStatusData">
    <div class="top" v-if="isMobileBreakpoint">
      <span class="cursor-pointer" @click="$removeQueryParam('success'), updatePaidStatus(false)">
        <icon name="cross" />
      </span>
    </div>
    <div class="status-text">
      <icon :name="`${paidStatusData.type === 'error' ? 'alert' : 'check'}-circle`" />
      <div>
        <h4>{{ paidStatusData.title }}</h4>
        <p v-if="paidStatusData.text">{{ paidStatusData.text }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  computed: {
    ...mapGetters(['paidStatusData'])
  },
  methods: {
    ...mapActions(['updatePaidStatus'])
  },
  mounted() {
    this.setBodyOverflow('hidden');
  },
  beforeDestroy() {
    this.setBodyOverflow('scroll');
    this.updatePaidStatus(false);
  }
}
</script>