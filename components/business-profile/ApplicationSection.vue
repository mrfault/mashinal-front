<template>
  <div class="business-profile__application-section">
    <div class="container">
      <div class="row">
        <div class="col-12 col-lg-4">
          <h2 class="section-title heading-dots heading-dots--left">{{ $t('apply_for_a_business_profile') }}</h2>
          <img src="/img/business-profile/application_form_3.svg" alt="">
        </div>
        <div class="col-12 col-lg-4 middle-images">
          <div class="row">
            <div class="col-auto col-lg-12">
              <img :src="`/img/business-profile/application_form_1_${colorMode}_${locale}.png`" alt="">
            </div>
            <div class="col-auto col-lg-12">
              <img :src="`/img/business-profile/application_form_2_${colorMode}_${locale}.png`" alt="">
            </div>
          </div>
        </div>
        <div class="col-12 col-lg-4">
          <parts-apply where="application" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import PartsApply from '~/components/business-profile/PartsApply';

export default {
  components: {
    PartsApply
  }
}
</script>