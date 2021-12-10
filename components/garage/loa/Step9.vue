<template>
  <form class="form" @submit.prevent="submit" novalidate>
    <form-select 
      :label="$t('current_city')" 
      :options="sellOptions.regions" 
      :invalid="$v.region.$error" 
      :clear-option="false"
      has-search 
      v-model="region" 
      class="mb-2 mb-lg-3" 
    />
    <form-text-input 
      v-model="senderPhone"
      :placeholder="$t('mobile_phone_number')" 
      :invalid="$v.senderPhone.$error"
      :mask="$maskPhone()"
      autocomplete="tel"
      class="mb-2 mb-lg-3"
    />
    <form-text-input 
      v-model="recepientPhone"
      :placeholder="$t('recepient_mobile_phone_number')" 
      :invalid="$v.recepientPhone.$error"
      :mask="$maskPhone()"
      autocomplete="tel"
      class="mb-3"
    />
    <form-checkbox 
      :label="$t('letter_permissions_can_be_given')" 
      input-name="letter_permissions_can_be_given"
      v-model="letterPermissionsTransfer" 
      transparent skip-truncate
      class="mb-2 mb-lg-3"
    />
    <hr class="mt-0 mb-2 mb-lg-3" />
    <form-checkbox 
      :label="$t('letter_data_confirm')" 
      input-name="letter_data_confirm"
      v-model="letterConfirmData" 
      transparent skip-truncate
      class="mb-3"
    />
    <button type="submit" :class="['btn btn--green full-width', { pending, 'disabled': !letterConfirmData }]">
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
      pending: false,
    }
  },
  async fetch() {
    await this.getOptions();
    this.region = 1;
  },
  validations: {
    region: { required },
    senderPhone: { required },
    recepientPhone: { required }
  },
  computed: {
    ...mapGetters('letterOfAttorney', ['stepSendData']),
    ...mapGetters(['sellOptions']),

    region: {
      get() { 
        return this.stepSendData['9'].region
      },
      set(value) { 
        this.updateSendData({ step: 9, param: 'region', value });
      }
    },
    senderPhone: {
      get() { 
        return this.stepSendData['9'].senderPhone
      },
      set(value) { 
        this.updateSendData({ step: 9, param: 'senderPhone', value });
      }
    },
    recepientPhone: {
      get() { 
        return this.stepSendData['9'].recepientPhone
      },
      set(value) { 
        this.updateSendData({ step: 9, param: 'recepientPhone', value });
      }
    },
    letterPermissionsTransfer: {
      get() { 
        return this.stepSendData['9'].letterPermissionsTransfer
      },
      set(value) { 
        this.updateSendData({ step: 9, param: 'letterPermissionsTransfer', value });
      }
    },
    letterConfirmData: {
      get() { 
        return this.stepSendData['9'].letterConfirmData
      },
      set(value) { 
        this.updateSendData({ step: 9, param: 'letterConfirmData', value });
      }
    }
  },
  methods: {
    ...mapActions('letterOfAttorney', ['updateSendData']),
    ...mapActions(['getOptions']),

    updateData() {
      this.updateReceivedData([
        { 
          step: 9, 
          param: 'region', 
          value: this.region
        },
        { 
          step: 9, 
          param: 'senderPhone', 
          value: this.senderPhone 
        },
        { 
          step: 9, 
          param: 'recepientPhone', 
          value: this.recepientPhone
        },
        { 
          step: 9, 
          param: 'letterPermissionsTransfer', 
          value: this.letterPermissionsTransfer
        },
        { 
          step: 9, 
          param: 'letterConfirmData', 
          value: this.letterConfirmData
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