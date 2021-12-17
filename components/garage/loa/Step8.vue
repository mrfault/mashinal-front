<template>
  <form class="form" @submit.prevent="submit" novalidate>
    <form-text-input class="mb-2 mb-lg-3"
      v-model="letterExpiryDate" 
      :placeholder="$t('date_till')"
      :invalid="$v.letterExpiryDate.$error"
      :disabled-date="disabledDatesRange"
      @change="rangeShortcut = ''" 
      input-date
    />
    <div class="mb-2 mb-lg-3">
      <form-buttons 
        v-model="rangeShortcut" 
        :options="rangeShortcutOptions" 
        :group-by="2" 
        btn-class="primary-outline" 
        @change="handleExpiryDate"
      />
    </div>
    <template v-if="!hasGeneralPower">
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
    </template>
    <button type="submit" :class="['btn btn--green full-width', { pending, 'disabled': !hasGeneralPower && !letterConfirmData }]">
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
      rangeShortcut: ''
    }
  },
  validations: {
    letterExpiryDate: { required }
  },
  computed: {
    ...mapGetters('letterOfAttorney', ['stepSendData', 'stepReceivedData', 'hasGeneralPower']),

    letterPermissionsTransfer: {
      get() { 
        return this.stepSendData.letterPermissionsTransfer;
      },
      set(value) { 
        this.updateSendData({ key: 'letterPermissionsTransfer', value });
      }
    },
    letterConfirmData: {
      get() { 
        return this.stepSendData.letterConfirmData;
      },
      set(value) { 
        this.updateSendData({ key: 'letterConfirmData', value });
      }
    },
    letterExpiryDate: {
      get() { 
        return this.stepSendData.letterExpiryDate;
      },
      set(value) { 
        this.updateSendData({ key: 'letterExpiryDate', value });
      }
    },

    maxDate() {
      if (this.hasGeneralPower) {
        return this.$moment().add('1', 'years');
      } else {
        return this.$moment(this.stepReceivedData.driverLicenseExpiryDateB);
      }
    },
    rangeShortcutOptions() {
      return [
        { name: this.$readPlural(1, this.$t('plural_forms_week')), key: 1, params: ['1', 'weeks'] },
        { name: this.$readPlural(1, this.$t('plural_forms_month')), key: 3, params: ['1', 'months'] },
        { name: this.$readPlural(6, this.$t('plural_forms_month')), key: 5, params: ['6', 'months'] },
        { name: this.$readPlural(1, this.$t('plural_forms_year')), key: 6, params: ['1', 'years'] }
      ];
    }
  },
  methods: {
    ...mapActions('letterOfAttorney', ['updateSendData']),

    disabledDatesRange(date) {
      return date > this.maxDate;
    },
    handleExpiryDate(key) {
      let addParams = this.rangeShortcutOptions.find(option => option.key === key)?.params;
      if (!addParams) return;
      this.letterExpiryDate = this.$moment.min(this.maxDate, this.$moment().add(...addParams)).format('DD.MM.YYYY');
    },
    submit() {
      this.$v.$touch();
      if (this.$v.$error) return;
      this.$emit('next');
    }
  }
}
</script>