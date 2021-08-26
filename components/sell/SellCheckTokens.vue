<template>
  <form class="form form--v2" @submit.prevent="checkPhone" novalidate>
    <div class="row">
      <div class="col-lg-6 mb-2 mb-lg-0">
        <form-text-input
          autocomplete="tel" 
          :placeholder="$t('mobile_number')" 
          :invalid="$v.form.phone.$error" 
          :mask="$maskPhone()"  
          v-model="form.phone"
        />
      </div>
      <div class="col-lg-6">
        <button type="submit" class="btn btn--green full-width">{{ $t('go_further') }}</button>
      </div>
    </div>
  </form>
</template>

<script>
import { mapActions } from 'vuex';

import { required } from 'vuelidate/lib/validators';
import { isPhoneNumber } from '~/lib/validators';

export default {
  data() {
    return {
      form: {
        phone: ''
      },
      pending: false
    }
  },
  validations: {
    form: {
      phone: { required, isPhoneNumber },
    }
  },
  methods: {
    ...mapActions(['checkSellTokens']),

    async checkPhone() {
      this.$v.$touch();
      if (this.pending || this.$v.$pending || this.$v.$error) return;
      this.pending = true;
      try {
        await this.checkSellTokens(this.form.phone.replace(/[^0-9]+/g, ''));
        this.mutate({ property: 'sellPhoneEntered', value: this.form.phone });
        this.pending = false;
      } catch(error) {
        this.pending = false;
      }
    }
  },
  async fetch() {
    this.form.phone = this.$parsePhone(this.$route.query.phone);
    if (this.form.phone) await this.checkPhone();
  }
}
</script>