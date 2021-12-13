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
        <button type="button" :class="['btn btn--green-outline full-width', { pending }]" @click="check">
          <icon name="search" /> {{ $t('find') }}
        </button>
      </div>
      <div class="col">
        <button type="submit" :class="['btn btn--green full-width', { pending }]">
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
      pending: false
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
    ...mapActions('letterOfAttorney', ['updateSendData', 'updateReceivedData']),

    updateData() {
      this.updateReceivedData([
        { key: 'recepientFullName', value: 'İsmayılov Samir İdris oğlu' }
      ]);
    },
    check() {
      this.$v.$touch();
      if (this.pending || this.$v.$error) return;
      this.pending = true;
      try {
        this.pending = false;
        this.updateData();
      } catch (err) {
        this.pending = false;
      }
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