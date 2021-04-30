<template>
  <div class="announcements-grid_item" @click="goToAnnouncement">
    <a v-if="!isMobileBreakpoint" target="_blank" :href="getLink" class="abs-link" @click.stop>
      <span class="sr-only">{{ getTitle }}</span>
    </a>
    <div class="item-bg" role="img" :aria-label="getTitle" v-lazy:background-image="getImage">
      <div class="item-overlay">
        <div class="item-overlay_top d-flex">
          <span class="badge from-border" v-if="announcement.is_autosalon">{{ $t('is_autosalon') }}</span>
          <span class="d-flex">
            <span class="badge squared" v-if="announcement.type[1]">
              <icon name="vip" />
            </span>
            <span class="badge squared" v-if="announcement.type[2]">
              <icon name="premium" />
            </span>
          </span>
        </div>
        <div class="item-overlay_bottom d-flex">
          <span class="d-flex">
            <button class="btn-sq btn-sq--color-red" @click.stop>
              <icon name="compare" />
            </button>
            <button class="btn-sq btn-sq--color-dark-blue" @click.stop>
              <icon name="star" />
            </button>
          </span>
          <span class="badge">{{ announcement.humanize_created_at }}</span>
        </div>
      </div>
    </div>
    <div class="item-details">
      <h3 class="text-truncate">
        <span>{{ getTitle }}</span>
      </h3>
      <span class="item-info text-truncate">
        <span>{{ getTextLine }}</span>
      </span>
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
    getType() {
      let item = this.announcement;
      if(item.moto_brand) return 'Motorcycle';
      else if(item.scooter_brand) return 'Scooter';
      else if(item.moto_atv_brand) return 'Atv';
      else if(item.commercial_brand) return 'Commercial';
      return 'Car';
    },
    getLink() {
      return '#0';
    },
    getTitle() {
      let item = this.announcement;
      const brand = item.brand || item.commercial_brand || item.moto_brand || item.scooter_brand || item.moto_atv_brand;
      const model = item.model || item.commercial_model || item.moto_model || item.scooter_model || item.moto_atv_model;
      return `${brand.name[this.locale] || brand.name} ${model.name[this.locale] || this.$translateHard(model.name)}`;
    },
    getTextLine() {
      let text = `${this.announcement.year} ${this.$t('plural_forms_year')[0]}`;
      if (this.getCapacity) text += `, ${this.getCapacity}`;
      text += `, ${this.$readNumber(this.announcement.mileage)} ${this.$t('char_kilometre')}`;
      return text;
    },
    getImage() {
      let item = this.announcement;
      if(item.media && item.media.thumb && item.media.thumb.length)
        return this.$env.baseUrl + item.media.thumb[0];  
      else if(item.media && item.media.length)
        return this.$env.baseUrl + (item.media[0].thumb || item.media[0]);
      return false;
    },
    getCapacity() {
      let item = this.announcement;
      if(item.car_catalog && (!item.car_catalog.capacity || item.car_catalog.capacity === '0')) 
        return false;
      let capacity = item.car_catalog 
        ? item.car_catalog.capacity // show 0.1 L if value less than 50 sm3
        : (item.capacity && item.capacity > 50) ? (((item.capacity) / 1000).toFixed(1)) : item.capacity; 
      let show_litres = item.car_catalog || (item.capacity && item.capacity > 50);
      return capacity ? `${capacity} ${this.$t(show_litres ? 'char_litre' : 'char_sm_cube')}` : false;
    }
  },
  methods: {
    goToAnnouncement() {
      this.fbTrack('ViewContent', {
        content_type: 'product',
        content_category: this.getType,
        content_ids: [this.announcement.id_unique],
        content_name: this.getTitle + ', ' + this.announcement.year
      });
      
      if (!this.isMobileBreakpoint) return;
      this.$router.push(this.getLink);
    }
  }
}
</script>