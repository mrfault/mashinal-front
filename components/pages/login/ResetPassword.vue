<template>
  <form class="form reset-password" @submit.prevent="submit" novalidate>
    <div class="form-part">
      <input-text
        :placeholder="$t('enter_the_code')" 
        :mask="'99999'"
        :invalid="validator.code.$error" 
        v-model="form.code"
      />
      <input-text
        type="password"
        autocomplete="new-password" 
        :maxlength="255"
        :placeholder="$t('password')" 
        :invalid="validator.password.$error" 
        v-model="form.password"
      />
      <input-text
        type="password"
        autocomplete="new-password" 
        :maxlength="255"
        :placeholder="$t('confirm_password')" 
        :invalid="validator.passwordConfirm.$error" 
        v-model="form.passwordConfirm"
      />
    </div>
    <p class="info-text"><icon name="info-circle" /> {{ $t('enter_the_code_sent_to_your_number')}}</p>
    <button class="btn btn--green" type="submit">{{$t('restore_password')}}</button>
  </form>
</template>

<script>
  export default {
    props: {
      form: {},
      validator: {}
    },
    data() {
      return {
        pending: false
      }
    },
    methods: {
      submit() {
        this.validator.$touch();
        if (this.pending || this.validator.$pending || this.validator.$error) return;
        this.pending = true;
        this.$axios.$post('/reset/password', {
          phone: this.form.phone.replace(/[^0-9]+/g, ''),
          code: this.form.code,
          password: this.form.password,
          password_confirmation: this.form.passwordConfirm
        }).then(() => {
          this.pending = false;
          this.$emit('updateTab','sign-in');
        }).catch((err) => {
          this.pending = false;
        });
      }
    }
  }
</script>