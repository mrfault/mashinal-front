<template>
  <form class="form" @submit.prevent="submit" novalidate>
    <form-text-input class="mb-2 mb-lg-3"
      v-model="vehicleIdNumber" 
      :mask="$maskAlphaNumeric('*{+}', ' ')" 
      :placeholder="$t('license_serial_number')" 
      :invalid="$v.vehicleIdNumber.$error"
    />
    <form-text-input class="mb-2 mb-lg-3"
      v-model="vehicleIdGivenDate" 
      :placeholder="$t('license_given_date')" 
      :invalid="$v.vehicleIdGivenDate.$error"
      input-date
    />
    <button type="submit" :class="['btn btn--green full-width', { pending }]">
      {{ $t('go_further') }}
    </button>
  </form>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

import { required } from 'vuelidate/lib/validators';

export default {
  data() {
    return {
      pending: false
    }
  },
  validations: {
    vehicleIdNumber: { required },
    vehicleIdGivenDate: { required }
  },
  computed: {
    ...mapGetters('letterOfAttorney', ['stepSendData']),

    vehicleIdNumber: {
      get() { 
        return this.stepSendData.vehicleIdNumber;
      },
      set(value) { 
        this.updateSendData({ key: 'vehicleIdNumber', value });
      }
    },
    vehicleIdGivenDate: {
      get() { 
        return this.stepSendData.vehicleIdGivenDate
      },
      set(value) { 
        this.updateSendData({ key: 'vehicleIdGivenDate', value });
      }
    }
  },
  methods: {
    ...mapActions('letterOfAttorney', ['updateSendData', 'updateReceivedData']),

    updateData() {
      
    },
    submit() {
      this.$v.$touch();
      if (this.pending || this.$v.$error) return;
      this.pending = true;
      try {
        this.pending = false;
        this.updateData();
        this.$emit('next');
      } catch (err) {
        this.pending = false;
      }
    }
  }
}
</script>