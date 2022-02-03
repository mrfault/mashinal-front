<template>
  <component :is="tag" :class="classes" @click="showSteps = true">
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
            <h4 v-if="currentRealStep !== 10">{{ stepInfoTitle }}
              <popover name="hint" class="wider"
                v-if="stepHints[currentRealStep]"
                :width="isMobileBreakpoint ? 240 : 550"
                :message="$t('fields_pointed_with_arrow')"
              >
                <img :src="`/img/docs/${img}.jpg`" alt="" v-for="img in (stepHints[currentRealStep].imgs || [])" :key="img" />
              </popover>
            </h4>
          </div>
          <div class="row">
            <div :class="currentRealStep === 10 ? 'col-lg-12' : 'col-lg-4'">
              <div :class="{[isMobileBreakpoint ? 'mb-4' : 'card-bordered']: currentRealStep !== 10}">
                <component
                  :is="`step-${currentRealStep}`"
                  @next="increaseStep"
                  @confirm="finished = true, showSteps = false, showPaymentModal = true"
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
    <modal-popup
      :toggle="showPaymentModal"
      :title="$t('payment')"
      :overflow-hidden="isMobileBreakpoint"
      @close="showPaymentModal = false, close()"
    >
      <h4 class="mb-2">{{ $t('payment_method') }}</h4>
<!--      <form-buttons v-model="paymentMethod" :options="paymentMethodOptions" :group-by="2" />-->
      <select-banking-card v-model="bankingCard" class="mt-2 mt-lg-3" v-show="paymentMethod === 'card'" />
<!--      <terminal-info-button popup-name="letter-of-attorney-popup" />-->
      <div :class="{'modal-sticky-bottom': isMobileBreakpoint}">
        <hr/>
        <div class="row">
          <div class="col-6">
            <p class="text-medium mb-0">{{ $t('total') }}</p>
            <p class="text-medium text-dark-blue-2 mb-0">{{ price }} ₼</p>
          </div>
          <div class="col-6">
            <button :class="['btn btn--green full-width', { pending }]" @click.stop="pay">
              {{ $t('pay') }}
            </button>
          </div>
        </div>
      </div>
    </modal-popup>
    <terminal-info-popup
      name="letter-of-attorney-popup"
      @open="showPaymentModal = false"
      @close="showPaymentModal = true"
    />
  </component>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

import { PaymentMixin } from '~/mixins/payment';

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
    car: {},
    classes:{
      default:'btn btn--green-outline'
    },
    tag:{
      default:'button'
    }
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
  mixins: [PaymentMixin],
  data() {
    return {
      showSteps: false,
      finished: false,
      pending: false
    }
  },
  methods: {
    ...mapActions('letterOfAttorney', ['increaseStep', 'resetSteps', 'payForSubmission']),

    async pay() {
      if (this.pending) return;
      this.pending = true;
      try {
        const res = await this.payForSubmission({
          card_id: this.bankingCard,
          pay_type: this.paymentMethod,
          is_mobile: this.isMobileBreakpoint
        });
        if (this.paymentMethod === 'card' && !this.bankingCard) {
          this.pending = false;
          this.showPaymentModal = false;
          this.close();
          this.handlePayment(res, false, this.$t('letter_of_attorney_submitted'), 'v2');
        } else {
          await Promise.all([
            this.$nuxt.refresh(),
            this.$auth.fetchUser()
          ]);
          this.pending = false;
          this.showPaymentModal = false;
          this.bankingCard = '';
          this.close();
          this.updatePaidStatus({
            type: 'success',
            text: this.$t('letter_of_attorney_submitted'),
            title: this.$t('success_payment')
          });
        }
      } catch(err) {
        this.pending = false;
        console.error(err)
      }
    },
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
      let step = this.currentRealStep, type = this.stepSendData.letterType;
      return this.$t(`step_${step}_${step === 5 ? (type+'_') : ''}info_title`, { type: this.$t('letter_type_options')[type - 1] });
    },

    price() {
      return this.hasGeneralPower ? 24 : 12;
    },
    haveBalanceToPay() {
      return parseFloat(this.price) <= this.user.balance;
    }
  }
}
</script>
