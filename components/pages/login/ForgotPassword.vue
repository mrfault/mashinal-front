<template>
  <form class="form forgot-password" @submit.prevent="submit" novalidate>
    <div class="form-part">
      <p v-if="form.staticPhone">
        <span v-mask="maskPhone(true)">{{ sell_phone }}</span>
      </p>
      <input-text v-else
        autocomplete="tel" 
        :placeholder="$t('mobile_number')" 
        :invalid="validator.phone.$error" 
        :mask="maskPhone()"  
        v-model="form.phone"
      />  
    </div>
    <p><span class="cursor-pointer" @click="$emit('updateTab','sign-in')"><icon name="arrow-left" /> {{ $t('remember_your_password')}}</span></p>
    <button class="btn btn--green" type="submit">{{ $t('send_the_code')}}</button>
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
      ...mapState(['sell_phone'])
    },
    methods: {
      submit() {
        // form submit handler
        this.validator.$touch();
        if (this.validator.$pending || this.validator.$error) return;
        this.$nuxt.$emit('loading', true);
        this.$axios.$post('/forgot', {
          phone: this.form.phone.replace(/[^0-9]+/g, '')
        }).then(() => {
          this.$nuxt.$emit('loading', false);
          this.$emit('updateTab','sign-in','reset');
        });
      }
    }
  }
</script>