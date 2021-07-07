<template>
  <div :class="['login-forms', {'login-forms--popup': popup}]" @click.stop>
    <div>
      <div class="tabs row">
        <div class="col" v-if="!forceSellPhone || tab === 'sign-in'">
          <button 
            :class="['btn', 'btn--pale-red-outline', {'active': tab === 'sign-in', 'pointer-events-none': forceSellPhone}]" 
            @click="updateTab('sign-in')"
            v-html="$t('login')"
          />
        </div>
        <div class="col" v-if="!forceSellPhone || tab === 'sign-up'">
          <button 
            :class="['btn', 'btn--pale-red-outline', {'active': tab === 'sign-up', 'pointer-events-none': forceSellPhone}]"
            @click="updateTab('sign-up')"
            v-html="$t('registration')"
          />
        </div>
      </div>
      <sign-in-form 
        @update-tab="updateTab" 
        v-if="action === 'sign-in'" 
        :form="form" 
        :validator="$v.form" 
        :action-text="actionText && actionText.login" 
      />
      <forgot-password 
        @update-tab="updateTab"
        v-else-if="action === 'forgot'" 
        :form="form" 
        :validator="$v.form" 
      />
      <reset-password 
        @update-tab="updateTab" 
        v-else-if="action === 'reset'" 
        :form="form" 
        :validator="$v.form" 
      />
      <sign-up-form
        @update-tab="updateTab"
        @reset="resetForm"
        v-else-if="action === 'sign-up'"
        :form="form"
        :validator="$v.form"
        :action-text="actionText && actionText.register" 
      />
      <confirm-phone 
        @update-tab="updateTab" 
        v-else-if="action === 'sms'" 
        :form="form" 
        :validator="$v.form" 
        :action-text="actionText && actionText.confirm" 
        :skip-sign-in="skipSignIn" 
        :resend-data="resendData" 
      />
    </div>
  </div>
</template>

<script>
  import { mapState } from 'vuex';
  
  import { requiredIf, numeric } from 'vuelidate/lib/validators';
  import { isPhoneNumber } from '~/lib/validators';

  import SignInForm  from '~/components/login/SignInForm';
  import ForgotPassword  from '~/components/login/ForgotPassword';
  import ResetPassword  from '~/components/login/ResetPassword';
  import SignUpForm  from '~/components/login/SignUpForm';
  import ConfirmPhone  from '~/components/login/ConfirmPhone';

  export default {
    components: {
      SignInForm, 
      ForgotPassword, 
      ResetPassword, 
      SignUpForm, 
      ConfirmPhone
    },
    props: {
      popup: Boolean,
      skipSignIn: Boolean,
      forceSellPhone: Boolean,
      actionText: {}
    },
    data() {
      return {
        tab: 'sign-in',
        action: 'sign-in',
        form: {},
        resendData: false
      }
    },
    validations: {
      form: {
        name: { required: requiredIf(function() { return ['sign-up'].includes(this.action)}) },
        phone: { required: requiredIf(function() { return ['sign-in','sign-up','forgot'].includes(this.action)}), isPhoneNumber },
        code: { required: requiredIf(function() { return ['sms','reset'].includes(this.action)}), numeric },
        password: { required: requiredIf(function() { return ['sign-in','sign-up','reset'].includes(this.action)}) },
        passwordConfirm: { required: requiredIf(function() { return ['sign-up','reset'].includes(this.action)}) }
      }
    },
    computed: {
      ...mapState(['sellPhoneEntered','sellPhoneRegistered'])
    },
    methods: {
      resetForm() {
        this.form = {
          name: '',
          phone: this.forceSellPhone ? this.sellPhoneEntered : '',
          code: '',
          password: '',
          passwordConfirm: '',
          passwordRemember: false,
          passwordWrong: false,
          staticPhone: !!this.forceSellPhone
        }
      },
      updateTab(tab, action = '', data = false) {
        this.$v.$reset();
        this.tab = tab;
        this.action = action !== '' ? action : tab;
        if(action === 'sms') this.resendData = data;
        this.$emit('update-tab', tab);
      }
    },
    created() {
      this.resetForm();
      if(this.forceSellPhone && !this.sellPhoneRegistered) {
        this.updateTab('sign-up');
      }
    }
  }
</script>