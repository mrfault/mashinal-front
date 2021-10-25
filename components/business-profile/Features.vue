<template>
  <div class="business-profile__features">
    <!-- <div class="col-lg-6"> -->
      <div class="feature">
        <div class="feature__background"></div>
        <div class="feature__foreground">
          <img class="feature__bookmark" src="/icons/bookmark.svg"/>
          <div class="feature__title">{{ $t('features_1_title') }}</div>
          <div class="feature__text">{{ partsPackages[0].price }} ₼</div>
        </div>
      </div>
    <!-- </div>
    <div class="col-lg-6"> -->
      <div class="feature">
        <div class="feature__background"></div>
        <div class="feature__foreground">
          <img class="feature__bookmark" src="/icons/bookmark.svg"/>
          <div class="feature__title">{{ $t('features_2_title') }}</div>
          <div class="feature__text">
            <img src="/icons/infinity.svg" />
          </div>
        </div>
      </div>
    <!-- </div>
    <div class="col-lg-6"> -->
      <div class="feature">
        <div class="feature__background"></div>
        <div class="feature__foreground">
          <img class="feature__bookmark" src="/icons/bookmark.svg"/>
          <div class="feature__title">{{ $t('features_3_title') }}</div>
          <div class="feature__text">0 ₼</div>
        </div>
      </div>
    <!-- </div>
    <div class="col-lg-6"> -->
      <div class="feature">
        <div class="feature__background"></div>
        <div class="feature__foreground">
          <img class="feature__bookmark" src="/icons/bookmark.svg"/>
          <div class="feature__title">{{ $t('features_4_title') }}</div>
          <div class="feature__text">{{ partsPackages[0].service_price }} ₼</div>
        </div>
      </div>
    <!-- </div> -->
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  computed: {
    ...mapGetters({
      partsPackages: 'packages/partsPackages'
    })
  }
}
</script>
