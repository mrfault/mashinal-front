<template>
  <div :class="['garage_car-item', { 'car-active': car.status === 1 }]" @click="$emit('set-active', car.id)">
    <div class="car-bg d-flex flex-column justify-content-between">
      <div class="d-flex justify-content-end align-items-center">
        <button class="btn-sq btn-sq--color-red" @click.stop="showDeleteModal = true">
          <icon name="garbage" />
        </button>
      </div>
      <div class="d-flex justify-content-between align-items-center">
        <button class="btn-sq btn-sq--color-dark-blue-3" @click.stop>
          <icon name="camera" />
        </button>
        <span class="date">{{ carDate }}</span>
      </div>
    </div>
    <div class="car-info d-flex justify-content-between align-items-center">
      <span>{{ carNumber }}</span>
      <button :class="['btn btn--dark-blue-outline', { pending: pending && !showDeleteModal }]" v-if="car.status === 1" @click.stop="deactivateCar">
        {{ $t('inactive_make') }}
      </button>
      <button :class="['btn btn--green', { pending: pending && !showDeleteModal }]" v-else @click.stop="activateCar">
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
  </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  props: {
    car: {}
  },
  data() {
    return {
      pending: false,
      showDeleteModal: false
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
      delete: 'garage/deleteCar'
    }),

    async activateCar() {
      if (this.pending) return;
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
      if (this.pending) return;
      this.pending = true;
      try {
        await this.deactivate({ id: this.car.id });
        this.$toasted.success(this.$t('car_deactivated'));
        this.pending = false;
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