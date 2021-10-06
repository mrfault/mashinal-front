<template>
  <div class="business-profile__additional-features">

    <div class="row section">
      <div class="col-12 col-lg-6 content">
        <h2 class="section-title heading-dots heading-dots--left">{{ $t('additional_features_1_title') }}</h2>
        <p class="subtitle">
          {{ $t('additional_features_1_desc') }}
        </p>
        <img src="/img/additional_features_illustration_1.svg" alt="" class="illustration-1">
      </div>
      <div class="col-12 col-lg-6">
        <img :src="`/img/additional_features_1_${colorMode}.png`" alt="">
      </div>
    </div>
    <hr class="m-0"/>
    
    <div class="row section">
      <div class="col-12 col-lg-6">
        <img :src="`/img/additional_features_2_${colorMode}.png`" alt="">
      </div>
      <div class="col-12 col-lg-6 content">
        <h2 class="section-title heading-dots heading-dots--left">{{ $t('additional_features_2_title') }}</h2>
        <img src="/img/additional_features_illustration_2.svg" alt="" class="illustration-2">
      </div>
    </div>
    <hr class="m-0"/>
    
    <div class="row section">
      <div class="col-12 col-lg-6 content">
        <h2 class="section-title heading-dots heading-dots--left">{{ $t('additional_features_3_title') }}</h2>
        <p class="subtitle">
          {{ $t('additional_features_3_desc') }}
        </p>
        <img src="/img/additional_features_illustration_3.svg" alt="" class="illustration-3">
      </div>
      <div class="col-12 col-lg-6">
        <img :src="`/img/additional_features_3_${colorMode}.png`" alt="">
      </div>
    </div>
    <hr class="m-0"/>
    
    <div class="row section">
      <div class="col-12 col-lg-6">
        <img :src="`/img/additional_features_4_${colorMode}.png`" alt="">
      </div>
      <div class="col-12 col-lg-6 content">
        <h2 class="section-title heading-dots heading-dots--left">{{ $t('additional_features_4_title') }}</h2>
        <p class="ml-0 text-with-check">
          <icon name="check" />
          <span class="shop-badge">SHOP</span>
          {{ $t('additional_features_4_desc_2') }}
        </p>
        <p class="ml-0 mt-1 text-with-check">
          <icon name="check" />
          {{ $t('additional_features_4_desc_2') }}
        </p>
        <img src="/img/additional_features_illustration_4.svg" alt="" class="illustration-4 mb-4 mb-lg-0">
      </div>
    </div>
    <hr class="m-0"/>
    
    <div class="row section">
      <div class="col-12 col-lg-6 content">
        <h2 class="section-title heading-dots heading-dots--left">{{ $t('additional_features_5_title') }}</h2>
        <img src="/img/additional_features_illustration_5.svg" alt="" class="illustration-5 mb-4 mb-lg-0">
      </div>
      <div class="col-12 col-lg-6">
        <img :src="`/img/additional_features_5_${colorMode}.png`" alt="">
      </div>
    </div>
    <hr class="m-0"/>
    
    <div class="row section">
      <div class="col-12 col-lg-6">
        <img :src="`/img/additional_features_6_${colorMode}.png`" alt="">
      </div>
      <div class="col-12 col-lg-6 content">
        <h2 class="section-title heading-dots heading-dots--left">{{ $t('additional_features_6_title') }}</h2>
        <p class="subtitle">
          {{ $t('additional_features_6_desc') }}
        </p>
        <img src="/img/additional_features_illustration_6.svg" alt="" class="illustration-6">
      </div>
    </div>
  </div>
</template>