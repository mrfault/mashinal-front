<template>
  <form class="form" @submit.prevent="submit" novalidate>
    <form-text-input
      v-model="region"
      :placeholder="$t('current_city')"
      :invalid="$v.region.$error"
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
      class="mb-2 mb-lg-3 white-space-pre-wrap"
    />
    <hr class="mt-0 mb-2 mb-lg-3" />
    <form-checkbox
      :label="$t('letter_data_confirm')"
      input-name="letter_data_confirm"
      v-model="letterConfirmData"
      transparent skip-truncate
      class="mb-3 white-space-pre-wrap"
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
  validations: {
    region: { required },
    senderPhone: { required },
    recepientPhone: { required }
  },
  computed: {
    ...mapGetters('letterOfAttorney', ['stepSendData']),

    region: {
      get() {
        return this.stepSendData.region
      },
      set(value) {
        this.updateSendData({ key: 'region', value });
      }
    },
    senderPhone: {
      get() {
        return this.stepSendData.senderPhone
      },
      set(value) {
        this.updateSendData({ key: 'senderPhone', value });
      }
    },
    recepientPhone: {
      get() {
        return this.stepSendData.recepientPhone
      },
      set(value) {
        this.updateSendData({ key: 'recepientPhone', value });
      }
    },
    letterPermissionsTransfer: {
      get() {
        return this.stepSendData.letterPermissionsTransfer
      },
      set(value) {
        this.updateSendData({ key: 'letterPermissionsTransfer', value });
      }
    },
    letterConfirmData: {
      get() {
        return this.stepSendData.letterConfirmData
      },
      set(value) {
        this.updateSendData({ key: 'letterConfirmData', value });
      }
    }
  },
  methods: {
    ...mapActions('letterOfAttorney', ['updateSendData', 'checkAllData']),

    async submit() {
      this.$v.$touch();
      if (this.pending || this.$v.$error) return;

      this.pending = true;
      try {
        const isValid = await this.checkAllData();
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
