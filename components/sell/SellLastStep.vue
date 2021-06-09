<template>
  <component :is="isMobileBreakpoint ? 'mobile-screen' : 'div'" @back="$emit('close')" :bar-title="title" height-auto>
    <div class="sell_last-step">
      <sell-select-modification v-if="type === 'cars'"
        :form="form"
        @update-form="handleModification"
      />
    </div>
  </component>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

import SellSelectModification from '~/components/sell/SellSelectModification';

export default {
  components: { 
    SellSelectModification
  },
  props: {
    title: String,
    type: String,
    initialForm: {}
  },
  data() {
    return {
      form: {}
    }
  },
  computed: {
    progress() {
      let progress = 30;
      if (this.form.car_catalog_id) progress += 10;
      return progress;
    }
  },
  methods: {
    ...mapActions(['setSellProgress']),

    handleModification({ key, value }) {
      this.$set(this.form, key, value);
    }
  },
  watch: {
    progress(value) {
      this.setSellProgress(value);
    }
  },
  created() {
    this.$set(this, 'form', this.$clone(this.initialForm));
    ['sellBody','sellGenerations','sellEngines','sellGearing','sellTransmissions','sellModifications']
      .map(property => { this.mutate({ property, value: [] }); });
  }
}
</script>