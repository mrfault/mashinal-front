<template>
  <button class="btn btn--green-outline" @click="showSteps = true">
    {{ $t('send_a_letter_of_attorney') }}
    <component 
      v-if="!isMobileBreakpoint || showSteps"
      :is="isMobileBreakpoint ? 'mobile-screen' : 'modal-popup'" 
      :bar-title="$t('send_a_letter_of_attorney')" 
      :height-auto="true"
      :toggle="showSteps"
      :title="$t('send_a_letter_of_attorney')"
      :modal-class="'modal-container full-screen'"
      @back="close"
      @close="close"
    >
      <div class="letter-of-attorney">
        <steps-progress :finished="finished" />
        <template v-if="!finished">
          <div class="mt-2 mt-lg-3 mb-2 mb-lg-3">
            <p>{{ $t(`step_${currentStep}_info_title`) }}</p>
          </div>
          <div class="row">
            <div class="col-lg-4">
              <div class="card-bordered">
                <component :is="`step-${currentStep}`" @next="stepForward" />
              </div>
            </div>
            <div class="col-lg-8">
              <steps-summary :car="car" />
            </div>
          </div>
        </template>
      </div>
    </component>
  </button>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

import StepsProgress from '~/components/garage/loa/StepsProgress';
import StepsSummary from '~/components/garage/loa/StepsSummary';
import Step1 from '~/components/garage/loa/Step1';
import Step2 from '~/components/garage/loa/Step2';
import Step3 from '~/components/garage/loa/Step3';
import Step4 from '~/components/garage/loa/Step4';
import Step5 from '~/components/garage/loa/Step5';
import Step6 from '~/components/garage/loa/Step6';
import Step7 from '~/components/garage/loa/Step7';
import Step8 from '~/components/garage/loa/Step8';
import Step9 from '~/components/garage/loa/Step9';
import Step10 from '~/components/garage/loa/Step10';

export default {
  props: {
    car: {}
  },
  components: {
    StepsProgress,
    StepsSummary,
    Step1,
    Step2,
    Step3,
    Step4,
    Step5,
    Step6,
    Step7,
    Step8,
    Step9,
    Step10
  },
  data() {
    return {
      showSteps: false,
      finished: false
    }
  },
  methods: {
    ...mapActions('letterOfAttorney', ['decreaseStep', 'increaseStep', 'resetSteps']),

    close() {
      this.finished = false;
      this.showSteps = false;
      this.resetSteps();
    },
    stepBack() {
      if (this.currentStep > 1) {
        this.decreaseStep();
      }
    },
    stepForward() {
      if (this.currentStep === this.maxSteps) {
        this.finished = true;
      } else {
        this.increaseStep();
      }
    }
  },
  computed: {
    ...mapGetters('letterOfAttorney', ['currentStep', 'maxSteps'])
  }
}
</script>