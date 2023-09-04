<template>
   <form class="form confirm-sms-code" novalidate @submit.prevent="submit">
      <div class="form-part">
         <div v-if="isMobileBreakpoint" class="ma-login-tab--mobile__top">
            <div class="ma-login-tab--mobile__top--image">
               <img src="/images/confirm-phone-mobile.png"/>
            </div>
            <h2 class="ma-title--md">{{ $t('confirmation_code') }}</h2>
            <p class="login_mobile_desc">{{ $t('confirmation_code_desc') }}</p>
         </div>
         <form-text-input
            v-if="!form.staticPhone && isNewUser"
            v-model="form.name"
            :maxlength="30"
            :placeholder="$t('your_name')"
            auto-focus
            :class="{form_error: authError.includes('name')}"
            :invalid=" authError.includes('name')"
         />
         <separated-input v-if="isMobileBreakpoint" v-model="form.code"/>

<!--         <p-->
<!--            v-if="!form.staticPhone && isNewUser"-->
<!--            style="color: #92959a; margin-top: -12px;"-->
<!--         >-->
<!--            {{ $t('filled_in_at_will') }}-->
<!--         </p>-->
         <form-text-input
            v-if="!isMobileBreakpoint"
            v-model="form.code"
            :class="{form_error: authError.includes('code')}"
            :invalid="validator.code.$error || authError.includes('code')"
            :mask="'99999'"
            :placeholder="$t('enter_the_code')"
            auto-focus
         />
      </div>

      <p v-if="showResend || codeSent || askToCallSupport" class="send-again-text">
         <a
            v-if="showResend && resendSmsAfterSecond === 0"
            class="resend_code_button"
            @click.prevent="resendCode"
         >
            {{ $t('resend_code') }}
         </a>
         <span
            v-else-if="showResend && resendSmsAfterSecond > 0"
         >
        {{ $t('enter_the_code_sent_to_your_number') }}
        <timer
           :duration="resendSmsAfterSecond"
           format="i:s"
           @timeOver="resendSmsAfterSecond = 0"
        />
      </span>
         <span v-else-if="codeSent">{{ $t('code_has_been_sent') }}</span>
         <span v-else-if="askToCallSupport">
        {{ $t('please_call_to_support') }}
      </span>
      </p>
      <button :class="['btn', 'btn--green', 'full-width', { pending }]" type="submit">
         {{ actionText || $t('confirm') }}
      </button>

   </form>
</template>

<script>
import {mapActions, mapGetters} from 'vuex'
import SeparatedInput from "~/components/forms/SeparatedInput";

export default {
   props: {
      form: {},
      validator: {},
      actionText: String,
      isNewUser: Boolean,
      skipSignIn: Boolean,
      resendData: {
         default: {},
      },
   },
   components: {
      SeparatedInput
   },
   data() {
      return {
         authError: [],
         pending: false,
         showResend: this.resendData.showResend || true,
         resendSmsAfterSecond: this.resendData.resendSmsAfterSecond || 30,
         codeSent: this.resendData.showResend === undefined || false,
         askToCallSupport: this.resendData.showResend === false || false,
      }
   },
   computed: {
      ...mapGetters(['editPath', 'editingPostAuthor']),
   },
   methods: {
      ...mapActions('letterOfAttorney', ['updateStep']),
      resendCode() {
         this.showResend = false
         this.$axios
            .$post('/resend/code', {
               phone: this.form.phone.replace(/[^0-9]+/g, ''),
            })
            .then((res) => {
               this.codeSent = true
               setTimeout(()=>{
                  this.codeSent = false;
                  this.showResend = true;
                  this.resendSmsAfterSecond = 30;
               },1000)
            })
      },
      submit() {
         this.authError = []
         this.validator.$touch()
         if (this.pending || this.validator.$pending || this.validator.$error)
            return
         this.pending = true
         let form = {
            name: this.form.name,
            phone: this.form.phone.replace(/[^0-9]+/g, ''),
            code: this.form.code,
         }
         if (!this.form.name) delete form.name
         this.$axios
            .$post('https://v2dev.mashin.al/api/v2/auth/confirm-otp', form)
            .then(async (data) => {
               // track conversion
               this.fbTrack('Complete Registration Api')
               this.gtagTrack('AW-600951956/-O6CCJGB2fIBEJSZx54C')
               this.$auth.setUser(data.user.original)
               this.$emit('setFinished', true)
               await this.$auth.setUserToken(data.meta.token)
               this.pending = false
               this.$nuxt.$emit('login', true)
               this.updateStep(1)
               this.$nuxt.$emit('closeModal')
               if (this.$route.query.ref) {
                  if (this.editingPostAuthor == this.$auth.user.id)
                     this.$router.push(decodeURI(this.$route.query.ref));
               }
               // if (this.$store.state.editing == true) {
               //   if (this.editingPostAuthor == this.$auth.user.id) {
               //     this.$router.push(
               //       this.$localePath(`/cars/announcement/${this.editPath}/edit`),
               //     )
               //   }
               //   // this.$router.push("ehtiyat-hisseleri/magazalar")
               // }
            })
            .catch((err) => {
               this.pending = false;
               const errors = []
               for (const key in err.response.data?.data) {
                  errors.push(key)
               }
               this.authError = errors
               // this.$toasted.error(err.response.data.message)
            })
      },
   },
}
</script>

<style>
.resend_code_button{
   text-decoration: underline !important;
   color: #0a77e8 !important;
   cursor: pointer !important;
}
</style>
