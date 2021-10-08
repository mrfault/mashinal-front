<template>
  <div class="business-profile__packages">
    <div :class="{'text-center': !isMobileBreakpoint}">
      <h2
        :class="{
          'section-title': true,
          'heading-dots': true,
          'heading-dots--left': isMobileBreakpoint
        }"
      >
        {{ $t('business_profile_packages') }}
      </h2>
    </div>
    <div class="packages">
      <div
        class="package card"
        :class="{'package--active': selectedPackage === index}"
        v-for="(item, index) in packages"
        :key="index"
        @click="selectedPackage = index"
      >
        <div
          class="package__radio"
          :class="{'package__radio--checked': selectedPackage === index}"
        />
        <div class="package__price">{{ item.price }} ₼</div>
        <div class="package__name">{{ item.name }}</div>
        <hr />
        <div class="package__details">
          <p class="mx-0 mt-1 text-with-check">
            <icon name="check" />
            {{ $t('announcement_count') }} - {{ item.announcementCount }}
          </p>
          <p class="mx-0 mt-1 text-with-check">
            <icon name="check" />
            <icon name="wallet" />
            - {{ item.alManat }} ALM
          </p>
        </div>
      </div>
    </div>
    <button class="btn btn--green align-self-center">{{ $t('pay_online') }}</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      packages: [
        {
          price: 1000,
          name: this.$t('Limitsiz'),
          announcementCount: this.$t('Limitsiz'),
          alManat: '400'
        },
        {
          price: 800,
          name: this.$t('Pro'),
          announcementCount: '100',
          alManat: '400'
        },
        {
          price: 600,
          name: this.$t('Platinium'),
          announcementCount: '30',
          alManat: '300'
        },
        {
          price: 400,
          name: this.$t('Qızıl'),
          announcementCount: '20',
          alManat: '200'
        },
        {
          price: 200,
          name: this.$t('Gümüş'),
          announcementCount: '10',
          alManat: '100'
        },
        {
          price: 100,
          name: this.$t('Bürünc'),
          announcementCount: '5',
          alManat: '50'
        },
      ],
      selectedPackage: 0
    }
  }
}
</script>