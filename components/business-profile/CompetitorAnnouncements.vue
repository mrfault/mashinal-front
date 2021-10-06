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
        Elanlarınızın altında rəqib elanların olmaması
      </h2>
      <h3 class="section-subtitle">Daha çox müştəri cəlb edin, diqqət yalnız sizin elanlarda olsun</h3>
    </div>
    <div class="images">
      <img :src="`/img/competitor_announcements_1_${colorMode}.svg`" alt="">
      <img :src="`/img/competitor_announcements_2_${colorMode}.svg`" alt="">
    </div>
  </div>
</template>