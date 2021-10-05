<template>
  <div class="business-profile__application-section">
    <div class="container">
      <div class="row">
        <div class="col-12 col-lg-5">
          <h2 class="section-title heading-dots heading-dots--left">Elanlarınızın altında rəqib elanların olmaması</h2>
        </div>
        <div class="col-12 col-lg-2">
        </div>
        <div class="col-12 col-lg-1">
        </div>
        <div class="col-12 col-lg-4">
          <!-- <registration-form-salon /> -->
          <registration-form-parts />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import RegistrationFormParts from '~/components/business-profile/RegistrationFormParts.vue';
import RegistrationFormSalon from '~/components/business-profile/RegistrationFormSalon.vue';

export default {
  components: {
    RegistrationFormParts,
    RegistrationFormSalon
  }
}
</script>