<template>
  <button :class="`btn btn--${btnClass}`" @click="showModal = true">
    <icon name="plus-circle" />
    {{ $t('add_car') }}
    <modal-popup 
      :toggle="showModal"
      :title="$t('add_car')"
      @close="showModal = false"
    >
      <form class="form" @submit.prevent="registerCarNumber">
        <form-text-input 
          class="mb-2 mb-lg-3"
          v-model="form.car_number" 
          :mask="'99 - A{2} - 999'"
          :placeholder="$t('car_number')" 
          :invalid="$v.form.car_number.$error"
        />
        <form-text-input 
          class="mb-2 mb-lg-3"
          v-model="form.tech_id" 
          :mask="{mask: '********', definitions: { '*': { casing: 'upper' } }}"
          :placeholder="$t('tech_id')" 
          :invalid="$v.form.tech_id.$error"
        />
        <div class="info-text mb-2"><icon name="alert-circle" /> 
          <span>{{ $t('garage_payment_info') }}</span>
        </div>
        <button type="submit" :class="['btn btn--green full-width', {pending} ]">
          {{ $t('go_further') }}
        </button>
      </form>
    </modal-popup>
  </button>
</template>

<script>
import { mapActions } from 'vuex';

import { required } from 'vuelidate/lib/validators';

export default {
  props: {
    btnClass: {
      type: String,
      default: 'green'
    }
  },
  data() {
    return {
      showModal: false,
      pending: false,
      form: {
        car_number: '',
        tech_id: '',
        operator: 1,
        phone: this.$store.state.auth.user?.phone || ''
      }
    }
  },
  validations: {
    form: {
      car_number: { required },
      tech_id: { required }
    }
  },
  methods: {
    ...mapActions({
      addNewCar: 'garage/addNewCar'
    }),

    async registerCarNumber() {
      this.$v.$touch();
      if (this.pending || this.$v.$pending || this.$v.$error) return;
      this.pending = true;
      try {
        const res = await this.addNewCar({
          ...this.form,
          car_number: this.form.car_number.replace(/-|[ ]/g, '')
        });
        this.pending = false;
        if (res.status === 'success') {
          this.$toasted.success(this.$t('car_added'));
          this.showModal = false;
          this.$v.$reset();
          this.form.car_number = '';
          this.form.tech_id = '';
          this.scrollReset();
        }
      } catch(err) {
        this.pending = false;
      }
    }
  }
}
</script>
