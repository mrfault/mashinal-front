<template>
  <form class="form" @submit.prevent="submit" novalidate>
    <form-text-input class="mb-2 mb-lg-3"
      v-model="idFinCodeB" 
      :mask="$maskAlphaNumeric('*{+}', ' ')" 
      :placeholder="$t('id_fin_code')" 
      :invalid="$v.idFinCodeB.$error"
    />
    <form-text-input class="mb-2 mb-lg-3"
      v-model="idSerialNumberB" 
      :mask="$maskAlphaNumeric('*{+}', ' ')" 
      :placeholder="$t('id_serial_number')" 
      :invalid="$v.idSerialNumberB.$error"
    />
    <template v-if="!hasGeneralPower">
      <form-text-input class="mb-2 mb-lg-3"
        v-model="driverLicenseNumberB" 
        :mask="$maskAlphaNumeric('*{+}', ' ')" 
        :placeholder="$t('driver_license_serial_number')" 
        :invalid="$v.driverLicenseNumberB.$error"
      />
    </template>
    <div class="row">
      <div class="col">
        <button type="button" :class="['btn btn--green-outline full-width', { 'pending': pending && !confirmed }]" @click="check">
          <icon name="search" /> {{ $t('find') }}
        </button>
      </div>
      <div class="col">
        <button type="submit" :class="['btn btn--green full-width', { 'pending': pending && confirmed }]">
          {{ $t('go_further') }}
        </button>
      </div>
    </div>
  </form>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

import { required, requiredIf } from 'vuelidate/lib/validators';

export default {
  data() {
    return {
      pending: false,
      confirmed: false
    }
  },
  validations: {
    idFinCodeB: { required },
    idSerialNumberB: { required },
    driverLicenseNumberB: { required: requiredIf(function() { return !this.hasGeneralPower }) }
  },
  computed: {
    ...mapGetters('letterOfAttorney', ['stepSendData', 'hasGeneralPower']),

    idFinCodeB: {
      get() { 
        return this.stepSendData.idFinCodeB
      },
      set(value) { 
        this.updateSendData({ key: 'idFinCodeB', value });
      }
    },
    idSerialNumberB: {
      get() { 
        return this.stepSendData.idSerialNumberB;
      },
      set(value) { 
        this.updateSendData({ key: 'idSerialNumberB', value });
      }
    },
    driverLicenseNumberB: {
      get() { 
        return this.stepSendData.driverLicenseNumberB;
      },
      set(value) { 
        this.updateSendData({ key: 'driverLicenseNumberB', value });
      }
    }
  },
  methods: {
    ...mapActions('letterOfAttorney', ['updateSendData', 'checkOtherUserInfo', 'checkDriverLicense']),

    async submit(confirm = true) {
      this.$v.$touch();
      if (this.pending || this.$v.$error) return;
      this.pending = true;
      this.confirmed = confirm;
      try {
        const isValidLicense = !this.hasGeneralPower && await this.checkDriverLicense();
        if (isValidLicense || this.hasGeneralPower) {
          try {
            const isValid = await this.checkOtherUserInfo();
            if (isValid) {
              this.pending = false;
              confirm && this.$emit('next');
            } else {
              this.pending = false;
              this.$toasted.error(this.$t('data_is_not_valid'));
            }
          } catch (err) {
            this.pending = false;
          }
        } else {
          this.pending = false;
          this.$toasted.error(this.$t('data_is_not_valid'));
        }
      } catch (err) {
        this.pending = false;
      }
    },
    async check() {
      await this.submit(false);
    }
  }
}
</script>