<template>
  <div :class="['login-forms', {'login-forms--modal': modal}]">
    <div class="tabs row">
      <div class="col">
        <button 
          :class="['btn', tab === 'sign-in' ? 'btn--red pointer-events-none' : 'btn--pale-red-outline']" 
          @click="updateTab('sign-in')"
          v-if="!forceSellPhone || tab === 'sign-in'"
          v-html="$t('login')"
        />
      </div>
      <div class="col">
        <button 
          :class="['btn', tab === 'sign-up' ? 'btn--red pointer-events-none' : 'btn--pale-red-outline']" 
          @click="updateTab('sign-up')"
          v-if="!forceSellPhone || tab === 'sign-up'"
          v-html="$t('registration')"
        />
      </div>
    </div>
    <sign-in-form 
      @updateTab="updateTab" 
      @login="$emit('login')" 
      v-if="action === 'sign-in'" 
      :form="form" 
      :validator="$v.form" 
      :action-text="actionText && actionText.login" 
    />
    <forgot-password 
      @updateTab="updateTab"
      v-else-if="action === 'forgot'" 
      :form="form" 
      :validator="$v.form" 
    />
    <reset-password 
      @updateTab="updateTab" 
      v-else-if="action === 'reset'" 
      :form="form" 
      :validator="$v.form" 
    />
    <sign-up-form
      @updateTab="updateTab"
      @reset="resetForm"
      v-else-if="action === 'sign-up'"
      :form="form"
      :validator="$v.form"
      :action-text="actionText && actionText.register" 
    />
    <confirm-phone 
      @updateTab="updateTab" 
      @login="$emit('login')" 
      v-else-if="action === 'sms'" 
      :form="form" 
      :validator="$v.form" 
      :action-text="actionText && actionText.confirm" 
      :skip-sign-in="skipSignIn" 
      :resend-data="resendData" 
    />
  </div>
</template>

<script>
  import { mapState } from 'vuex';
  
  import { required, requiredIf, numeric } from 'vuelidate/lib/validators';
  import { isPhoneNumber } from '~/lib/validators';

  import SignInForm  from '~/components/pages/login/SignInForm';
  import ForgotPassword  from '~/components/pages/login/ForgotPassword';
  import ResetPassword  from '~/components/pages/login/ResetPassword';
  import SignUpForm  from '~/components/pages/login/SignUpForm';
  import ConfirmPhone  from '~/components/pages/login/ConfirmPhone';

  export default {
    components: {
      SignInForm, 
      ForgotPassword, 
      ResetPassword, 
      SignUpForm, 
      ConfirmPhone
    },
    props: {
      show: {
        type: Boolean,
        default: true
      },
      modal: Boolean,
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
      ...mapState(['sell_phone','sell_phone_auth'])
    },
    methods: {
      resetForm() {
        this.form = {
          name: '',
          phone: this.forceSellPhone ? this.sell_phone : '',
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
        this.$emit('updateTab', tab);
      }
    },
    created() {
      this.resetForm();
      if(this.forceSellPhone && !this.sell_phone_auth) {
        this.updateTab('sign-up');
      }
    },
    mounted() {
      if(this.modal) {
        document.documentElement.style.overflow = 'hidden';
        document.getElementsByTagName('body')[0].classList.add('modal-open');
        document.addEventListener('click', (e) => {
          if(e.target.classList.contains('login-forms')) this.$emit('hide');
        });
      }
    },
    beforeDestroy() {
      if(this.modal) {
        document.documentElement.style.overflow = 'auto';
        document.getElementsByTagName('body')[0].classList.remove('modal-open');
      }
    }
  }
</script>