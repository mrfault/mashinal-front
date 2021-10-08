<template>
  <div class="business-profile__application-section">
    <div class="container">
      <div class="row">
        <div class="col-12 col-lg-4">
          <h2 class="section-title heading-dots heading-dots--left">{{ $t('apply_for_a_business_profile') }}</h2>
          <img src="/img/application_form_3.svg" alt="">
        </div>
        <div class="col-12 col-lg-4 middle-images">
          <div class="row">
            <div class="col-auto col-lg-12">
              <img :src="`/img/application_form_1_${colorMode}.svg`" alt="">
            </div>
            <div class="col-auto col-lg-12">
              <img :src="`/img/application_form_2_${colorMode}.png`" alt="">
            </div>
          </div>
        </div>
        <div class="col-12 col-lg-4">
          <registration-form-parts />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import RegistrationFormParts from '~/components/business-profile/RegistrationFormParts';

export default {
  components: {
    RegistrationFormParts
  }
}
</script>