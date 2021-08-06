<template>
  <div>
    <form-text-input 
      v-if="!hideInput" 
      v-model="phone"
      readonly
      autocomplete="tel" 
      :placeholder="placeholder || $t('add_mobile_number')" 
      :mask="$maskPhone()" 
      :disabled="!!user.phone"
      key="phone"
      @click.native="openModalToChangePhone"
    />
    <modal-popup
      :toggle="confirmPhoneEdit"
      :title="$t('want_to_change_your_phone_number')"
      @close="confirmPhoneEdit = false; $emit('close');"
    >
      <form class="form" @submit.prevent="phoneEditOpen" novalidate>
        <div class="mb-2 mb-lg-3">
          <p>{{ $t('the_new_number_will_need_to_be_confirmed_by_sms')}}</p>
        </div>
        <button type="submit" :class="['btn btn--green full-width']">
          {{ $t('confirm') }}
        </button>
      </form>
    </modal-popup>
    <modal-popup
      :toggle="confirmPhoneEditInput"
      :title="$t('enter_a_new_mobile_number')"
      @close="confirmPhoneEditInput = false; $emit('close');"
    >
      <form class="form" @submit.prevent="getSmsForNewNumber" novalidate>
        <div class="mb-2 mb-lg-3">
          <form-text-input 
            key="newPhone"
            v-model="newPhone"
            autocomplete="tel" 
            :placeholder="$t('enter_a_new_mobile_number')" 
            :mask="$maskPhone()" 
            :invalid="$v.newPhone.$error"
          />
        </div>
        <button type="submit" :class="['btn btn--green full-width']">
          {{ $t('get_sms') }}
        </button>
      </form>
    </modal-popup>
    <modal-popup
      :toggle="confirmPhoneEditInput"
      :title="$t('enter_the_code_from_sms')"
      @close="confirmPhoneEditInput = false; changePhoneInit = false; $emit('close');"
    >
      <form class="form" @submit.prevent="checkCodeForNewNumber" novalidate>
        <div class="mb-2 mb-lg-3">
          <form-text-input
            key="code"
            v-model="code"
            :placeholder="$t('5_digit_code_in_sms')" 
            :mask="'99999'"
            :invalid="$v.code.$error" 
          />
        </div>
        <button type="submit" :class="['btn btn--green full-width']">
          {{ $t('change_number') }}
        </button>
      </form>
    </modal-popup>
  </div>
</template>

<script>
import { required, requiredIf, numeric } from 'vuelidate/lib/validators';
import { isPhoneNumber } from '~/lib/validators';

export default {
  props: {
    hideInput: Boolean,
    placeholder: String
  },
  data() {
    let user = this.$store.state.auth.user;
    return {
      phone: user.phone ? '+' + user.phone : '',
      newPhone: '',
      code: '',
      changePhoneInit: false,
      confirmPhoneEdit: false,
      confirmPhoneEditInput: false,
      confirmPhoneCodeInput: false
    }
  },
  validations: {
    newPhone: { required, isPhoneNumber },
    code: { required: requiredIf(function() { return this.confirmPhoneCodeInput }), numeric }
  },
  methods: {
    openModalToChangePhone() {
      if(this.user.phone) return;
      this.$emit('open');
      if(this.changePhoneInit) {
        this.confirmPhoneCodeInput = true;
      } else {
        this.$v.$reset();
        this.newPhone = '';
        this.code = '';
        if(this.user.phone) {
          this.confirmPhoneEdit = true;
        } else {
          this.confirmPhoneEditInput = true;
        }
      }
    },
    phoneEditOpen() {
      this.confirmPhoneEdit = false;
      this.confirmPhoneEditInput = true;
    },
    getSmsForNewNumber() {
      this.$v.$touch();
      if (this.$v.$pending || this.$v.$error) return;
      this.$axios.$post('/profile/change_phone_request', {
        phone: this.newPhone.replace(/[^0-9]+/g, ''),
      }).then(() => {
        this.confirmPhoneEditInput = false;
        this.$v.$reset();
        this.confirmPhoneCodeInput = true;
        this.changePhoneInit = true;
      });
    },
    checkCodeForNewNumber() {
      this.$v.$touch();
      if (this.$v.$pending || this.$v.$error) return;
      this.$axios.$post('/profile/change_phone', {
        phone: this.newPhone.replace(/[^0-9]+/g, ''),
        code: this.code
      }).then(async () => {
        this.confirmPhoneCodeInput = false;
        this.changePhoneInit = false;
        this.$v.$reset();
        this.phone = this.newPhone;
        this.newPhone = '';
        this.code = '';
        await this.$auth.fetchUser();
        this.$emit('close');
      });
    }
  },
  watch: {
    newPhone(value) {
      this.$nuxt.$emit('new-phone-updated', value);
    }
  },
  mounted() {
    this.$nuxt.$on('new-phone-updated', value => {this.newPhone = value;});
    this.$nuxt.$on('open-modal-to-change-phone', this.openModalToChangePhone);
  },
  beforeDestroy() {
    this.$nuxt.$off(['new-phone-updated','open-modal-to-change-phone']);
  }
}
</script>