<template>
  <div class="row">
    <div class="col-12 col-md-12 col-lg-6">
      <div class="garage_no-cars card height-100">
        <div class="text-center">
          <img src="/images/google-docs.png" alt="" />
          <p class="text-red mb-1 mb-lg-3">{{ $t('no_attorneys_found') }}</p>
          <add-car class="mb-lg-3" />
          <div class="justify-end">
            <letter-of-attorney-button></letter-of-attorney-button>
          </div>
        </div>
      </div>
    </div>
    <div class="col-12 col-md-12 col-lg-6 h-100 mb-5 mb-lg-0">
      <div class="card height-100">
        <h2 class="title-with-line">
          <span>{{ $t('rules_of_giving_attorney') }}</span>
        </h2>
        <p class="mb-2">{{ $t('empty_garage_part_1') }}</p>
        <p class="mb-2">{{ $t('empty_garage_part_2') }}</p>
        <p class="mb-2">{{ $t('empty_garage_part_3') }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import LetterOfAttorneyButton from './loa/LetterOfAttorneyButton.vue'
export default {
  components: {
    LetterOfAttorneyButton,
  },
}
</script>

<style>
.justify-end{
  margin-top: auto;
}
</style>
