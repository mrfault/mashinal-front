<template>
   <form class="form sign-in" novalidate @submit.prevent="loginOrRegister">
      <div class="form-part">
         <p v-if="form.staticPhone">
            <span v-mask="$maskPhone(true)">{{ sellPhoneEntered }}</span>
         </p>
         <template v-if="isMobileBreakpoint">
            <div class="ma-login-tab--mobile__top">
               <div class="ma-login-tab--mobile__top--image">
                  <img src="/images/login-image-mobile.png"/>
               </div>
               <h2 class="ma-title--md">{{ $t('sign_in_to_account') }}</h2>
               <p class="login_mobile_desc">{{ $t('login_mobile_desc') }}</p>
            </div>
         </template>
         <form-text-input
            v-if="!form.staticPhone"
            v-model="form.phone"
            :auto-focus="!isMobileBreakpoint"
            :invalid="validator.phone.$error"
            :mask="$maskPhone()"
            :placeholder="$t('your_phone_number')"
            autocomplete="tel"
            style="margin-bottom: 32px"
         />

      </div>
      <!--    <p style="margin-bottom: 20px;" class="info-text" v-if="form.staticPhone"><icon name="alert-circle" /> {{ $t('login_before_announce') }}</p>-->

      <button
         v-if="!form.staticPhone"
         :class="['btn', 'btn--green', 'full-width', { pending }]"
         type="submit"
      >
         {{ actionText || $t('go_ahead') }}
      </button>
      <form-text-input
         v-if="form.staticPhone && !sellPhoneRegistered"
         v-model="form.name"
         :auto-focus="!isMobileBreakpoint"
         :maxlength="30"
         :placeholder="$t('your_name')"
      />
      <confirm-phone
         v-if="form.staticPhone"
         :action-text="actionText && actionText.confirm"
         :form="form"
         :validator="validator"
      />
   </form>
</template>

<script>
import {mapState, mapActions} from 'vuex'
import ConfirmPhone from '~/components/login/ConfirmPhone'

export default {
   props: {
      popup: Boolean,
      form: {},
      validator: {},
      actionText: String,
      sellCheckTokens: {
         type: Boolean,
         default: false,
      },
   },
   components: {
      ConfirmPhone,
   },
   data() {
      return {
         pending: false,
         passwordWrong: this.form.passwordWrong,
      }
   },
   computed: {
      ...mapState(['sellPhoneEntered', 'sellPhoneRegistered']),
   },
   methods: {
      ...mapActions(['checkSellTokens']),
      // @deprecated
      submit() {
         // form submit handler
         this.validator.$touch()
         if (this.pending || this.validator.$pending || this.validator.$error)
            return
         this.pending = true
         this.$auth
            .loginWith('local', {
               data: {
                  phone: this.form.phone.replace(/[^0-9]+/g, ''),
                  password: this.form.password,
               },
            })
            .then(() => {
               this.pending = false
               this.$nuxt.$emit('login', true)
            })
            .catch(({response}) => {
               this.pending = false
               if (response.status === 401) {
                  this.passwordWrong = true
               } else if (response.status === 406) {
                  this.$emit('update-tab', 'sign-up', 'sms', response.data.data)
               }
            })
      },
      loginOrRegister() {
         this.validator.$touch()
         if (this.pending || this.validator.$pending || this.validator.$error)
            return
         this.pending = true
         let form = {
            name: this.form.name,
            phone: this.form.phone.replace(/[^0-9]+/g, ''),
         }
         if (!this.popup) {
            delete form.name
         }
         this.$axios
            .$post('/login_or_register', form)
            .then((res) => {
               if (res.data.password) {
                  this.$auth
                     .loginWith('local', {
                        data: {
                           phone: this.form.phone.replace(/[^0-9]+/g, ''),
                           password: res.data.password,
                        },
                     })
                     .then(() => {
                        this.pending = false
                        //this.$nuxt.$emit('login', true);
                     })
                     .catch((err) => {
                        this.pending = false
                     })
               } else {
                  this.pending = false
                  this.$emit('check-user', res.data.new_user)
                  this.$emit('update-tab', 'sign-up', 'sms')
               }
            })
            .catch((err) => {
               this.pending = false
            })
      },
      async checkPhone() {
         this.$v.$touch()
         if (this.pending || this.$v.$error) return
         this.pending = true
         try {
            await this.checkSellTokens(this.form.phone.replace(/[^0-9]+/g, ''))
            this.mutate({property: 'sellPhoneEntered', value: this.form.phone})
            this.pending = false
         } catch (error) {
            this.pending = false
         }
      },
   },
   async fetch() {
      if (this.sellCheckTokens) {
         this.form.phone = this.$parsePhone(this.$route.query.phone)
         if (this.form.phone) await this.checkPhone()
      }
   },
}
</script>
