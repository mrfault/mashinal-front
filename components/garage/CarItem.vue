<template>
  <div :class="['garage_car-item', { 'car-active': car.status === 1, 'thumb-set': thumbSet, active: active && !isMobileBreakpoint  }]" @click="showInfo">
    <div :class="['car-bg', {'no-img': !car.thumb && !thumbPending}]"
         :style="car.thumb && !thumbPending ? { backgroundImage: `url('${$withBaseUrl(car.thumb)}')` } : {}">
      <div class="car-bg-inner d-flex flex-column justify-content-between" v-if="!thumbSet">
        <div class="d-flex justify-content-end align-items-center">
          <button class="btn-sq btn-sq--color-red" @click.stop="showDeleteModal = true">
            <icon name="garbage" />
          </button>
        </div>
        <div class="d-flex justify-content-between align-items-center">
          <button class="btn-sq btn-sq--color-dark-blue-3" @click.stop="thumb.chooseFile()">
            <icon name="camera" />
          </button>
          <span class="date">{{ carDate }}</span>
        </div>
      </div>
      <loader v-if="thumbPending" />
      <croppa :class="['croppa-image auto-size']" 
        v-show="thumbSet && !thumbPending" @click.native.stop
        v-model="thumb" placeholder="" 
        :accept="'image/*'"
        :canvas-color="'transparent'"
        :zoom-speed="15" 
        :quality="1"
        :prevent-white-space="true" 
        :show-remove-button="false"
        :replace-drop="true"
        :auto-sizing="true"
        @new-image="updateThumbImage"
      >
        <button class="btn-sq btn-sq--color-dark-blue-3" @click.stop="saveThumb">
          <icon name="check" />
        </button>
        <button class="btn-sq btn-sq--color-dark-blue-3" @click.stop="removeThumb">
          <icon name="cross" />
        </button>
      </croppa>
    </div>
    <div class="car-info d-flex justify-content-between align-items-center">
      <span>{{ carNumber }}</span>
      <div class="text-status text-dark-blue-2" v-if="car.sync_status !== 1">
        {{ $t('processing') }}
      </div>
      <button :class="['btn btn--dark-blue-outline', { disabled: thumbSet }]" v-else-if="car.status === 1" @click.stop="showDeactivateModal = true">
        {{ $t('inactive_make') }}
      </button>
      <button :class="['btn btn--green', { pending: pending && !showDeleteModal && !showDeactivateModal && !showPaymentModal, disabled: thumbSet }]" v-else @click.stop="showPaymentModal = true">
        {{ $t('activate') }}
      </button>
    </div>
    <modal-popup
      :toggle="showDeleteModal"
      :title="$t('are_you_sure_you_want_to_delete_the_car')"
      @close="showDeleteModal = false"
    >
      <form class="form" @submit.prevent="deleteCar" novalidate>
        <button type="submit" :class="['btn btn--green full-width', { pending }]">
          {{ $t('confirm') }}
        </button>
      </form>
    </modal-popup>
    <modal-popup
      :toggle="showDeactivateModal"
      :title="$t('are_you_sure_you_want_to_deactivate_the_car')"
      @close="showDeactivateModal = false"
    >
      <form class="form" @submit.prevent="deactivateCar" novalidate>
        <button type="submit" :class="['btn btn--green full-width', { pending }]">
          {{ $t('confirm') }}
        </button>
      </form>
    </modal-popup>
    <modal-popup 
      :toggle="showPaymentModal" 
      :title="$t('payment')"
      :overflow-hidden="isMobileBreakpoint"
      @close="showPaymentModal = false"
    >
      <h4 class="mb-2">{{ $t('payment_method') }}</h4>
      <form-buttons v-model="paymentMethod" :options="paymentMethodOptions" :group-by="2" />
      <select-banking-card v-model="bankingCard" class="mt-2 mt-lg-3" v-show="paymentMethod === 'card'" />
      <terminal-info-button popup-name="garage-activate-popup" />
      <div :class="{'modal-sticky-bottom': isMobileBreakpoint}">
        <hr/>
        <div class="row">
          <div class="col-6">
            <p class="text-medium mb-0">{{ $t('total') }}</p>
            <p class="text-medium text-dark-blue-2 mb-0">{{ price }} ₼</p>
          </div>
          <div class="col-6">
            <button :class="['btn btn--green full-width', { pending }]" @click="activateCar">
              {{ $t('pay') }}
            </button>
          </div>
        </div>
      </div>
    </modal-popup>
    <terminal-info-popup 
      name="garage-activate-popup"
      @open="showPaymentModal = false" 
      @close="showPaymentModal = true"
    />
  </div>
