<template>
  <div class="business-profile__contact-us">
    <div class="container">
      <div class="row">
        <div class="col-12 col-lg-4">
          <h2 class="section-title heading-dots heading-dots--left">{{ $t('contact_us') }}</h2>
          <img :src="`/img/business-profile/contact_us_1_${colorMode}.svg`" alt="">
        </div>
        <div class="col-12 col-lg-4 middle-images">
          <div class="row">
            <div class="col-auto col-lg-12">
              <img :src="`/img/business-profile/contact_us_2_${colorMode}_${locale}.png`" alt="">
            </div>
            <div class="col-auto col-lg-12">
              <img :src="`/img/business-profile/contact_us_3_${colorMode}_${locale}.png`" alt="">
            </div>
          </div>
        </div>
        <div class="col-12 col-lg-4">
          <salon-apply />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SalonApply from '~/components/business-profile/SalonApply';

export default {
  components: {
    SalonApply
  }
}
</script>