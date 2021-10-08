<template>
  <div class="business-profile__application-section">
    <div class="container">
      <div class="row">
        <div class="col-12 col-lg-5">
          <h2 class="section-title heading-dots heading-dots--left">{{ $t('apply_for_a_business_profile') }}</h2>
          <img src="/img/application_form_3.svg" alt="">
        </div>
        <div class="col-12 col-lg-2 middle-images">
          <div class="row">
            <div class="col-auto col-lg-12">
              <img :src="`/img/application_form_1_${colorMode}.svg`" alt="">
            </div>
            <div class="col-auto col-lg-12">
              <img :src="`/img/application_form_2_${colorMode}.png`" alt="">
            </div>
          </div>
        </div>
        <div class="col-12 col-lg-1">
        </div>
        <div class="col-12 col-lg-4">
          <registration-form-salon v-if="type === 'autosalon'"/>
          <registration-form-parts v-if="type === 'parts'"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import RegistrationFormParts from '~/components/business-profile/RegistrationFormParts';
import RegistrationFormSalon from '~/components/business-profile/RegistrationFormSalon';

export default {
  props: {
    type: {
      type: String,
      required: true
    },
  },
  components: {
    RegistrationFormParts,
    RegistrationFormSalon
  }
}
</script>