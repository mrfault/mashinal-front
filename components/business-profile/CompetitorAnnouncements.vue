<template>
  <div class="business-profile__competitor_announcements">
    <div :class="{'text-center': !isMobileBreakpoint}">
      <h2
        :class="{
          'section-title': true,
          'heading-dots': true,
          'heading-dots--left': isMobileBreakpoint
        }"
      >
        {{ $t('competitor_announcements_title') }}
      </h2>
      <h3 class="section-subtitle">{{ $t('competitor_announcements_desc') }}</h3>
    </div>
    <div class="images">
      <img :src="`/img/competitor_announcements_1_${colorMode}.svg`" alt="" draggable="false">
      <img :src="`/img/competitor_announcements_2_${colorMode}.svg`" alt="" draggable="false">
    </div>
  </div>
</template>