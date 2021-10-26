<template>
  <div class="business-profile__control-panel">
    <div :class="{'text-center': !isMobileBreakpoint}">
      <h2 :class="['section-title heading-dots', {'heading-dots--left': isMobileBreakpoint}]">
        {{ $t('control_panel_title') }}
      </h2>
      <h3 class="section-subtitle">{{ $t('control_panel_desc') }}</h3>
    </div>
    <div class="images">
      <img
        v-for="i in 8"
        :key="i"
        :src="`/img/business-profile/control_panel_${i}_${i === 6 ? `${profileType}_` : ''}${colorMode}_${locale}.png`"
      />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  computed: {
    ...mapGetters({
      profileType: 'packages/profileType'
    })
  }
}
</script>