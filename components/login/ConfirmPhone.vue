<template>
  <form class="form confirm-sms-code" @submit.prevent="submit" novalidate>
    <div class="form-part">
      <form-text-input
        :placeholder="$t('enter_the_code')"
        :mask="'99999'"
        :invalid="validator.code.$error"
        v-model="form.code"
      />
    </div>
    <p class="info-text"><icon name="alert-circle" /> {{ $t('enter_the_code_sent_to_your_number')}}</p>
    <p v-if="showResend || codeSent || askToCallSupport">
      <span v-if="showResend && resendSmsAfterSecond === 0" class="cursor-pointer" @click="resendCode">{{ $t('resend_code') }}</span>
      <span v-else-if="showResend && resendSmsAfterSecond > 0">
        <template v-if="locale === 'ru'">{{ $t('resend_code_after') }} </template>
        <timer format="i:s" :duration="resendSmsAfterSecond" @timeOver="resendSmsAfterSecond = 0" />
        <template v-if="locale === 'az'"> {{ $t('resend_code_after') }}</template>
      </span>
      <span v-else-if="codeSent">{{ $t('code_has_been_sent') }}</span>
      <span v-else-if="askToCallSupport">{{ $t('please_call_to_support') }}</span>
    </p>
    <button type="submit" :class="['btn','btn--green',{pending}]">{{ actionText || $t('confirm')}}</button>
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
        pending: false,
        showResend: this.resendData.showResend || true,
        resendSmsAfterSecond: this.resendData.resendSmsAfterSecond || 30,
        codeSent: this.resendData.showResend === undefined || false,
        askToCallSupport: this.resendData.showResend === false || false
      }
    },
    methods: {
      resendCode() {
        this.showResend = false;
        this.$axios.$post('/resend/code', {
          phone: this.form.phone.replace(/[^0-9]+/g, ''),
        }).then((res) => {
          this.codeSent = true;
        });
      },
      submit() {
        this.validator.$touch();
        if (this.pending || this.validator.$pending || this.validator.$error) return;
        this.pending = true;
        let form = {
          name: this.form.name,
          phone: this.form.phone.replace(/[^0-9]+/g, ''),
          code: this.form.code
        };
        if(!this.form.name)
          delete form.name;
        this.$axios.$post('/confirm/phone', form ).then(async (data) => {
          // track conversion
          this.fbTrack('Complete Registration Api');
          this.gtagTrack('AW-600951956/-O6CCJGB2fIBEJSZx54C');
          this.$auth.setUser(data.user.original)
          await this.$auth.setUserToken(data.meta.token);

          this.pending = false;
          this.$nuxt.$emit('login', true);

          // move to login
          // if (this.skipSignIn) {
          //   this.$auth.loginWith('local', {
          //     data: {
          //       phone: this.form.phone.replace(/[^0-9]+/g, ''),
          //       password: this.form.password || this.form.code
          //     }
          //   }).then(()=>{
          //     this.pending = false;
          //     this.$nuxt.$emit('login', true);
          //   }).catch((err) => {
          //     this.pending = false;
          //   });
          // } else {
          //   this.pending = false;
          //   this.$emit('update-tab','sign-in');
          // }
        }).catch((err) => {
          this.pending = false;
        });
      }
    }
  }
</script>
