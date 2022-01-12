<template>
  <form class="form" @submit.prevent="submit" novalidate>
    <form-text-input class="mb-2 mb-lg-3"
      v-model="driverLicenseNumber" 
      :mask="$maskAlphaNumeric('*{+}', ' ')" 
      :placeholder="$t('license_serial_number')" 
      :invalid="$v.driverLicenseNumber.$error"
    />
    <form-text-input class="mb-2 mb-lg-3"
      v-model="driverLicenseGivenDate" 
      :placeholder="$t('license_given_date')" 
      :invalid="$v.driverLicenseGivenDate.$error"
      input-date
    />
    <form-text-input class="mb-2 mb-lg-3"
      v-model="driverLicenseExpiryDate" 
      :placeholder="$t('date_till')" 
      :invalid="$v.driverLicenseExpiryDate.$error"
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
    driverLicenseNumber: { required },
    driverLicenseGivenDate: { required },
    driverLicenseExpiryDate: { required }
  },
  computed: {
    ...mapGetters('letterOfAttorney', ['stepSendData']),

    driverLicenseNumber: {
      get() { 
        return this.stepSendData.driverLicenseNumber;
      },
      set(value) { 
        this.updateSendData({ key: 'driverLicenseNumber', value });
      }
    },
    driverLicenseGivenDate: {
      get() { 
        return this.stepSendData.driverLicenseGivenDate
      },
      set(value) { 
        this.updateSendData({ key: 'driverLicenseGivenDate', value });
      }
    },
    driverLicenseExpiryDate: {
      get() { 
        return this.stepSendData.driverLicenseExpiryDate;
      },
      set(value) { 
        this.updateSendData({ key: 'driverLicenseExpiryDate', value });
      }
    }
  },
  methods: {
    ...mapActions('letterOfAttorney', ['updateSendData', 'checkOwnDriverLicense']),

    async submit() {
      this.$v.$touch();
      if (this.pending || this.$v.$error) return;
      this.pending = true;
      try {
        const isValid = await this.checkOwnDriverLicense();
        if (isValid) {
          this.pending = false;
          this.$emit('next');
        } else {
          this.pending = false;
          this.$toasted.error(this.$t('data_is_not_valid'));
        }
      } catch (err) {
        this.pending = false;
      }
    }
  }
}
</script>