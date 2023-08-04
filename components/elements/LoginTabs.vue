<template>
   <div
      :class="{
      'login-forms': !inAttorney,
      'login-forms--popup': popup,
      'login-in-attorney': inAttorney,
      'mx-0': true,
      'w-100': true,
    }"
      @click.stop
   >
      <div class="login-forms-with-dots">
         <sign-in-form
            v-if="tabOptions.signInForm && action !== 'sms'"
            :action-text="actionText && actionText.login"
            :form="form"
            :popup="popup"
            :sellCheckTokens="sellCheckTokens"
            :validator="$v.form"
            @check-user="isNewUser = $event"
            @update-tab="updateTab"
         />
         <confirm-phone
            v-else-if="tabOptions.confirmPhone && action === 'sms'"
            :action-text="actionText && actionText.confirm"
            :form="form"
            :is-new-user="isNewUser"
            :resend-data="resendData"
            :skip-sign-in="skipSignIn"
            :validator="$v.form"
            @setFinished="finished = $event"
            @update-tab="updateTab"
         />
         <why-register/>
      </div>
   </div>
</template>

<script>
import {mapActions, mapState} from 'vuex'

import {requiredIf, numeric} from 'vuelidate/lib/validators'
import {isPhoneNumber} from '~/lib/validators'

import StepsProgress from '~/components/garage/loa/StepsProgress'
import SignInForm from '~/components/login/SignInForm'
import ConfirmPhone from '~/components/login/ConfirmPhone'
import QrcodeBox from '~/components/login/Qrcode-box'
import WhyRegister from "~/components/login/WhyRegister";

export default {
   components: {
      QrcodeBox,
      StepsProgress,
      SignInForm,
      ConfirmPhone,
      WhyRegister
   },
   props: {
      inAttorney: {
         default: false,
         type: Boolean,
      },
      popup: Boolean,
      skipSignIn: Boolean,
      forceSellPhone: Boolean,
      actionText: {},
      initialForm: {},
      tabOptions: {
         type: Object,
         default() {
            return {
               header: true,
               signInForm: true,
               confirmPhone: true,
               qrCode: true,
            }
         },
      },
      sellCheckTokens: {
         type: Boolean,
         default: false,
      }
   },
   data() {
      return {
         isNewUser: false,
         finished: false,
         tab: 'sign-in',
         action: 'sign-in',
         form: {},
         resendData: false,
      }
   },
   validations: {
      form: {
         phone: {
            required: requiredIf(function () {
               return ['sign-in', 'sign-up', 'forgot'].includes(this.action)
            }),
            isPhoneNumber,
         },
         code: {
            required: requiredIf(function () {
               return ['sms', 'reset'].includes(this.action)
            }),
            numeric,
         },
         // password: { required: requiredIf(function() { return ['sign-in','sign-up','reset'].includes(this.action) && !this.$cookies.get('btl')}) },
         // passwordConfirm: { required: requiredIf(function() { return ['sign-up','reset'].includes(this.action) && !this.$cookies.get('btl')}) }
      },
   },
   computed: {
      ...mapState(['sellPhoneEntered', 'sellPhoneRegistered']),
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
            staticPhone: !!this.forceSellPhone,
         }
      },
      updateTab(tab, action = '', data = false) {
         this.$v.$reset()
         this.tab = tab
         this.action = action !== '' ? action : tab
         if (action === 'sms') {
            this.resendData = data
         }
         this.$emit('update-tab', tab)
      },
      handleEscapeKey(e) {
         if (e.key === 'Escape') this.$emit('close')
         if (e.keyCode === 9) e.preventDefault();
      },
   },
   created() {
      this.resetForm()
      if ((this.forceSellPhone && !this.sellPhoneRegistered) || this.btlCookie) {
         this.updateTab('sign-up')
      }
   },
   mounted() {
      if (this.popup) window.addEventListener('keydown', this.handleEscapeKey)
   },
   beforeDestroy() {
      if (this.popup) window.removeEventListener('keydown', this.handleEscapeKey)
   },
}
</script>

<style lang="scss">
.login-in-attorney {
   .btn--green {
      width: 100%;
      margin-top: 15px;
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
      margin-top: 10px;
      display: flex;
      justify-content: center;
      width: 100%;
      margin-bottom: 20px;
   }
}
</style>