</template>

<script>
import { mapActions } from 'vuex';

import { PaymentMixin } from '~/mixins/payment';

export default {
  props: {
    car: {},
    active: Boolean
  },
  mixins: [PaymentMixin],
  data() {
    return {
      pending: false,
      showDeleteModal: false,
      showDeactivateModal: false,
      thumb: null,
      thumbSet: false,
      thumbPending: false,
      price: 1
    }
  },
  computed: {
    carDate() {
      return this.$moment(this.car.created_date).format('DD.MM.YYYY');
    },
    carNumber() {
      return this.car.car_number.replace(/([A-Z]{1,2})/, ' $1 ');
    },
    haveBalanceToPay() {
      return parseFloat(this.price) <= this.user.balance;
    }
  },
  methods: {
    ...mapActions({
      activate: 'garage/activateCar',
      deactivate: 'garage/deactivateCar',
      delete: 'garage/deleteCar',
      uploadCarThumb: 'garage/uploadCarThumb'
    }),

    showInfo() {
      if (this.car.status !== 1 || (this.active && !this.isMobileBreakpoint)) return;
      this.$emit('set-active', this.car.id);
    },
    updateThumbImage() {
      this.thumbSet = true;
      this.$nextTick(() => {
        window.dispatchEvent(new Event('resize'));
      });
    },
    removeThumb() {
      this.thumb.remove();
      this.thumbSet = false;
    },
    async saveThumb() {
      this.thumbPending = true;
      let formData = new FormData();
      formData.append('id', this.car.id);
      let thumb = await this.thumb?.promisedBlob('image/jpeg', 0.8);
      formData.append('thumb', thumb);
      await this.uploadCarThumb(formData);
      this.$toasted.success(this.$t('image_uploaded'));
      this.thumbPending = false;
      this.removeThumb();
    },
    async activateCar() {
      if (this.pending || this.thumbSet) return;
      this.pending = true;
      try {
        const res = await this.activate({
          id: this.car.id,
          card_id: this.bankingCard,
          pay_type: this.paymentMethod,
          is_mobile: this.isMobileBreakpoint
        });
        if (this.paymentMethod === 'card' && !this.bankingCard) {
          this.pending = false;
          this.showPaymentModal = false;
          this.handlePayment(res, false, this.$t('car_activated'), 'v2');
        } else {
          await Promise.all([
            this.$nuxt.refresh(),
            this.$auth.fetchUser()
          ]);
          this.pending = false;
          this.showPaymentModal = false;
          this.bankingCard = '';
          this.updatePaidStatus({ 
            type: 'success', 
            text: this.$t('car_activated'), 
            title: this.$t('success_payment') 
          });
        }
      } catch(err) {
        this.pending = false;
      }
    },
    async deactivateCar() {
      if (this.pending || this.thumbSet) return;
      this.pending = true;
      try {
        await this.deactivate({ id: this.car.id });
        this.$toasted.success(this.$t('car_deactivated'));
        this.pending = false;
        this.showDeactivateModal = false;
      } catch(err) {
        this.pending = false;
      }
    },
    async deleteCar() {
      if (this.pending) return;
      this.pending = true;
      try {
        await this.delete({ id: this.car.id });
        this.$toasted.success(this.$t('car_deleted'));
        this.pending = false;
        this.showDeleteModal = false;
        this.scrollReset();
      } catch(err) {
        this.pending = false;
      }
    }
  }
}
</script>