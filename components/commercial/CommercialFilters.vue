<template>
  <div class="commercial-filters">
    <div class="row">
      <div v-for="(filter, index) in commercialSearchFilters" :key="index">

      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  props: {
    values: {}
  },
  data() {
    return {
      form: {}
    }
  },
  computed: {
    ...mapGetters(['commercialSearchFilters'])
  },
  methods: {
    changeFilter(key, value) {
      this.$emit('change-filter', key, value);
    },
    setValues() {
      
    }
  },
  created() {
    this.setValues();
    this.$nuxt.$on('change-commercial-filters', this.setValues);
  },
  beforeDestroy() {
    this.$nuxt.$off('change-commercial-filters', this.setValues);
  }
}
</script>