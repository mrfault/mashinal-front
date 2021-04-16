<template>
  <form class="form confirm-sms-code" @submit.prevent="submit" novalidate>
    <div class="form-part">
      <input-text
        :placeholder="$t('enter_the_code')" 
        :mask="'99999'"
        :invalid="validator.code.$error" 
        v-model="form.code"
      />
    </div>
    <p class="info-text"><icon name="info-circle" /> {{ $t('enter_the_code_sent_to_your_number')}}</p>
    <button class="btn btn--green" type="submit">{{ actionText || $t('confirm')}}</button>
    <p v-if="showResend || codeSent || askToCallSupport"> 
      <span v-if="showResend && resendSmsAfterSecond === 0" class="cursor-pointer" @click="resendCode">{{ $t('resend_code') }}</span>
      <span v-else-if="showResend && resendSmsAfterSecond > 0">{{ $t('resend_code_after') }}:
        <timer format="i:s" :duration="resendSmsAfterSecond" @timeOver="resendSmsAfterSecond = 0" />
      </span>
      <span v-else-if="codeSent">{{ $t('code_has_been_sent') }}</span>
      <span v-else-if="askToCallSupport">{{ $t('please_call_to_support') }}</span>
    </p>
  </form>
</template>

<script>
  export default {
    props: {
      form: {},
      validator: {},
      actionText: String,
      skipSignIn: Boolean,
      resendData: {
        default: {}
      }
    },
    data() {
      return {
        showResend: this.resendData.showResend || true,
        resendSmsAfterSecond: this.resendData.resendSmsAfterSecond || 30,
        codeSent: this.resendData.showResend === undefined || false,
        askToCallSupport: this.resendData.showResend === false || false
      }
    },
    methods: {
      resendCode() {
        this.showResend = false;
        this.$nuxt.$emit('loading', true);
        this.$axios.$post('/resend/code', {
          phone: this.form.phone.replace(/[^0-9]+/g, ''),
        }).then((res) => {
          this.codeSent = true;
          this.$nuxt.$emit('loading', false);
        });
      },
      submit() {
        this.validator.$touch();
        if (this.validator.$pending || this.validator.$error) return;
        this.$nuxt.$emit('loading', true);
        this.$axios.$post('/confirm/phone', {
          phone: this.form.phone.replace(/[^0-9]+/g, ''),
          code: this.form.code
        }).then(() => {
          // track conversion
          this.fbTrack('Complete Registration Api');
          this.gtagTrack('AW-600951956/-O6CCJGB2fIBEJSZx54C');
          // move to login
          this.$nuxt.$emit('loading', false);
          if(this.skipSignIn) {
            this.$auth.loginWith('laravelJWT', {
              data: {
                phone: this.form.phone.replace(/[^0-9]+/g, ''),
                password: this.form.password || this.form.code
              }
            }).then(()=>{
              this.$emit('login');
            });
          } else {
            this.$emit('updateTab','sign-in');
          }
        });
      }
    }
  }
</script>