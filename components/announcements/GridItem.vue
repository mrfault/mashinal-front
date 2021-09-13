<template>
  <div class="announcements-grid_item" @click="goToAnnouncement">
    <a v-if="!isMobileBreakpoint && !$env.DEV" target="_blank" :href="getLink" class="abs-link" @click.stop>
      <span class="sr-only">{{ getAnnouncementTitle(announcement) }}</span>
    </a>
    <div class="item-bg" role="img" :aria-label="getAnnouncementTitle(announcement)" v-lazy:background-image="getImage">
      <div class="item-overlay">
        <div class="item-overlay_top d-flex">
          <template v-if="showStatus">
            <span class="badge from-border active" v-if="announcement.status == 1">{{ $t('accepted')}}</span>
            <span class="badge from-border pending" v-else-if="announcement.status == 2 && announcement.system_paid_announce && !announcement.system_paid_announce.is_paid">{{ $t('need_pay')}}</span>
            <span class="badge from-border pending" v-else-if="announcement.status == 2">{{ $t('under_consideration')}}</span>
            <span class="badge from-border rejected" v-else-if="announcement.status == 0">{{ $t('rejected')}}</span>
            <span class="badge from-border inactive" v-else-if="announcement.status == 3">{{ $t('inactive')}}</span>
          </template>
          <template v-else-if="announcement.is_autosalon">
            <span class="badge from-border">{{ $t(announcement.title ? 'shop' : 'is_autosalon') }}</span>
          </template>
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
          <span class="d-flex" v-if="announcement.status == 1">
            <add-comparison :announcement="announcement" v-if="getType === 'Car'"/>
            <add-favorite :announcement="announcement" />
          </span>
          <span class="badge">{{ announcement.humanize_created_at }}</span>
        </div>
      </div>
    </div>
    <div class="item-details">
      <h3 class="text-truncate">
        <span>{{ getAnnouncementTitle(announcement) }}</span>
      </h3>
      <span class="item-info text-truncate" v-if="getTextLine">
        <span>{{ getTextLine }}</span>
      </span>
      <span class="item-price">
        <span>{{ announcement.price }}</span>
        <icon name="percent" v-if="announcement.credit"/>
        <icon name="barter" v-if="announcement.tradeable || announcement.exchange_possible"/>
      </span>
      <span class="d-flex mt-auto" @click.stop v-if="showCheckbox || showPhoneCount">
        <span class="call-count" v-if="announcement.show_phone_number_count || showPhoneCount">
          <icon name="phone-call" />
          {{ announcement.show_phone_number_count || 0 }}
        </span>
        <div class="item-checkbox" v-if="showCheckbox">
          <form-checkbox :value="selected" :input-name="`selected_${announcement.id_unique}`" transparent
            @input="handleChange" />
        </div>
      </span>
    </div>
  </div>
</template>

<script>
import AddFavorite from '~/components/announcements/AddFavorite';
import AddComparison from '~/components/announcements/AddComparison';

export default {
  props: {
    announcement: {},
    showStatus: Boolean,
    showCheckbox: Boolean,
    showPhoneCount: Boolean,
    trackViews: Boolean
  },
  components: {
    AddFavorite,
    AddComparison
  },
  data() {
    return {
      selected: false
    }
  },
  computed: {
    getType() {
      let item = this.announcement;
      if (item.moto_brand) return 'Motorcycle';
      else if (item.scooter_brand) return 'Scooter';
      else if (item.moto_atv_brand) return 'Atv';
      else if (item.commercial_brand) return 'Commercial';
      else if (item.car_catalog) return 'Car';
      else if (item.title) return 'Part';
      return '';
    },
    getLink() {
      let type = 'cars';
      if (['Motorcycle','Scooter','Atv'].includes(this.getType)) type = 'moto';
      else if (['Commercial'].includes(this.getType)) type = 'commercial';
      else if (['Part'].includes(this.getType)) type = 'parts';
      let path = `/${type}/announcement/${this.announcement.id_unique}`;
      return this.$localePath(path);
    },
    getTextLine() {
      if (['Part'].includes(this.getType)) return this.announcement.description;
      let text = `${this.announcement.year} ${this.$t('plural_forms_year')[0]}`;
      if (this.getCapacity) text += `, ${this.getCapacity}`;
      text += `, ${this.$readNumber(this.announcement.mileage)} ${this.$t('char_kilometre')}`;
      return text;
    },
    getImage() {
      let item = this.announcement;
      if (item.media && item.media.thumb && item.media.thumb.length)
        return this.$withBaseUrl(item.media.thumb[0]);  
      else if (item.media && item.media.length)
        return this.$withBaseUrl(item.media[0].thumb || item.media[0]);
      return false;
    },
    getCapacity() {
      let item = this.announcement;
      if (item.car_catalog && (!item.car_catalog.capacity || item.car_catalog.capacity === '0')) 
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
      if (this.trackViews) {
        this.fbTrack('ViewContent', {
          content_type: 'product',
          content_category: this.getType,
          content_ids: [this.announcement.id_unique],
          content_name: this.getAnnouncementTitle(this.announcement) + ', ' + this.announcement.year
        });
      }
      
      if (!this.isMobileBreakpoint && !this.$env.DEV) return;
      this.$router.push(this.getLink);
    },
    handleChange(value) {
      this.selected = value;
      this.$nuxt.$emit('select-announcement', this.announcement.id_unique, value, true);
    },
    selectAnnouncement(id, value, controls = false) {
      if (controls || (id != this.announcement.id_unique)) return;
      this.handleChange(value);
    }
  },
  mounted() {
    this.$nuxt.$on('select-announcement', this.selectAnnouncement);
  },
  beforeDestroy() {
    this.$nuxt.$off('select-announcement', this.selectAnnouncement);
  }
}
</script>