<template>
  <form class="form" @submit.prevent="submit" novalidate>
    <form-text-input class="mb-2 mb-lg-3"
      v-model="idFinCode" 
      :mask="$maskAlphaNumeric('*{+}', ' ')" 
      :placeholder="$t('id_fin_code')" 
      :invalid="$v.idFinCode.$error"
    />
    <form-text-input class="mb-2 mb-lg-3"
      v-model="idSerialNumber" 
      :mask="$maskAlphaNumeric('*{+}', ' ')" 
      :placeholder="$t('id_serial_number')" 
      :invalid="$v.idSerialNumber.$error"
    />
    <form-buttons class="mb-2 mb-lg-3" 
      v-model="letterType" 
      :options="letterTypeOptions" 
      :group-by="2" 
      :height-auto="true" 
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
    idFinCode: { required },
    idSerialNumber: { required }
  },
  computed: {
    ...mapGetters('letterOfAttorney', ['stepSendData']),

    letterType: {
      get() { 
        return this.stepSendData.letterType;
      },
      set(value) { 
        this.updateSendData({ key: 'letterType', value });
      }
    },
    idFinCode: {
      get() { 
        return this.stepSendData.idFinCode
      },
      set(value) { 
        this.updateSendData({ key: 'idFinCode', value });
      }
    },
    idSerialNumber: {
      get() { 
        return this.stepSendData.idSerialNumber;
      },
      set(value) { 
        this.updateSendData({ key: 'idSerialNumber', value });
      }
    },
    letterTypeOptions() {
      return [
        { key: 1, name: this.$t('letter_type_options')[0] },
        { key: 2, name: this.$t('letter_type_options')[1] }
      ]
    }
  },
  methods: {
    ...mapActions('letterOfAttorney', ['updateSendData', 'updateReceivedData']),

    updateData() {
      this.updateReceivedData([
        { 
          key: 'senderFullName', 
          value: 'Əhmədov Əhməd Məmməd oğlu' 
        },
        { 
          key: 'hasDriverLicense', 
          value: true 
        }
      ]);
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