<template>
  <div :class="['login-forms', {'login-forms--popup': popup}]" @click.stop>
    <div>
      <steps-progress
        :limit-steps="2"
        :finished="finished"
      />
      <h2 :class="{'title-with-line': !isMobileBreakpoint}">
        <span>{{ $t('login') }}</span>
      </h2>
      <sign-in-form
        @update-tab="updateTab"
        v-if="action !== 'sms'"
        :form="form"
        :popup="popup"
        :validator="$v.form"
        :action-text="actionText && actionText.login"
      />
<!--      <forgot-password-->
<!--        @update-tab="updateTab"-->
<!--        v-else-if="action === 'forgot'"-->
<!--        :form="form"-->
<!--        :validator="$v.form"-->
<!--      />-->
<!--      <reset-password-->
<!--        @update-tab="updateTab"-->
<!--        v-else-if="action === 'reset'"-->
<!--        :form="form"-->
<!--        :validator="$v.form"-->
<!--      />-->
<!--      <sign-up-form-->
<!--        @update-tab="updateTab"-->
<!--        @reset="resetForm"-->
<!--        v-else-if="action === 'sign-up'"-->
<!--        :form="form"-->
<!--        :validator="$v.form"-->
<!--        :action-text="actionText && actionText.register"-->
<!--      />-->
      <confirm-phone
        @setFinished="finished = $event"
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
import {mapActions, mapState} from 'vuex';

  import { requiredIf, numeric } from 'vuelidate/lib/validators';
  import { isPhoneNumber } from '~/lib/validators';

  import StepsProgress from '~/components/garage/loa/StepsProgress';
  import SignInForm  from '~/components/login/SignInForm';
  import ConfirmPhone  from '~/components/login/ConfirmPhone';

  export default {
    components: {
      StepsProgress,
      SignInForm,
      ConfirmPhone
    },
    props: {
      popup: Boolean,
      skipSignIn: Boolean,
      forceSellPhone: Boolean,
      actionText: {},
      initialForm: {}
    },
    data() {
      return {
        finished: false,
        tab: 'sign-in',
        action: 'sign-in',
        form: {},
        resendData: false
      }
    },
    validations: {
      form: {
        name: { required: requiredIf(function() { return ['sign-up'].includes(this.action) && !this.$cookies.get('btl')}) },
        phone: { required: requiredIf(function() { return ['sign-in','sign-up','forgot'].includes(this.action)}), isPhoneNumber },
        code: { required: requiredIf(function() { return ['sms','reset'].includes(this.action)}), numeric },
        // password: { required: requiredIf(function() { return ['sign-in','sign-up','reset'].includes(this.action) && !this.$cookies.get('btl')}) },
        // passwordConfirm: { required: requiredIf(function() { return ['sign-up','reset'].includes(this.action) && !this.$cookies.get('btl')}) }
      }
    },
    computed: {
      ...mapState(['sellPhoneEntered','sellPhoneRegistered'])
    },
    methods: {
      ...mapActions('letterOfAttorney', ['updateStep']),
      resetForm() {
        this.form = {
          name: this.initialForm?.name || '',
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
        if (action === 'sms') {
          this.resendData = data;
          this.updateStep(2);
        }
        this.$emit('update-tab', tab);
      },
      handleEscapeKey(e) {
        if (e.key === 'Escape'){
          this.$emit('close');
        }
      }
    },
    created() {
      this.resetForm();
      if (this.forceSellPhone && !this.sellPhoneRegistered || this.btlCookie) {
        this.updateTab('sign-up');
      }
    },
    mounted() {
      if (this.popup) window.addEventListener('keydown', this.handleEscapeKey);
    },
    beforeDestroy() {
      if (this.popup) window.removeEventListener('keydown', this.handleEscapeKey);
    }
  }
</script>
