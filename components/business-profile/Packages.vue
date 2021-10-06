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
        Biznes profili paketləri
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
            Elan sayı - {{ item.announcementCount }}
          </p>
          <p class="mx-0 mt-1 text-with-check">
            <icon name="check" />
            <icon name="wallet" />
            - {{ item.alManat }} ALManat
          </p>
        </div>
      </div>
    </div>
    <button class="btn btn--green align-self-center">Onlayn ödə</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      packages: [
        {
          price: 1000,
          name: 'Limitsiz',
          announcementCount: 'Limitsiz',
          alManat: '400'
        },
        {
          price: 800,
          name: 'Pro',
          announcementCount: '100',
          alManat: '400'
        },
        {
          price: 600,
          name: 'Platinium',
          announcementCount: '30',
          alManat: '300'
        },
        {
          price: 400,
          name: 'Qızıl',
          announcementCount: '20',
          alManat: '200'
        },
        {
          price: 200,
          name: 'Gümüş',
          announcementCount: '10',
          alManat: '100'
        },
        {
          price: 100,
          name: 'Bürünc',
          announcementCount: '5',
          alManat: '50'
        },
      ],
      selectedPackage: 0
    }
  }
}
</script>