<template>
  <form class="form" @submit.prevent="submit" novalidate>
    <div class="scrollable-text mb-2 mb-lg-3">
      <vue-scroll>
        <div class="scrollable-text_scrollview" v-html="$t('mobile_notariat_rules')"></div>
      </vue-scroll>
    </div>
    <hr class="mt-0 mb-2 mb-lg-3" />
    <form-checkbox 
      :label="$t('mobile_notariat_confirm')" 
      input-name="mobile_notariat_confirm"
      v-model="mobileNotariatConfirm" 
      transparent skip-truncate
      class="mb-3"
    />
    <button type="submit" :class="['btn btn--green full-width', { pending, 'disabled': !mobileNotariatConfirm }]">
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

    mobileNotariatConfirm: {
      get() { 
        return this.stepSendData['6'].mobileNotariatConfirm
      },
      set(value) { 
        this.updateSendData({ step: 6, param: 'mobileNotariatConfirm', value });
      }
    }
  },
  methods: {
    ...mapActions('letterOfAttorney', ['updateSendData', 'updateReceivedData']),

    updateData() {
      this.updateReceivedData([
        { 
          step: 6, 
          param: 'mobileNotariatConfirm', 
          value: this.mobileNotariatConfirm
        }
      ]);
    },
    submit() {
      if (this.pending) return;
      this.pending = true;
      try {
        this.pending = false;
        this.updateData();
        this.$emit('next');
      } catch (err) {
        this.pending = false;
      }
    }
  }
}
</script>