<template>
  <button type="button" :class="['btn btn--green-outline full-width', { pending }]" @click="openFiles">
    {{ $t('watch_files') }}
  </button>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  props: {
    protocol: {}
  },
  data() {
    return {
      pending: false,
      showFilesLightbox: false
    }
  },
  computed: {
    ...mapGetters({
      files: 'garage/protocolFiles'
    })
  },
  methods: {
    ...mapActions({
      getProtocolFiles: 'garage/getProtocolFiles'
    }),

    async openFiles() {
      if (this.pending) return;
      this.pending = true;
      try {
        const res = await this.getProtocolFiles({ din_id: this.protocol.din_id });
        this.pending = false;
        if (res.status === 'success') {
          this.showFilesLightbox = true;
        }
      } catch(err) {
        this.pending = false;
      }
    }
  }
}
</script>