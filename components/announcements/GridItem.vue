<template>
  <div class="announcements-grid_item">
    <div class="item-bg" role="img" :aria-label="getTitle" v-lazy:background-image="getImage">
      
    </div>
    <div class="item-details">
      <h3 class="text-truncate"><span>{{ getTitle }}</span></h3>
      <span class="item-info">{{ `${announcement.year} ${$t('plural_forms_year')[0]}, ${$readNumber(announcement.mileage)} ${$t('char_kilometre')}` }}</span>
      <span class="item-price">
        <span>{{ announcement.price }}</span>
        <icon name="percent" v-if="announcement.credit"/>
        <icon name="barter" v-if="announcement.tradeable || announcement.exchange_possible"/>
      </span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    announcement: {}
  },
  computed: {
    getLink() {
      return '';
    },
    getTitle() {
      let item = this.announcement;
      const brand = item.brand || item.commercial_brand || item.moto_brand || item.scooter_brand || item.moto_atv_brand;
      const model = item.model || item.commercial_model || item.moto_model || item.scooter_model || item.moto_atv_model;
      return `${brand.name[this.locale] || brand.name} ${model.name[this.locale] || this.$translateHard(model.name)}`;
    },
    getImage() {
      let item = this.announcement;
      if(item.media && item.media.thumb && item.media.thumb.length)
        return this.$env.baseUrl + item.media.thumb[0];  
      else if(item.media && item.media.length)
        return this.$env.baseUrl + (item.media[0].thumb || item.media[0]);
      return false;
    }
  }
}
</script>