<template>
  <form class="form" @submit.prevent="submit" novalidate>
    <form-text-input class="mb-2 mb-lg-3"
      v-model="finCode" 
      :mask="$maskAlphaNumeric('*{+}', ' ')" 
      :placeholder="$t('id_fin_code')" 
      :invalid="$v.finCode.$error"
      has-popover
    >
      <popover name="fin-code" :width="190">
        -----
      </popover>
    </form-text-input>
    <form-text-input class="mb-2 mb-lg-3"
      v-model="serialNumber" 
      :mask="$maskAlphaNumeric('*{+}', ' ')" 
      :placeholder="$t('id_serial_number')" 
      :invalid="$v.serialNumber.$error"
      has-popover
    >
      <popover name="fin-code" :width="190">
        -----
      </popover>
    </form-text-input>
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
    finCode: { required },
    serialNumber: { required }
  },
  computed: {
    ...mapGetters('letterOfAttorney', ['stepSendData']),

    letterType: {
      get() { 
        return this.stepSendData['1'].letterType;
      },
      set(value) { 
        this.updateSendData({ step: 1, param: 'letterType', value });
      }
    },
    finCode: {
      get() { 
        return this.stepSendData['1'].finCode
      },
      set(value) { 
        this.updateSendData({ step: 1, param: 'finCode', value });
      }
    },
    serialNumber: {
      get() { 
        return this.stepSendData['1'].serialNumber;
      },
      set(value) { 
        this.updateSendData({ step: 1, param: 'serialNumber', value });
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

    submit() {
      this.$v.$touch();
      if (this.pending || this.$v.$error) return;
      this.pending = true;
      try {
        this.pending = false;
        this.updateReceivedData({ 
          step: 1, 
          param: 'letterType', 
          value: this.letterTypeOptions.findIndex(option => option.key === this.letterType) 
        });
        this.$emit('next');
      } catch (err) {
        this.pending = false;
      }
    }
  }
}
</script>