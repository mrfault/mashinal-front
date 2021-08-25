<template>
  <div class="pages-salons-id">
    <div class="container">
      <breadcrumbs :crumbs="crumbs" />
      <div class="card profile-card salon-single-card overflow-hidden mt-0 mb-n3 mb-lg-3" v-if="salonSingle.description">
        <div class="cover-with-avatar">
          <div class="cover" :style="{backgroundImage: `url('${getCover(salonSingle.cover)}')`}">
            <img class="avatar" :src="getLogo(salonSingle.logo)" :alt="salonSingle.name" />
          </div>
          <nuxt-link class="edit-link" :to="$localePath('/profile/salon')" @click.native="setPageRef($route.path)" v-if="salonIsOwner(salonSingle)">
            <icon name="edit" />
          </nuxt-link>
        </div>
        <h2 class="title-with-line text-center">
          <span>{{ $t('is_autosalon') }} {{ salonSingle.name }}</span>
        </h2>
        <div class="row align-items-lg-end profile_info">
          <div class="col-lg-4" v-if="salonSingle.phones.length">
            <div class="profile_info-details">
              <icon name="phone-call" />
              <span v-html="getConcatPhones(salonSingle.phones)" />
            </div>
          </div>
          <div class="col-lg-4" v-if="salonSingle.address">
            <div class="profile_info-details">
              <icon name="placeholder" />
              <span>{{ salonSingle.address }}</span>
            </div>
          </div>
          <div class="col-lg-4" v-if="getWorkingDays(salonSingle.working_days, salonSingle.working_hours)">
            <div class="profile_info-details">
              <icon name="time" />
              <span v-html="getWorkingDays(salonSingle.working_days, salonSingle.working_hours)" />
            </div>
          </div>
        </div>
        <gallery where="salon" :media="[salonSingle.gallery_urls, salonSingle.gallery_thumbs]" :show-slider="false" />
        <thumbs-gallery where="salon" :media="salonSingle.gallery_thumbs" />
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
      />
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

import { SalonsMixin } from '~/mixins/salons';

import Grid from '~/components/announcements/Grid';
import Gallery from '~/components/announcements/inner/Gallery';
import ThumbsGallery from '~/components/announcements/inner/ThumbsGallery';

export default {
  name: 'pages-salons-id',
  components: {
    Grid,
    Gallery,
    ThumbsGallery
  },
  mixins: [SalonsMixin],
  nuxtI18n: {
    paths: {
      az: '/salonlar/:id'
    }
  },
  head() {
    return this.$headMeta({
      title: `${this.$t('is_autosalon')} ${this.salonSingle.name} | ${this.$t('car-showrooms')}`,
      description: this.salonSingle.short_description
    });
  },
  async asyncData({ store, route }) {
    await Promise.all([
      store.dispatch('getSalonById', {id: route.params.id}),
      store.dispatch('getMotoOptions'),
    ]);

    return {
      pending: false
    }
  },
  computed: {
    ...mapGetters(['salonSingle']),

    crumbs() {
      return [
        { name: this.$t('car-showrooms'), route: '/salons' },
        { name: this.salonSingle.name }
      ]
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