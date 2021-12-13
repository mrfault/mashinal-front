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
      :modal-class="'modal-container letter-of-attorney-popup'"
      @back="close"
      @close="close"
    >
      <div class="letter-of-attorney">
        <steps-progress :finished="finished" />
        <template v-if="!finished">
          <div class="mt-2 mt-lg-0 mb-2 mb-lg-3">
            <h4>{{ stepInfoTitle }}
              <popover name="hint" class="wider"
                v-if="stepHints[currentRealStep]"
                :width="isMobileBreakpoint ? 240 : 550" 
                :message="$t('fields_pointed_with_arrow')"
              >
                <img :src="`/img/docs/${img}.png`" alt="" v-for="img in (stepHints[currentRealStep].imgs || [])" :key="img" /> 
              </popover>
            </h4>
          </div>
          <div class="row">
            <div :class="currentRealStep === 10 ? 'col-lg-12' : 'col-lg-4'">
              <div :class="{[isMobileBreakpoint ? 'mb-4' : 'card-bordered']: currentRealStep !== 10}">
                <component 
                  :is="`step-${currentRealStep}`" 
                  @next="increaseStep" 
                  @confirm="finished = true"
                />
              </div>
            </div>
            <div class="col-lg-8" v-if="currentRealStep !== 10">
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
    }
  },
  computed: {
    ...mapGetters('letterOfAttorney', ['stepSendData', 'currentStep', 'currentRealStep', 'maxSteps', 'hasGeneralPower']),

    stepHints() {
      return {
        1: {imgs: ['id-card']},
        2: {imgs: ['id-card']},
        3: {imgs: ['drivers-card-front', 'drivers-card-back']},
        4: {imgs: ['tech-passport-front', 'tech-passport-back']},
        5: {imgs: this.hasGeneralPower ? ['id-card'] : ['id-card','drivers-card-front']}
      }
    },
    stepInfoTitle() {
      return this.$t(`step_${this.currentRealStep}_info_title`);
    }
  }
}
</script>