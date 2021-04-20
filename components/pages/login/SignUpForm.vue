<template>
  <form class="form sign-up" @submit.prevent="submit" novalidate>
    <div class="form-part">
      <p v-if="form.staticPhone">
        <span v-mask="maskPhone(true)">{{ sell_phone }}</span>
      </p>
      <input-text  
        :placeholder="$t('name')" 
        :maxlength="30"
        :invalid="validator.name.$error" 
        v-model="form.name"
      />
      <input-text  
        v-if="!form.staticPhone"
        autocomplete="tel" 
        :placeholder="$t('mobile_number')" 
        :invalid="validator.phone.$error" 
        :mask="maskPhone()"  
        v-model="form.phone"
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
    <button class="btn btn--green" type="submit">{{ actionText || $t('register')}}</button>
  </form>
</template>

<script>
  import { mapState } from 'vuex';

  export default {
    props: {
      form: {},
      validator: {},
      actionText: String
    },
    data() {
      return {
        pending: false
      }
    },
    computed: {
      ...mapState(['sell_phone'])
    },
    methods: {
      submit() {
        this.validator.$touch();
        if (this.pending || this.validator.$pending || this.validator.$error) return;
        this.pending = true;
        this.$axios.$post('/register', {
          name: this.form.name,
          phone: this.form.phone.replace(/[^0-9]+/g, ''),
          password: this.form.password,
          password_confirmation: this.form.passwordConfirm
        }).then(() => {
          this.pending = false;
          this.$emit('updateTab','sign-up','sms');
        }).catch((err) => {
          this.pending = false;
        });
      }
    },
    created() {
      this.$emit('reset');
    }
  }
</script>