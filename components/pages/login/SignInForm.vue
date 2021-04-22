<template>
  <form class="form sign-in" @submit.prevent="submit" novalidate>
    <div class="form-part">
      <p v-if="form.staticPhone">
        <span v-mask="maskPhone(true)">{{ sell_phone }}</span>
      </p>
      <input-text v-else
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
        :invalid="validator.password.$error || passwordWrong" 
        v-model="form.password"
        @input="passwordWrong = false"
      />
    </div>
    <p class="info-text" v-if="form.staticPhone"><icon name="info-circle" /> {{ $t('login_before_announce') }}</p>
    <p><span class="cursor-pointer" @click="$emit('updateTab','sign-in','forgot')">{{ $t('forgot_your_password')}}</span></p>
    <button class="btn btn--green" type="submit">{{ actionText || $t('login') }}</button>
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
        pending: false,
        passwordWrong: this.form.passwordWrong
      }
    },  
    computed: {
      ...mapState(['sell_phone'])
    },
    methods: {
      submit() {
        // form submit handler
        this.validator.$touch();
        if (this.pending || this.validator.$pending || this.validator.$error) return;
        this.pending = true;
        this.$auth.loginWith('laravelJWT', {
          data: {
            phone: this.form.phone.replace(/[^0-9]+/g, ''),
            password: this.form.password
          }
        }).then(()=>{
          this.pending = false;
          this.$emit('login');
        }).catch(({response}) => {
          this.pending = false;
          if(response.status === 401) {
            this.passwordWrong = true;
          } else if(response.status === 406) {
            this.$emit('updateTab','sign-up','sms', response.data.data);
          }
        });
      }
    }
  }
</script>