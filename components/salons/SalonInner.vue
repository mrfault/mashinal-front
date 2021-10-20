<template>
  <div class="salon-inner">
    <div :class="['card profile-card salon-single-card overflow-hidden mt-0 mb-lg-3', salonSingle.description ? 'mb-n3' : 'mb-2']">
      <div class="cover-with-avatar">
        <div class="cover" :style="{backgroundImage: `url('${getCover(salonSingle.cover, salonSingle.type_id)}')`}">
          <img class="avatar" :src="getLogo(salonSingle.logo)" :alt="salonSingle.name || salonSingle.user.full_name" />
          <span class="badge">SHOP</span>
          <div class="socials" @click.stop>
            <a v-for="social in ['facebook','instagram']" :key="social" :href="salonSingle[social]" rel="noopener" target="_blank">
              <icon :name="social" />
            </a>
          </div>
        </div>
        <nuxt-link class="edit-link" :to="$localePath(`/dashboard/${salonSingle.type_id}/settings`)" @click.native="setPageRef($route.path)" v-if="salonIsOwner(salonSingle)">
          <icon name="edit" />
        </nuxt-link>
      </div>
      <h2 class="title-with-line text-center">
        <span>{{ $t('salon') }} "{{ salonSingle.name || salonSingle.user.full_name }}"</span>
      </h2>
      <div class="row align-items-lg-end profile_info">
        <template v-if="salonSingle.phones && salonSingle.phones.length">
          <div :class="`col-lg-${messengers.length ? 9 : 12} mb-2`">
            <div class="profile_info-details">
              <icon name="phone-call" />
              <span v-html="getConcatPhones(salonSingle.phones, 3, true, { 
                  telegram: salonSingle.telegram || [], 
                  whatsapp: salonSingle.whatsapp || []  
                }, salonSingle.short_number)" 
              ></span>
            </div>
          </div>
          <div class="col-lg-3 mb-2" v-if="!isMobileBreakpoint && messengers.length">
            <div class="profile_info-details">
              <img src="/icons/whatsapp-circle.svg" alt="" v-if="messengers.includes('Whatsapp')" />
              <img src="/icons/telegram-circle.svg" alt="" v-if="messengers.includes('Telegram')" />
              <span>{{ $t('wp_write_us', {msg: messengers}) }}</span>
            </div>
          </div>
        </template>
        <div :class="`col-lg-${hasWorkingHours ? 9 : 12} mb-2`" v-if="salonSingle.address">
          <div class="profile_info-details">
            <icon name="placeholder" />
            <span>{{ salonSingle.address }}</span>
          </div>
        </div>
        <div class="col-lg-3 mb-2" v-if="hasWorkingHours">
          <div class="profile_info-details">
            <icon name="time" />
            <span class="working-time" v-html="getWorkingDays(salonSingle.working_days, salonSingle.working_hours)" />
          </div>
        </div>
      </div>
      <template v-if="salonSingle.gallery_urls.length">
        <gallery where="salon" :media="[salonSingle.gallery_urls, salonSingle.gallery_thumbs]" :show-slider="false" />
        <thumbs-gallery where="salon" :media="salonSingle.gallery_thumbs" />
      </template>
    </div>
    <div class="card salon-comment-card mb-2 mb-lg-3" v-if="salonSingle.description">
      <h2 class="title-with-line">
        <span>{{ $t('main_info') }}</span>
      </h2>
      <div class="comment">
        <p>{{ salonSingle.description }}</p>
      </div>
    </div>
    <grid 
      v-if="salonSingle.announcements.data.length" 
      :announcements="salonSingle.announcements.data" 
      :paginate="$paginate(salonSingle.announcements)"
      :pending="pending"
      @pending="pending = true"
      @change-page="changePage"
      escape-duplicates
    />
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

import { SalonsMixin } from '~/mixins/salons';

import Grid from '~/components/announcements/Grid';
import Gallery from '~/components/announcements/inner/Gallery';
import ThumbsGallery from '~/components/announcements/inner/ThumbsGallery';

export default {
  components: {
    Grid,
    Gallery,
    ThumbsGallery
  },
  mixins: [SalonsMixin],
  data() {
    return {
      pending: false
    }
  },
  computed: {
    ...mapGetters(['salonSingle']),

    hasWorkingHours() {
      return !!this.getWorkingDays(this.salonSingle.working_days, this.salonSingle.working_hours)
    },
    messengers() {
      let msg = [];
      if (this.salonSingle.whatsapp?.find(wp => wp)) msg.push('Whatsapp');
      if (this.salonSingle.telegram?.find(tg => tg)) msg.push('Telegram');
      return msg.join('/');
    }
  },
  methods: {
    ...mapActions(['getSalonById']),

    async changePage() {
      this.pending = true;
      await this.getSalonById({ 
        id: this.$route.params.id, 
        page: this.$route.query.page || 1 
      });
      this.pending = false;
      this.scrollTo('.announcements-grid');
    }
  }
}
</script>