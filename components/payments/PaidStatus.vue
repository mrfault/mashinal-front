<template>
  <div :class="['paid-status', (isMobileBreakpoint ? 'full-screen' : 'in-popup'), paidStatusData.type]">
    <div class="top" v-if="isMobileBreakpoint">
      <span class="cursor-pointer" @click="$removeQueryParam('success'), updatePaidStatus(false)">
        <icon name="cross" />
        <!-- <inline-svg src="/icons/cross.svg" height="14"/> -->
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
       if (this.isMobileBreakpoint)
         this.setBodyOverflow('hidden');
     },

     beforeDestroy() {
       if (this.isMobileBreakpoint)
         this.setBodyOverflow('scroll');
       this.updatePaidStatus(false);
     }
   }
</script>