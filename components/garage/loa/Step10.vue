<template>
  <form class="form" @submit.prevent="submit" novalidate>
    <div class="info-text full-width mb-3"><icon name="alert-circle" /> 
      <span>{{ $t('video_recording_info_text') }}</span>
    </div>
    <hr class="mb-3" />
    <div class="row justify-content-end">
      <div class="col-12 col-lg-1-5">
        <button type="submit" :class="['btn btn--green full-width', { pending }]">
          {{ $t('confirm') }}
        </button>
      </div>
    </div>
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
    
    updateData() {

    },
    submit() {
      if (this.pending) return;
      this.pending = true;
      try {
        this.pending = false;
        this.updateData();
        this.$emit('confirm');
      } catch (err) {
        this.pending = false;
      }
    }
  }
}
</script>