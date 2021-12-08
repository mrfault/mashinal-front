<template>
  <form class="form" @submit.prevent="submit" novalidate>
    <button type="submit" :class="['btn btn--green full-width', { pending }]">
      {{ $t('go_further') }}
    </button>
  </form>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  data() {
    return {
      pending: false
    }
  },
  computed: {
    ...mapGetters('letterOfAttorney', ['stepSendData']),
  },
  methods: {
    ...mapActions('letterOfAttorney', ['updateSendData']),

    submit() {
      this.$emit('next');
    }
  }
}
</script>