<template>
  <form class="form" @submit.prevent="submit" novalidate>
    <form-text-input class="mb-2 mb-lg-3"
      v-model="transportNumber" 
      :mask="$maskAlphaNumeric('*{+}', ' ')" 
      :placeholder="$t('registered_number')" 
      :invalid="$v.transportNumber.$error"
    />
    <form-text-input class="mb-2 mb-lg-3"
      v-model="transportGivenDate" 
      :placeholder="$t('license_given_date')" 
      :invalid="$v.transportGivenDate.$error"
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
    transportNumber: { required },
    transportGivenDate: { required }
  },
  computed: {
    ...mapGetters('letterOfAttorney', ['stepSendData']),

    transportNumber: {
      get() { 
        return this.stepSendData['4'].transportNumber;
      },
      set(value) { 
        this.updateSendData({ step: 4, param: 'transportNumber', value });
      }
    },
    transportGivenDate: {
      get() { 
        return this.stepSendData['4'].transportGivenDate
      },
      set(value) { 
        this.updateSendData({ step: 4, param: 'transportGivenDate', value });
      }
    }
  },
  methods: {
    ...mapActions('letterOfAttorney', ['updateSendData', 'updateReceivedData']),

    updateData() {
      this.updateReceivedData([
        { 
          step: 4, 
          param: 'transportNumber', 
          value: this.transportNumber 
        },
        { 
          step: 4, 
          param: 'transportGivenDate', 
          value: this.transportGivenDate 
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