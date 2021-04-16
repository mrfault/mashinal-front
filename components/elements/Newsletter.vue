<template>
  <div class="newsletter">
    <form class="form" @submit.prevent="subscribe">
      <input type="text" v-model="form.email" :placeholder="$t('email')" :class="{'invalid': $v.form.email.$error }" />
      <button class="btn btn--green" type="submit">{{ $t('subscribe') }}</button>
    </form>
  </div>
</template>

<script>
import { required, email } from 'vuelidate/lib/validators';

export default {
  data() {
    return {
      form: {
        email: ''
      }
    }
  },
  validations: {
    form: { 
      email: { required, email }
    }
  },
  methods: {
    async subscribe() {
      this.$v.$touch();
      if (this.$v.$pending || this.$v.$error) return;
      const res = await this.$axios.$post('/subscribe', this.form);
      this.$toasted.success(res.message);
      this.$v.$reset();
      this.form.email = '';
    }
  }
}
</script>