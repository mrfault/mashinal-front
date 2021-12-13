<template>
  <form class="form" @submit.prevent="submit" novalidate>
    <template v-if="showCheckboxes">
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
    <button type="submit" :class="['btn btn--green full-width', { pending, 'disabled': showCheckboxes && !letterConfirmData }]">
      {{ $t('go_further') }}
    </button>
  </form>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  data() {
    return {
      pending: false
    }
  },
  computed: {
    ...mapGetters('letterOfAttorney', ['stepSendData']),

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
    },
    showCheckboxes() {
      return this.stepSendData['1'].letterType === 1;
    }
  },
  methods: {
    ...mapActions('letterOfAttorney', ['updateSendData']),

    updateData() {
      if (this.showCheckboxes) {
        this.updateReceivedData([
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
      }
    },
    submit() {
      if (this.pending) return;
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