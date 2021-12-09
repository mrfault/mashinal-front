<template>
  <form class="form" @submit.prevent="submit" novalidate>
    <form-text-input class="mb-2 mb-lg-3"
      v-model="birthDate" 
      :placeholder="$t('birth_date')" 
      :invalid="$v.birthDate.$error"
      input-date
    />
    <form-text-input class="mb-2 mb-lg-3"
      v-model="idExpiryDate" 
      :placeholder="$t('date_till')" 
      :invalid="$v.idExpiryDate.$error"
      input-date
    />
    <p class="mb-1">{{ $t('gender') }}</p>
    <form-buttons class="mb-2 mb-lg-3" 
      v-model="gender" 
      :options="getGenderOptions" 
      :group-by="2" 
      btn-class="primary-outline"
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
    birthDate: { required },
    idExpiryDate: { required }
  },
  computed: {
    ...mapGetters('letterOfAttorney', ['stepSendData']),

    birthDate: {
      get() { 
        return this.stepSendData['2'].birthDate
      },
      set(value) { 
        this.updateSendData({ step: 2, param: 'birthDate', value });
      }
    },
    idExpiryDate: {
      get() { 
        return this.stepSendData['2'].idExpiryDate;
      },
      set(value) { 
        this.updateSendData({ step: 2, param: 'idExpiryDate', value });
      }
    },
    gender: {
      get() { 
        return this.stepSendData['2'].gender;
      },
      set(value) { 
        this.updateSendData({ step: 2, param: 'gender', value });
      }
    },
    getGenderOptions() {
      return [
        { key: 1, name: this.$t('male')	},
        { key: 2, name: this.$t('female')	}
      ];
    }
  },
  methods: {
    ...mapActions('letterOfAttorney', ['updateSendData', 'updateReceivedData']),

    updateData() {
      this.updateReceivedData([
        { 
          step: 2, 
          param: 'gender', 
          value: this.getGenderOptions.findIndex(option => option.key === this.gender) 
        },
        { 
          step: 2, 
          param: 'birthDate', 
          value: this.birthDate 
        },
        { 
          step: 2, 
          param: 'idExpiryDate', 
          value: this.idExpiryDate 
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