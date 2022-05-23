<template>
  <div>
    <promotion
      isPanoramaPage
      :title="$t('chance_to_place_an_announcement_with_panorama')"
      :subTitle="$t('place_panoramic_photo_from_mobile_phone')"
      footerImage="/promotions/phone-content-2.png"
    >
      <template v-slot:mainForm>
        <button class="btn btn--green w-100" @click="gotoRoute()">
          {{ $t('place_an_ad') }}
        </button>
      </template>
    </promotion>
  </div>
</template>

<script>
import promotion from '~/components/promotions/promotion.vue'
export default {
  components: { promotion },
  head() {
    return this.$headMeta({
      title: this.$t('promotions'),
      pending: false,
    })
  },
  methods: {
    gotoRoute() {
      // console.log('clicked');
      this.$router.push(`/${this.$t('sell')}`)
    },
  },
  created() {
    this.$route.meta.name = 'promotions-page'
  },
}
</script>

<style></style>
