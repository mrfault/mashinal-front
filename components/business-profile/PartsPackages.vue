<template>
  <div class="row mt-5">
    <div class="col-lg-8" v-if="!isMobileBreakpoint">
      <features/>
    </div>
    <div class="col-12 col-lg-4">
      <h2 class="section-title heading-dots heading-dots--left m-0 mb-3" v-if="isMobileBreakpoint">
        {{ $t('apply_for_a_business_profile') }}
      </h2>
      <registration-form-parts/>
    </div>
    <div class="col-12" v-if="isMobileBreakpoint">
      <features/>
    </div>
  </div>
</template>

<script>
import RegistrationFormParts from '~/components/business-profile/RegistrationFormParts.vue'
import Features from '~/components/business-profile/Features.vue'

export default {
  components: {
    RegistrationFormParts,
    Features
  }
}
</script>