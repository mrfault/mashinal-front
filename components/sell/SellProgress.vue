<template>
  <div class="sell_progress mb-lg-3">
    <span :style="{ width: `${sellProgress}%` }"></span>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  props: {
    form: {
      default: () => ({})
    }
  },
  computed: {
    ...mapGetters(['sellProgress']),

    progress() {
      let progress = 5;
      if (this.form.brand || this.form.selectedBrand) progress += 5;
      if (this.form.model || this.form.selectedModel) progress += 10;
      if (this.form.year || this.form.selectedYear) progress += 10;
      return progress;
    }
  },
  methods: {
    ...mapActions(['setSellProgress'])
  },
  watch: {
    progress(value) {
      this.setSellProgress(value);
    }
  }
}
</script>