<template>
  <div :class="['infinite-loading', {[className]: !!className}]" v-if="loading">
    <loader />
  </div>
</template>

<script>
import {mapState} from "vuex";

export default {
  props: {
    condition: {
      type: Boolean,
      default: true
    },
    type: {
      default: 0
    },
    getter: String,
    getterB: String,
    action: String,
    actionB: String,
    perPage: Number,
    perPageB: Number,
    actionData: {
      default: () => ({})
    },
    offset: Number,
    className: String
  },
  data() {
    return {
      page: 1,
      pageB: 1,
      loading: false,
      triggerOffset: this.offset || 0
    }
  },
  methods: {
    async infiniteScroll() {

      let prevRes;

      if(this.actionB) {
        prevRes = this.$store.getters[this.getter];
      }else {
        prevRes = this.$store.getters[this.getter];
      }

      let isTimeToScroll = (window.scrollY + window.innerHeight) >= (document.documentElement.scrollHeight - this.triggerOffset);
      let contentNotLoaded = prevRes.next_page_url && prevRes.total !== prevRes.to;
      let usePlanB = false;
      if (this.actionB && this.getterB) {
        let prevResB = this.pageB === 1 ? this.$store.getters[this.getterB] : this.temporaryLazyDataB;
        let contentBNotLoaded = (this.pageB === 1) || (prevResB.next_page_url && (prevResB.total !== prevResB.to));
        usePlanB = contentBNotLoaded && this.page === this.pageB;
      }

      if (!this.loading && this.condition && contentNotLoaded && isTimeToScroll) {
        this.loading = true;

        try {
          await this.$store.dispatch((usePlanB ? this.actionB : this.action), {
            ...this.actionData, page: usePlanB ? this.pageB : (this.page + 1),
            type: this.type
          });

          let newRes = usePlanB ? this.temporaryLazyDataB : this.temporaryLazyData;
         // this.$store.getters[usePlanB ? this.getterB : this.getter];
          if(!Array.isArray(newRes.data)) {
            newRes = { ...newRes };
            newRes.data = Object.values(newRes.data);
          }
          if(!newRes.data.length) {
            this.mutate({
              property: this.getter,
              key: 'total',
              value: newRes.total
            })
            this.mutate({
              property: this.getter,
              key: 'to',
              value: newRes.total
            })
          }
          if (!usePlanB || (newRes.data.length % this.perPageB) === 0) {
            this.mutate({ property: this.getter, key: 'data', value: [...prevRes.data, ...newRes.data] });
          }

          if (usePlanB) this.pageB = this.pageB + 1;
          else this.page = this.page + 1;
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
  },
  computed:{
    ...mapState(['temporaryLazyData','temporaryLazyDataB'])
  }
}
</script>
