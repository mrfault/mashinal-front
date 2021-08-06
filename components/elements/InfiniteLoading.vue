<template>
  <div class="infinite-loading" v-if="loading">
    <loader />
  </div>
</template>

<script>
export default {
  props: {
    condition: {
      type: Boolean,
      default: true
    },
    getter: String,
    action: String,
    actionData: {
      default: () => ({})
    },
    offset: Number
  },
  data() {
    return {
      page: 1,
      loading: false,
      triggerOffset: this.offset || 0
    }
  },
  methods: {
    async infiniteScroll() {
      let prevRes = this.$store.getters[this.getter];
      let isTimeToScroll = (window.scrollY + window.innerHeight) >= (document.documentElement.scrollHeight - this.triggerOffset);
      let contentNotLoaded = prevRes.next_page_url && prevRes.total !== prevRes.to;
      if (!this.loading && this.condition && contentNotLoaded && isTimeToScroll) {
        this.loading = true;
        try {
          await this.$store.dispatch(this.action, {...this.actionData, page: this.page + 1});
          let newRes = this.$store.getters[this.getter];
          this.mutate({ property: this.getter, key: 'data', value: [...prevRes.data, ...newRes.data] });
          this.page = page + 1;
          this.loading = false;
          this.$emit('loaded-content');
        } catch(err) {
          this.loading = false;
        }
      }
    }
  },
  mounted() {
    if (!this.offset) {
      this.triggerOffset = this.offset || (window && window.innerHeight);
    }
    window.addEventListener('scroll', this.infiniteScroll);
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.infiniteScroll);
  }
}
</script>