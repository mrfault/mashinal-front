<template>
  <div class="sell_progress mb-lg-3">
    <span :style="{ width: `${progress}%` }"></span>
  </div>
</template>

<script>
export default {
  props: {
    form: {
      default: () => ({})
    }
  },
  computed: {
    progress() {
      let progress = 5;
      if (this.form.brand || this.form.selectedBrand) progress += 5;
      if (this.form.model || this.form.selectedModel) progress += 10;
      if (this.form.year || this.form.selectedYear) progress += 10;
      return progress;
    }
  }
}
</script>