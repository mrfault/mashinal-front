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
        İdarəetmə paneli
      </h2>
      <h3 class="section-subtitle">Hesabınıza dair bütün statistik məlumatlar və göstəricilər bir paneldə</h3>
    </div>
    <div class="images">
      <img :src="`/img/control_panel_1_${colorMode}.svg`" alt="">
      <img :src="`/img/control_panel_2_${colorMode}.svg`" alt="">
      <img :src="`/img/control_panel_3_${colorMode}.svg`" alt="">
      <img :src="`/img/control_panel_4_${colorMode}.svg`" alt="">
      <img :src="`/img/control_panel_5_${colorMode}.svg`" alt="">
      <img :src="`/img/control_panel_6_${colorMode}.svg`" alt="">
      <img :src="`/img/control_panel_7_${colorMode}.svg`" alt="">
      <img :src="`/img/control_panel_8_${colorMode}.svg`" alt="">
    </div>
  </div>
</template>