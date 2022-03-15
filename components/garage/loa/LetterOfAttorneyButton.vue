<template>
  <component :is="tag" :class="classes" @click="showVehicles">
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
        <steps-progress  :finished="finished" />
        <template v-if="!finished">
          <div class="mt-2 mt-lg-0 mb-2 mb-lg-3">
            <h4 v-if="currentRealStep !== 10">
              {{ stepInfoTitle }}
              <popover
                name="hint"
                class="wider"
                v-if="stepHints[currentRealStep]"
                :width="isMobileBreakpoint ? 240 : 550"
                :message="$t('fields_pointed_with_arrow')"
              >
                <img
                  :src="`/img/docs/${img}.jpg`"
                  alt=""
                  v-for="img in (stepHints[currentRealStep].imgs || [])"
                  :key="img"
                />
              </popover>
            </h4>
          </div>
          <div class="row">
            <div :class="currentRealStep === 10 ? 'col-lg-12' : 'col-lg-4'">
              <div
                :class="{
                  [isMobileBreakpoint ? 'mb-4' : 'card-bordered']:
                    currentRealStep !== 10,
                }"
              >
                <component
                  :is="`step-${currentRealStep}`"
                  @next="increaseStep"
                  @confirm="finished = true, showPaymentModal = true"
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
      @close="
        showPaymentModal = false
        finished = false
        updateStep(1)
      "
    >
      <h4 class="mb-2">{{ $t('payment_method') }}</h4>
      <!--      <form-buttons v-model="paymentMethod" :options="paymentMethodOptions" :group-by="2" />-->
      <select-banking-card v-model="bankingCard" class="mt-2 mt-lg-3" />
      <!--      <terminal-info-button popup-name="letter-of-attorney-popup" />-->
      <div :class="{ 'modal-sticky-bottom': isMobileBreakpoint }">
        <hr />
        <div class="row">
          <div class="col-6">
            <p class="text-medium mb-0">{{ $t('total') }}</p>
            <p class="text-medium text-dark-blue-2 mb-0">{{ price }} ₼</p>
          </div>
          <div class="col-6">
            <button
              :class="['btn btn--green full-width', { pending }]"
              @click.stop="pay"
            >
              {{ $t('pay') }}
            </button>
          </div>
        </div>
      </div>
    </modal-popup>

    <modal-popup
      :toggle="showRedirect"
      :title="$t('send_a_letter_of_attorney')"
      :title-logo="isDarkMode ? '/asan_logo_dark_mode.svg' : '/asan_logo.svg'"
      :overflow-hidden="isMobileBreakpoint"
      @close="showRedirect = false"
    >
      <p>{{ $t('asan_login_redirect') }}</p>
      <div
        class="align-items-center d-flex justify-content-center position-relative"
      >
        <animated-spinner />
        <span style="position: absolute;">{{ timer }}</span>
      </div>
    </modal-popup>
    <terminal-info-popup
      name="letter-of-attorney-popup"
      @open="showPaymentModal = false"
      @close="showPaymentModal = true"
    />
    <modal-popup
      :modal-class="'attorney-vehicles'"
      :toggle="showVehicleList"
      :title="$t('send_a_letter_of_attorney')"
      :overflow-hidden="isMobileBreakpoint"
      @close="
        showVehicleList = false
        close()
      "
    >
      <div class="attorney-before-step1">
        <h4 style="font-weight: normal;">{{ $t('letter_type') }}</h4>
        <form-buttons
          @change="getVehicles($event === 2)"
          v-model="letterType"
          class="mb-2 mb-lg-3"
          :options="letterTypeOptions"
          :group-by="isMobileBreakpoint ? 2 : 3"
          :height-auto="true"
        />
        <template v-if="Object.keys(vehicles).length">
          <h4 style="font-weight: normal;">{{ $t('vehicle_list') }}</h4>
          <vue-scroll>
            <div class="attorney_scrollview">
              <h4 class="sub-category" v-if="vehicles.ownVehicles.length">
                {{ $t('own_vehicles') }}
              </h4>
              <div class="vehicle-list">
                <div class="row">
                  <div
                    class="col-md-4 col-6 mb-2"
                    v-for="(item, index) in vehicles.ownVehicles"
                    :key="index"
                  >
                    <div
                      class="garage_car-item car-active attorney-vehicle"
                      @click="selectVehicle(item)"
                    >
                      <div
                        class="car-bg no-img car-bg-custom-size"
                        :style="
                          item.image
                            ? `background-size: 75%;background-image: url('${item.image}')`
                            : ''
                        "
                      ></div>
                      <div
                        class="car-info vehicle-info"
                        :class="{
                          active: stepSendData.carNumber === item.vehicleNumber,
                        }"
                      >
                        <span>{{ item.vehicleNumber }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <h4
                class="sub-category mt-2"
                v-if="vehicles.canTransferVehicles.length"
              >
                {{ $t('transferable_vehicles') }}
              </h4>
              <div class="vehicle-list">
                <div class="row">
                  <div
                    class="col-md-4 col-6 mb-2"
                    v-for="(item, index) in vehicles.canTransferVehicles"
                    :key="index"
                  >
                    <div
                      class="garage_car-item car-active attorney-vehicle"
                      @click="selectVehicle(item)"
                    >
                      <div
                        class="car-bg no-img car-bg-custom-size"
                        :style="
                          item.image
                            ? `background-size: 75%;background-image: url('${item.image}')`
                            : ''
                        "
                      ></div>
                      <div
                        class="car-info vehicle-info"
                        :class="{
                          active: stepSendData.carNumber === item.vehicleNumber,
                        }"
                      >
                        <span>{{ item.vehicleNumber }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </vue-scroll>
        </template>
        <hr />
        <div class="d-flex justify-content-end">
          <button
            @click="continueToSteps"
            class="btn btn-primary btn--green"
            style="padding: 0 50px;"
            :class="{ pending }"
          >
            {{ $t('go_further') }}
          </button>
        </div>
      </div>
    </modal-popup>
  </component>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

import { PaymentMixin } from '~/mixins/payment'

import StepsProgress from '~/components/garage/loa/StepsProgress'
import StepsSummary from '~/components/garage/loa/StepsSummary'
import Step1 from '~/components/garage/loa/Step1'
import Step2 from '~/components/garage/loa/Step2'
import Step3 from '~/components/garage/loa/Step3'
import Step4 from '~/components/garage/loa/Step4'
import Step5 from '~/components/garage/loa/Step5'
import Step6 from '~/components/garage/loa/Step6'
import Step7 from '~/components/garage/loa/Step7'
import Step8 from '~/components/garage/loa/Step8'
import Step9 from '~/components/garage/loa/Step9'
import Step10 from '~/components/garage/loa/Step10'
import Asan_login from '~/mixins/asan_login'
import AnimatedSpinner from '~/components/elements/AnimatedSpinner'

export default {
  props: {
    car: {},
    classes: {
      default: 'btn btn--green-outline',
    },
    tag: {
      default: 'button',
    },
  },
  components: {
    AnimatedSpinner,
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
    Step10,
  },
  mixins: [PaymentMixin, Asan_login],
  data() {
    return {
      vehicles: {},
      showVehicleList: false,
      showSteps: false,
      finished: false,
      pending: false,
    }
  },
  mounted() {
    if (this.$route.query.hasOwnProperty('attorney')) this.showVehicles()
  },
  methods: {
    ...mapActions('letterOfAttorney', [
      'increaseStep',
      'updateStep',
      'resetSteps',
      'resetAllSteps',
      'payForSubmission',
      'updateSendData',
      'updateReceivedData',
    ]),
    selectVehicle(item) {

      this.updateReceivedData([
        { key: 'senderFullName', value: `${item.name} ${item.surname}` },
        { key: 'senderFatherName', value: item.fatherName },
      ])
      this.updateSendData({ key: 'carNumber', value: item.vehicleNumber })
    },
    continueToSteps() {
      if (this.stepSendData.carNumber){
        this.showVehicleList = false;
        this.showSteps = true;
      }

    },
    async getVehicles(isGeneral) {
      this.updateSendData({ key: 'carNumber', value: null })
      this.pending = true
      const data = await this.$axios.$get(
        '/attorney/get_vehicle_list/' + isGeneral,
      )
      this.pending = false
      this.$set(this, 'vehicles', data)
    },
    async showVehicles() {
      if (!this.$auth.loggedIn)
        return await this.$router.push(
          this.$localePath('/login?param=attorney'),
        )
      await this.asanLogin()
      this.showVehicleList = true
    },

    async pay() {
      if (this.pending) return
      this.pending = true
      try {
        const res = await this.payForSubmission({
          card_id: this.bankingCard,
          pay_type: this.paymentMethod,
          is_mobile: this.isMobileBreakpoint,
        })
        if (this.paymentMethod === 'card' && !this.bankingCard) {
          this.pending = false
          this.showPaymentModal = false
          //this.close();
          this.handlePayment(
            res,
            false,
            this.$t('letter_of_attorney_submitted'),
            'v2',
          )
        } else {
          await Promise.all([this.$nuxt.refresh(), this.$auth.fetchUser()])
          this.pending = false
          this.showPaymentModal = false
          this.bankingCard = ''

          this.updatePaidStatus({
            type: 'success',
            text: this.$t('letter_of_attorney_submitted'),
            title: this.$t('success_payment'),
          })
          this.close()
        }
      } catch (err) {
        this.pending = false
        console.error(err)
      }
    },
    close() {
      this.finished = false
      this.showSteps = false
      this.showVehicleList = false
      this.vehicles = {}
      this.resetAllSteps()
    },
  },
  computed: {
    ...mapGetters('letterOfAttorney', [
      'stepSendData',
      'currentStep',
      'currentRealStep',
      'maxSteps',
      'hasGeneralPower',
    ]),
    letterTypeOptions() {
      return [
        { key: 1, name: this.$t('letter_type_options')[0] },
        { key: 2, name: this.$t('letter_type_options')[1] },
      ]
    },
    letterType: {
      get() {
        return this.stepSendData.letterType
      },
      set(value) {
        this.updateSendData({ key: 'letterType', value })
      },
    },
    stepHints() {
      return {
        1: { imgs: ['id-card'] },
        2: { imgs: ['id-card'] },
        3: { imgs: ['drivers-card-front', 'drivers-card-back'] },
        4: { imgs: ['tech-passport-front', 'tech-passport-back'] },
        5: {
          imgs: this.hasGeneralPower
            ? ['id-card']
            : ['id-card', 'drivers-card-front'],
        },
      }
    },
    stepInfoTitle() {
      let step = this.currentRealStep,
        type = this.stepSendData.letterType
      return this.$t(`step_${step}_${step === 5 ? type + '_' : ''}info_title`, {
        type: this.$t('letter_type_options')[type - 1],
      })
    },

    price() {
      return this.hasGeneralPower ? 24 : 12
    },
    haveBalanceToPay() {
      return parseFloat(this.price) <= this.user.balance
    },
  },
}
</script>

<style lang="scss">
.attorney-vehicles {
  @media screen and (min-width: 1025px) {
    width: 590px;
  }

  .attorney_scrollview {
    min-height: 255px;
    max-height: calc(100vh - 555px);
  }

  .car-bg {
    background-color: #fff;
  }
}

.attorney-vehicle {
  cursor: pointer;
  border: 1px solid #b6bbd5;

  .vehicle-info {
    border-top: 1px solid #b6bbd5;

    &.active {
      background: #d8e6f6;
    }
  }
}

.attorney-before-step1 {
  .sub-category {
    font-size: 15px;
    font-weight: normal;
    color: #246eb2;
  }
}
</style>
