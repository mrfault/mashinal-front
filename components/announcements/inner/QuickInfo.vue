<template>
  <div class="quick-info card mb-2 mb-lg-3">
    <h1>{{ title }}</h1>
    <div class="price">
      <span>{{ announcement.price }}</span>
      <span><icon name="exchange" /> {{ announcement.price_converted }}</span>
    </div>
    <hr />
    <div class="contact">
      <div class="img">
        <img :src="contact.img" alt="" />
      </div>
      <div class="info">
        <h2>{{ contact.name }}</h2>
        <address>{{ contact.address }}</address>
      </div>
    </div>
    <div class="row">
      <div class="col">
        <div class="btn btn--dark-blue full-width">
          <icon name="placeholder" /> {{ $t('map') }}
        </div>
      </div>
      <div class="col">
        <div class="btn btn--dark-blue-2-outline full-width">
          <icon name="chat" /> {{ $t('write') }}
        </div>
      </div>
    </div>
    <div class="row mt-2 mt-lg-3">
      <div class="col">
        <div class="btn btn--pale-green full-width justify-content-between">
          {{ $t('show_number') }} <icon name="eye" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  computed: {
    ...mapGetters(['announcement']),

    title() {
      if (this.announcement.car_catalog)
        return this.announcement.car_catalog.brand.name + ' ' + this.$translateHard(this.announcement.car_catalog.model.name);
      else if (this.announcement.scooter_brand)
        return this.announcement.scooter_brand.name + ' ' + this.announcement.scooter_model.name;
      else if (this.announcement.moto_atv_brand)
        return this.announcement.moto_atv_brand.name + ' ' + this.announcement.moto_atv_model.name;
      else if (this.announcement.moto_brand)
        return this.announcement.moto_brand.name + ' ' + this.announcement.moto_model.name;
      else if (this.announcement.commercial_brand)
        return this.$translateSoft(this.announcement.commercial_brand.name) + ' ' + this.$translateSoft(this.announcement.commercial_model.name);
      else if (this.announcement.part_category?.name)
        return this.$translateSoft(this.announcement.part_category.name);
      return '';
    },
    contact() {
      return {
        type: 'user',
        user: this.announcement.user,
        id: this.announcement.user.id,
        name: this.announcement.user.full_name,
        phones: [this.announcement.user.phone],
        address: this.announcement.address,
        img: this.announcement.user.avatar ? `${this.$env.baseUrl}/storage/${this.announcement.user.avatar}` : '',
        lat: this.announcement.latitude ? parseFloat(this.announcement.latitude) : 0,
        lng: this.announcement.longitude ? parseFloat(this.announcement.longitude) : 0,
        link: this.announcement.is_autosalon ? this.$localePath(`/salons/${this.announcement.user.autosalon.id}`) : false
      };
    }
  }
}
</script>