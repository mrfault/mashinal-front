<template>
  <form class="form forgot-password" @submit.prevent="submit" novalidate>
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
    <p class="info-text"><icon name="alert-circle" /> {{ $t('password_will_be_sent_by_email') }}</p>
    <p><icon name="arrow-left" /> <span class="cursor-pointer" @click="$emit('update-tab','sign-in')">{{ $t('remember_your_password')}}</span></p>
    <button type="submit" :class="['btn','btn--green',{pending}]">{{ $t('send_the_code')}}</button>
  </form>
</template>

<script>
  import { mapState } from 'vuex';

  export default {
    props: {
      form: {},
      validator: {}
    },
    computed: {
      ...mapState(['sellPhoneEntered'])
    },
    data() {
      return {
        pending: false
      }
    },
    methods: {
      submit() {
        this.validator.$touch();
        if (this.pending || this.validator.$pending || this.validator.$error) return;
        this.pending = true;
        this.$axios.$post('/forgot', {
          phone: this.form.phone.replace(/[^0-9]+/g, '')
        }).then(() => {
          this.pending = false;
          this.$emit('update-tab','sign-in','reset');
        }).catch((err) => {
          this.pending = false;
        });
      }
    }
  }
</script>