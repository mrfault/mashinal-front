<template>
  <div class="business-profile__control-panel">
    <div :class="{'text-center': !isMobileBreakpoint}">
      <h2
        :class="{
          'section-title': true,
          'heading-dots': true,
          'heading-dots--left': isMobileBreakpoint
        }"
      >
        {{ $t('control_panel_title') }}
      </h2>
      <h3 class="section-subtitle">{{ $t('control_panel_desc') }}</h3>
    </div>
    <div class="images">
      <img
        v-for="(e, i) in Array(8)"
        :key="i"
        :src="`/img/business-profile/control_panel_${i+1}_${colorMode}_${locale}.png`"
      />
    </div>
  </div>
</template>