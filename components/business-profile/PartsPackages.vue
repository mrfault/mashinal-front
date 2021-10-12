<template>
  <div class="row mt-5 flex-lg-row-reverse">
    <div class="col-12 col-lg-4">
      <h2 class="section-title heading-dots heading-dots--left m-0 mb-3" v-if="isMobileBreakpoint">
        {{ $t('apply_for_a_business_profile') }}
      </h2>
      <parts-apply />
    </div>
    <div class="col-12 col-lg-8">
      <features />
    </div>
  </div>
</template>

<script>
import PartsApply from '~/components/business-profile/PartsApply';
import Features from '~/components/business-profile/Features';

export default {
  components: {
    PartsApply,
    Features
  }
}
</script>