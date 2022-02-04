<template>
  <div :class="{ 'login-forms': !inAttorney, 'login-forms--popup': popup, 'login-in-attorney':inAttorney }" @click.stop>
    <div class="login-forms-with-dots">
      <h2 v-if="!inAttorney" :class="{'title-with-line': !isMobileBreakpoint}">
        <span>{{ $t('login') }}</span>
      </h2>
      <sign-in-form
        @check-user="isNewUser = $event"
        @update-tab="updateTab"
        v-if="action !== 'sms'"
        :form="form"
        :popup="popup"
        :validator="$v.form"
        :action-text="actionText && actionText.login"
      />
      <confirm-phone
        :is-new-user="isNewUser"
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

    <div class="swiper-pagination-bullets" v-if="!isMobileBreakpoint && !inAttorney">
      <span  class="swiper-pagination-bullet" :class="{'swiper-pagination-bullet-active': action === 'sign-in' && !form.staticPhone }" ></span>
      <span class="swiper-pagination-bullet"  :class="{'swiper-pagination-bullet-active': action === 'sms' || form.staticPhone }"></span>
    </div>
  </div>
</template>

<script>
import {mapActions, mapState} from 'vuex';

import {requiredIf, numeric} from 'vuelidate/lib/validators';
import {isPhoneNumber} from '~/lib/validators';

import StepsProgress from '~/components/garage/loa/StepsProgress';
import SignInForm from '~/components/login/SignInForm';
import ConfirmPhone from '~/components/login/ConfirmPhone';

export default {
  components: {
    StepsProgress,
    SignInForm,
    ConfirmPhone
  },
  props: {
    inAttorney: {
      default:false,
      type: Boolean
    },
    popup: Boolean,
    skipSignIn: Boolean,
    forceSellPhone: Boolean,
    actionText: {},
    initialForm: {}
  },
  data() {
    return {
      isNewUser:false,
      finished: false,
      tab: 'sign-in',
      action: 'sign-in',
      form: {},
      resendData: false
    }
  },
  validations: {
    form: {
      name: {
        required: requiredIf(function () {
          return ['sign-up'].includes(this.action) && !this.$cookies.get('btl')
        })
      },
      phone: {
        required: requiredIf(function () {
          return ['sign-in', 'sign-up', 'forgot'].includes(this.action)
        }), isPhoneNumber
      },
      code: {
        required: requiredIf(function () {
          return ['sms', 'reset'].includes(this.action)
        }), numeric
      },
      // password: { required: requiredIf(function() { return ['sign-in','sign-up','reset'].includes(this.action) && !this.$cookies.get('btl')}) },
      // passwordConfirm: { required: requiredIf(function() { return ['sign-up','reset'].includes(this.action) && !this.$cookies.get('btl')}) }
    }
  },
  computed: {
    ...mapState(['sellPhoneEntered', 'sellPhoneRegistered'])
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
      }
      this.$emit('update-tab', tab);
    },
    handleEscapeKey(e) {
      if (e.key === 'Escape') {
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
<style lang="scss">
.login-in-attorney {
    .btn--green {
      width: 100%;
      margin-top:15px;
    }
    .under-texts {
      margin-top: 7px;
    }
}
.login-forms-with-dots {
  flex: 1;
  flex-direction: column;
  display: flex;
  justify-content: center;
}
.login-forms {
  .swiper-pagination-bullets {
    display: flex;
    justify-content: center;
    width: 100%;
    margin-bottom: 20px;
  }
}
</style>
