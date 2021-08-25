<template>
  <component :is="isMobileBreakpoint ? 'mobile-screen' : 'div'" @back="$emit('close')" :bar-title="title">
    <h2 class="title-with-line full-width" v-if="title && !isMobileBreakpoint">
      <span>{{ title }}</span>
    </h2>
    <div class="year-options">
      <div :class="isMobileBreakpoint ? 'pt-3' : ''" @click.stop>
        <form-buttons v-model="yearsValue" :options="options" :btn-class="'primary-outline'" :group-by="isMobileBreakpoint ? 3 : 10" />
      </div>
    </div>
  </component>
</template>

<script>
export default {
  props: {
    value: {},
    title: String,
    years: Object
  },
  computed: {
    yearsValue: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit('input', value);
      }
    },

    options() {
      let years = [];
      if (this.years.years) {
        years = this.years.years;
      } else {
        for (let i = this.years.max; i >= this.years.min; i--) {
          years.push(i);
        }
      }
      return years.map(year => ({ key: year, name: year }));
    }
  }
}
</script>