<template>
  <modal-popup
    :toggle="modalVisible" 
    :title="$t('create_online_store')"
    @close="modalVisible = false"
    class="create-store"
  >
    <form-text-input 
      v-model="fullName"
      :placeholder="$t('name') +', '+ $t('surname')"
      :invalid="$v.fullName.$error"
      class="mb-3"
    />
    <form-text-input 
      v-model="phone"
      :placeholder="$t('mobile_number')" 
      :invalid="$v.phone.$error"
      :mask="$maskPhone()"
      autocomplete="tel"
      class="mb-2"
    />
    <p class="create-store__desc mb-2">{{ $t('you_will_be_contacted_shortly') }}</p>
    <button
      class="btn btn--green full-width"
      @click.prevent="confirm"
    >
      {{ $t('confirm') }}
    </button>
  </modal-popup>
</template>

<script>
import { required } from 'vuelidate/lib/validators';
import { isPhoneNumber } from '~/lib/validators';

export default {
  props: {
    visible: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      fullName: '',
      phone: ''
    }
  },
  validations: {
    fullName: { required },
    phone: { required, isPhoneNumber }
  },
  methods: {
    confirm() {
      this.$v.$touch();
      console.log(this.$v)
      if (this.$v.$pending || this.$v.$error) return;
      this.$axios.$post('/part/open/store', {
        full_name: this.fullName,
        phone: this.phone.replace(/\D/g, ''),
      })
        .then(res => {
          this.modalVisible = false
          this.fullName = ''
          this.phone = '',
          this.$v.$reset();
          this.$toasted.success(this.$t('your_request_has_been_sent'))
        })
        .catch(error => {
          this.$toasted.error(this.$t('error_occurred'))
        })
    }
  },
  computed: {
    modalVisible: {
      get() {
        return this.visible
      },
      set(val) {
        this.$emit('visible', val)
      }
    }
  }
}
</script>
