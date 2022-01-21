<template>
  <form class="form sign-in" @submit.prevent="loginOrRegister" novalidate>
    <div class="form-part">

      <p v-if="form.staticPhone">
        <span v-mask="$maskPhone(true)">{{ sellPhoneEntered }}</span>
      </p>
      <form-text-input v-else
        autocomplete="tel"
        :placeholder="$t('contact_number')"
        :invalid="validator.phone.$error"
        :mask="$maskPhone()"
        v-model="form.phone"
      />

    </div>
    <p style="margin-bottom: 20px;" class="info-text" v-if="form.staticPhone"><icon name="alert-circle" /> {{ $t('login_before_announce') }}</p>

    <button v-if="!form.staticPhone" type="submit" :class="['btn','btn--green',{pending}]">{{ actionText || $t('login') }}</button>
    <form-text-input
      v-if="form.staticPhone"
      :placeholder="$t('name')"
      :maxlength="30"
      :invalid="validator.name.$error"
      v-model="form.name"
    />
    <confirm-phone
      v-if="form.staticPhone"
      :form="form"
      :validator="validator"
      :action-text="actionText && actionText.confirm"
    />
  </form>
</template>

<script>
  import { mapState } from 'vuex';
  import ConfirmPhone  from '~/components/login/ConfirmPhone';
  export default {
    props: {
      popup: Boolean,
      form: {},
      validator: {},
      actionText: String
    },
    components:{
      ConfirmPhone
    },
    data() {
      return {
        pending: false,
        passwordWrong: this.form.passwordWrong
      }
    },
    computed: {
      ...mapState(['sellPhoneEntered'])
    },
    methods: {
     // @deprecated
      submit() {
        // form submit handler
        this.validator.$touch();
        if (this.pending || this.validator.$pending || this.validator.$error) return;
        this.pending = true;
        this.$auth.loginWith('local', {
          data: {
            phone: this.form.phone.replace(/[^0-9]+/g, ''),
            password: this.form.password
          }
        }).then(()=>{
          this.pending = false;
          this.$nuxt.$emit('login', true);
        }).catch(({response}) => {
          this.pending = false;
          if (response.status === 401) {
            this.passwordWrong = true;
          } else if (response.status === 406) {
            this.$emit('update-tab','sign-up','sms', response.data.data);
          }
        });
      },
      loginOrRegister() {
          this.validator.$touch();

          if (this.pending || this.validator.$pending || this.validator.$error) return;
          this.pending = true;
          let form = {
            name: this.form.name,
            phone: this.form.phone.replace(/[^0-9]+/g, ''),
          }
          if(!this.popup) {
            delete form.name;
          }
          this.$axios.$post('/login_or_register', form).then((res) => {
            if (res.data.password) {
              this.$auth.loginWith('local', {
                data: {
                  phone: this.form.phone.replace(/[^0-9]+/g, ''),
                  password: res.data.password
                }
              }).then(()=>{
                this.pending = false;
                this.$nuxt.$emit('login', true);
              }).catch((err) => {
                this.pending = false;
              });
            } else {
              this.pending = false;
              this.$emit('update-tab','sign-up','sms');
            }
          }).catch((err) => {
            this.pending = false;
          });
      }
    }
  }
</script>
