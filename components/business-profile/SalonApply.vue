<template>
  <div class="card m-0">
    <form @submit.prevent="submit">
      <h2 class="title-with-line full-width mb-2 mb-lg-3">
        <span>{{ $t('contact_us') }}</span>
      </h2>
      <form-text-input 
        :maxlength="30"
        :placeholder="$t('name') + ', ' + $t('surname')" 
        :invalid="$v.form.name.$error" 
        v-model="form.name"
        class="mb-2 mb-lg-3" 
      />
      <form-text-input
        autocomplete="tel" 
        :placeholder="$t('contact_number')" 
        :invalid="$v.form.phone.$error" 
        :mask="$maskPhone()"  
        v-model="form.phone"
        class="mb-2 mb-lg-3" 
      />
      <p>{{ $t('you_will_be_contacted_shortly') }}</p>
      <hr class="mt-2"/>
      <button :class="['btn btn--green full-width', { pending }]" type="submit">
        {{ $t('apply') }}
      </button>
    </form>
  </div>
</template>

<script>
import { required } from 'vuelidate/lib/validators';
import { isPhoneNumber } from '~/lib/validators';

export default {
  data() {
    return {
      pending: false,
      form: {
        name: '',
        phone: ''
      }
    }
  },
  validations: {
    form: { 
      name: { required },
      phone: { required, isPhoneNumber }
    }
  },
  methods: {
    async submit() {
      this.$v.$touch();
      if (this.pending || this.$v.$pending || this.$v.$error) return;
      this.pending = true;
      try {
        await this.$axios.$post(`/part/open/store`, {
          phone: this.form.phone.replace(/[^0-9]+/g, ''),
          full_name: this.form.name
        });
        this.pending = false;
        this.$toasted.success(this.$t('your_request_has_been_sent'));
      } catch (err) {
        this.pending = false;
      }
    }
  }
}
</script>