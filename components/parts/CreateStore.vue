<template>
  <modal-popup
    :toggle="modalVisible" 
    :title="$t('create_online_store')"
    @close="modalVisible = false"
    class="create-store"
  >
    <form-text-input 
      :placeholder="$t('name') +', '+ $t('surname')" 
      v-model="fullName"
      class="mb-3"
    />
    <form-text-input 
      :placeholder="$t('mobile_number')" 
      v-model="phone"
      class="mb-2"
    />
    <p class="create-store__desc mb-2">Qısa zaman ərzində sizinlə əlaqə yaradılacaq.</p>
    <button
      class="btn btn--green full-width"
      :disabled="!fullName || !phone"
      @click.prevent="confirm"
    >
      {{ $t('confirm') }}
    </button>
  </modal-popup>
</template>

<script>
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
  methods: {
    confirm() {
      this.$axios.$post('/part/open/store', {
        full_name: this.fullName,
        phone: this.phone.replace(/\D/g, ''),
      })
        .then(res => {
          this.modalVisible = false
          this.fullName = ''
          this.phone = ''
        })
        .catch(error => {
          console.error(error)
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
