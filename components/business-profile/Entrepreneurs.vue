<template>
  <div class="business-profile__entrepreneurs">
    <div class="text-center">
      <h2>
        <em>500</em> sahibkar artıq mashin.al-da öz biznesini uğurla inkişaf etdirir
      </h2>
    </div>

    <div class="entrepreneurs-list card">
      <div
        v-for="(vendetta, index) in visibleEntrpreneurs"
        :key="index"
        class="entrepreneur"
      >
        <img :src="vendetta.image" alt="">
        <div class="entrepreneur__name">{{ vendetta.name }}</div>
      </div>
    </div>

    <button class="btn btn--dark-blue-2-outline mt-5 show-more" @click="showAll = !showAll">
      {{ showAll ? $t('less') : $t('More') }}
      <icon :name="showAll ? 'arrow-top' : 'arrow-down'" />
    </button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      entrepreneurs: [
        {
          image: "https://i.pinimg.com/originals/03/e1/b0/03e1b0207489ad32d10b9a860ffc6623.png",
          name: "Mercedes"
        },
        {
          image: "https://www.carlogos.org/car-logos/nikola-logo-2000x1500.png",
          name: "Nikola"
        },
        {
          image: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bd/Tesla_Motors.svg/1587px-Tesla_Motors.svg.png",
          name: "Tesla"
        }
      ],
      showAll: false,
      defaultVisibleItemCount: 40
    }
  },
  computed: {
    visibleEntrpreneurs() {
      const data = [].concat(...[...Array(20).keys()].map(() => this.entrepreneurs))

      if (this.showAll) {
        return data
      } else {
        return data.slice(0, this.defaultVisibleItemCount)
      }
    }
  }
}
</script>Accordion