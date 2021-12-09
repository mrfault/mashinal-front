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

import { required } from 'vuelidate/lib/validators';

export default {
  data() {
    return {
      pending: false
    }
  },
  validations: {
    idFinCodeB: { required },
    idSerialNumberB: { required }
  },
  computed: {
    ...mapGetters('letterOfAttorney', ['stepSendData']),

    idFinCodeB: {
      get() { 
        return this.stepSendData['5'].idFinCodeB
      },
      set(value) { 
        this.updateSendData({ step: 5, param: 'idFinCodeB', value });
      }
    },
    idSerialNumberB: {
      get() { 
        return this.stepSendData['5'].idSerialNumberB;
      },
      set(value) { 
        this.updateSendData({ step: 5, param: 'idSerialNumberB', value });
      }
    }
  },
  methods: {
    ...mapActions('letterOfAttorney', ['updateSendData', 'updateReceivedData']),

    updateData() {
      this.updateReceivedData([
        { 
          step: 5, 
          param: 'idFinCodeB', 
          value: this.idFinCodeB
        },
        { 
          step: 5, 
          param: 'idSerialNumberB', 
          value: this.idSerialNumberB 
        },
        { 
          step: 5, 
          param: 'recepientFullName', 
          value: 'İsmayılov Samir İdris oğlu' 
        }
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