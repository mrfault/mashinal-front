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
      pending: false,
      rangeShortcut: ''
    }
  },
  validations: {
    letterExpiryDate: { required }
  },
  computed: {
    ...mapGetters('letterOfAttorney', ['stepSendData', 'stepReceivedData', 'hasGeneralPower']),

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
        if(this.stepReceivedData.maxExpiryDate) {
          return this.$moment(this.stepReceivedData.maxExpiryDate)
        }

        return this.$moment().add('1', 'years');

      } else {
        if(this.stepReceivedData.maxExpiryDate) {
          let start = this.$moment(this.stepReceivedData.maxExpiryDate);
          let end = this.$moment(this.stepReceivedData.driverLicenseExpiryDateB);
          if(this.$moment.duration(end.diff(start)).asDays() > 0) {
            return start;
          }
        }
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
