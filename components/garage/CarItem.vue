<template>
  <div :class="['garage_car-item', { 'car-active': car.status === 1, 'thumb-set': thumbSet }]" @click="showInfo">
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
      <button :class="['btn btn--dark-blue-outline', { disabled: thumbSet }]" v-if="car.status === 1" @click.stop="showDeactivateModal = true">
        {{ $t('inactive_make') }}
      </button>
      <button :class="['btn btn--green', { pending: pending && !showDeleteModal && !showDeactivateModal, disabled: thumbSet }]" v-else @click.stop="activateCar">
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
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import Loader from '../elements/Loader.vue';

export default {
  components: { Loader },
  props: {
    car: {}
  },
  data() {
    return {
      pending: false,
      showDeleteModal: false,
      showDeactivateModal: false,
      thumb: null,
      thumbSet: false,
      thumbPending: false
    }
  },
  computed: {
    carDate() {
      return this.$moment(this.car.created_date).format('DD.MM.YYYY');
    },
    carNumber() {
      return this.car.car_number.replace(/([A-Z]{1,2})/, ' $1 ');
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
      if (this.car.status !== 1) return;
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
      formData.append('car_id', this.car.id);
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
        await this.activate({ id: this.car.id });
        this.$toasted.success(this.$t('car_activated'));
        this.pending = false;
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
        const res = await this.delete({ id: this.car.id });
        if (res.status === 'success') {
          this.$toasted.success(this.$t('car_deleted'));
          this.pending = false;
          this.showDeleteModal = false;
          this.scrollReset();
        }
      } catch(err) {
        this.pending = false;
      }
    }
  }
}
</script>