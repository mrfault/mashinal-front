<template>
  <div class=" steps-progress pt-2 pb-2 pt-lg-0" ref="steps">
    <div class="steps-progress_inner">
      <div class="steps-progress_bar">
        <div :class="['filled', { 'animate': currentStep > 1 }]"
          :style="{ width: `calc(${finished ? 100 : (currentStep / (getMaxSteps + 1) * 100)}% + 4px)` }">
        </div>
      </div>
      <div class="steps-progress_list">
        <div
          v-for="step in getMaxSteps"
          :key="step"
          :class="['step', {
              'cursor-pointer': clickable,
              'pointer-events-none': finished,
              'passed': step < currentStep || finished,
              'active': step === currentStep,
              'disabled': step > currentStep
            }]"
          @click="handleStepClick(step)"
        >
          <icon name="check" v-if="step < currentStep || finished" />
          <template v-else>{{ step }}</template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  props: {
    limitSteps: {
      default: null,
    },
    finished: Boolean,
    clickable: Boolean
  },
  computed: {
    getMaxSteps() {
     return this.limitSteps ? this.limitSteps : this.maxSteps
    },
    ...mapGetters('letterOfAttorney', ['currentStep', 'maxSteps'])
  },
  methods: {
    ...mapActions('letterOfAttorney', ['updateStep']),

    handleStepClick(step) {
      if (!this.clickable || this.finished || step === this.currentStep) return;
      this.updateStep(step);
    }
  },
  watch: {
    currentStep(value) {
      this.$refs.steps?.scrollTo({
        left: ((value - 1) * 90),
        behavior: 'smooth'
      });
    }
  }
}
</script>
