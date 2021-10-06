<template>
  <div class="business-profile__advantages">
    <div class="row">
      <div class="col-lg-8">
        <h2 class="section-title heading-dots heading-dots--left m-0">{{ $t('advantages_title') }}</h2>
        <p class="text-with-check">
          <icon name="check" />
          {{ $t('advantages_desc_1') }}
        </p>
        <p class="text-with-check">
          <icon name="check" />
          {{ $t('advantages_desc_2') }}
        </p>
        <p class="text-with-check">
          <icon name="check" />
          {{ $t('advantages_desc_3') }}
        </p>
        <p class="text-with-check">
          <icon name="check" />
          {{ $t('advantages_desc_4') }}
        </p>
        <p class="text-with-check">
          <icon name="check" />
          {{ $t('advantages_desc_5') }}
        </p>
        <p class="text-with-check">
          <icon name="check" />
          {{ $t('advantages_desc_6') }}
        </p>
      </div>
      <div class="col-lg-4">
        <img :src="`/img/advantages_illustration_1_${colorMode}.svg`" alt="">
      </div>
    </div>
  </div>
</template>

<script>
export default {

}
</script>