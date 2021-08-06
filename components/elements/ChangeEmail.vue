<template>
  <div>
    <form-text-input 
      v-if="!hideInput" 
      v-model="email"
      readonly
      autocomplete="email" 
      :maxlength="255"
      :placeholder="placeholder || $t('add_email')" 
      :mask="$maskEmail()" 
      :disabled="!!user.email"
      key="email"
      @click.native="openModalToChangeEmail"
    />
    <modal-popup
      :toggle="confirmEmailEdit"
      :title="$t('want_to_change_your_email')"
      @close="confirmEmailEdit = false; $emit('close');"
    >
      <form class="form" @submit.prevent="emailEditOpen" novalidate>
        <div class="mb-2 mb-lg-3">
          <p>{{ $t('new_email_will_need_to_be_confirmed')}}</p>
        </div>
        <button type="submit" :class="['btn btn--green full-width']">
          {{ $t('confirm') }}
        </button>
      </form>
    </modal-popup>
    <modal-popup
      :toggle="confirmEmailEditInput"
      :title="$t('enter_new_email')"
      @close="confirmEmailEditInput = false; $emit('close');"
    >
      <form class="form" @submit.prevent="getCodeForNewEmail" novalidate>
        <div class="mb-2 mb-lg-3">
          <form-text-input 
            key="newEmail"
            v-model="newEmail"
            autocomplete="email" 
            :maxlength="255"
            :placeholder="$t('enter_new_email')" 
            :mask="$maskEmail()" 
            :invalid="$v.newEmail.$error"
          />
        </div>
        <button type="submit" :class="['btn btn--green full-width']">
          {{ $t('get_code') }}
        </button>
      </form>
    </modal-popup>
    <modal-popup
      :toggle="confirmEmailCodeInput"
      :title="$t('enter_the_code_from_mail')"
      @close="confirmEmailCodeInput = false; changeEmailInit = false; $emit('close');"
    >
      <form class="form" @submit.prevent="checkCodeForNewEmail" novalidate>
        <div class="mb-2 mb-lg-3">
          <form-text-input
            key="code"
            v-model="code"
            :placeholder="$t('5_digit_code_in_mail')" 
            :mask="'99999'"
            :invalid="$v.code.$error" 
          />
        </div>
        <button type="submit" :class="['btn btn--green full-width']">
          {{ $t('change_email') }}
        </button>
      </form>
    </modal-popup>
  </div>
</template>

<script>
import { required, requiredIf, email, numeric } from 'vuelidate/lib/validators';

export default {
  props: {
    hideInput: Boolean,
    placeholder: String
  },
  data() {
    let user = this.$store.state.auth.user;
    return {
      email: user.email || '',
      newEmail: '',
      code: '',
      changeEmailInit: false,
      confirmEmailEdit: false,
      confirmEmailEditInput: false,
      confirmEmailCodeInput: false
    }
  },
  validations: {
    newEmail: { required, email },
    code: { required: requiredIf(function() { return this.confirmEmailCodeInput }), numeric }
  },
  methods: {
    openModalToChangeEmail() {
      if(this.user.email) return;
      this.$emit('open');
      if(this.changeEmailInit) {
        this.confirmEmailCodeInput = true;
      } else {
        this.$v.$reset();
        this.newEmail = '';
        this.code = '';
        if(this.user.email) {
          this.confirmEmailEdit = true;
        } else {
          this.confirmEmailEditInput = true;
        }
      }
    },
    emailEditOpen() {
      this.confirmEmailEdit = false;
      this.confirmEmailEditInput = true;
    },
    getCodeForNewEmail() {
      this.$v.$touch();
      if (this.$v.$pending || this.$v.$error) return;
      this.$axios.$post('/profile/change_email_request', {
        email: this.newEmail,
      }).then(() => {
        this.confirmEmailEditInput = false;
        this.$v.$reset();
        this.confirmEmailCodeInput = true;
        this.changeEmailInit = true;
      });
    },
    checkCodeForNewEmail() {
      this.$v.$touch();
      if (this.$v.$pending || this.$v.$error) return;
      this.$axios.$post('/profile/change_email', {
        email: this.newEmail,
        code: this.code
      }).then(async () => {
        this.confirmEmailCodeInput = false;
        this.changeEmailInit = false;
        this.$v.$reset();
        this.email = this.newEmail;
        this.newEmail = '';
        this.code = '';
        await this.$auth.fetchUser();
        this.$emit('close');
      });
    }
  },
  watch: {
    newEmail(value) {
      this.$nuxt.$emit('new-email-updated', value);
    }
  },
  mounted() {
    this.$nuxt.$on('new-email-updated', value => {this.newEmail = value;});
    this.$nuxt.$on('open-modal-to-change-email', this.openModalToChangeEmail);
  },
  beforeDestroy() {
    this.$nuxt.$off(['new-email-updated','open-modal-to-change-email']);
  }
}
</script>