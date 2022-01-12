<template>
  <div class="newsletter">
    <form class="form" @submit.prevent="subscribe" novalidate>
      <input type="text" v-model="form.email" :placeholder="$t('email')" :class="{'invalid': $v.form.email.$error }" />
      <button type="submit" class="btn btn--green">{{ $t('subscribe') }}</button>
    </form>
  </div>
</template>

<script>
import { required, email } from 'vuelidate/lib/validators';

export default {
  data() {
    return {
      pending: false,
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
      if (this.pending || this.$v.$error) return;
      this.pending = true;
      this.$axios.$post('/subscribe', this.form).then((res) => {
        this.pending = false;
        this.$toasted.success(res.message);
        this.$v.$reset();
        this.form.email = '';
      }).catch((err) => {
        this.pending = false;
      });
    }
  }
}
</script>