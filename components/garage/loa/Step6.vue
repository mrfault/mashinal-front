<template>
  <form class="form" @submit.prevent="submit" novalidate>
    <div class="scrollable-text mb-2 mb-lg-3">
      <vue-scroll>
        <div class="scrollable-text_scrollview">
          <div class="iframe mb-2" v-if="true">
            <iframe
              src="https://www.youtube.com/embed/Wo1wmo5qxeQ"
              frameborder="0"
              allowfullscreen
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            ></iframe>
          </div>
          <div v-html="$t('mobile_notariat_rules')"></div>
        </div>
      </vue-scroll>
    </div>
    <hr class="mt-0 mb-2 mb-lg-3" />
    <form-checkbox
      :label="$t('mobile_notariat_confirm')"
      input-name="mobile_notariat_confirm"
      v-model="mobileNotariatConfirm"
      transparent
      skip-truncate
      class="mb-3 step-6__form white-space-pre-wrap"
    />
    <button
      type="submit"
      :class="[
        'btn btn--green full-width',
        { pending, disabled: !mobileNotariatConfirm },
      ]"
    >
      {{ $t('go_further') }}
    </button>
  </form>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  data() {
    return {
      pending: false,
    }
  },
  computed: {
    ...mapGetters('letterOfAttorney', ['stepSendData', 'hasGeneralPower']),

    mobileNotariatConfirm: {
      get() {
        return this.stepSendData.mobileNotariatConfirm
      },
      set(value) {
        this.updateSendData({ key: 'mobileNotariatConfirm', value })
      },
    },
  },
  methods: {
    ...mapActions('letterOfAttorney', ['updateSendData']),

    submit() {
      if (!this.mobileNotariatConfirm) return
      this.$emit('next')
    },
  },
}
</script>
