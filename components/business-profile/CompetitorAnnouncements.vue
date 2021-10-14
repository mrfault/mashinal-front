<template>
  <div class="business-profile__competitor-announcements">
    <div :class="{'text-center': !isMobileBreakpoint}">
      <h2 :class="['section-title','heading-dots',{'heading-dots--left': isMobileBreakpoint}]">
        {{ $t('competitor_announcements_title') }}
      </h2>
      <h3 class="section-subtitle">{{ $t('competitor_announcements_desc') }}</h3>
    </div>
    <div class="images">
      <img :src="`/img/business-profile/competitor_announcements_1_${colorMode}_${locale}.png`" alt="">
      <img :src="`/img/business-profile/competitor_announcements_2_${colorMode}_${locale}.png`" alt="">
    </div>
  </div>
</template>