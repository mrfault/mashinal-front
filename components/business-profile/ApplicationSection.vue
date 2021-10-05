<template>
  <div class="business-profile__application-section">
    <div class="container">
      <div class="row">
        <div class="col-12 col-lg-5">
          <h2 class="section-title heading-dots heading-dots--left">Biznes profili üçün müraciət et</h2>
          <img src="/img/application_form_3.svg" alt="" draggable="false">
        </div>
        <div class="col-12 col-lg-2 middle-images">
          <img src="/img/application_form_1.svg" alt="" draggable="false">
          <img src="/img/application_form_2.png" alt="" draggable="false">
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
import RegistrationFormParts from '~/components/business-profile/RegistrationFormParts.vue';
import RegistrationFormSalon from '~/components/business-profile/RegistrationFormSalon.vue';

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