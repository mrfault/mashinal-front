<template>
  <div class="salon-inner">
    <div
      :class="[
        'card profile-card salon-single-card overflow-hidden mt-0 mb-lg-3',
        salonSingle.description ? 'mb-n3' : 'mb-2',
      ]"
    >
      <!-- ------------------ -->
      <div class="cover-with-avatar" style="margin-bottom: 5px;">
        <div
          class="cover"
          :style="{
            backgroundImage: `url('${getCover(
              salonSingle.cover,
              salonSingle.type_id,
            )}')`,
          }"
        >
          <img
            class="avatar"
            style="border-radius:0;"
            :src="getLogo(salonSingle.logo)"
            :alt="salonSingle.name || salonSingle.user.full_name"
          />
          <div class="socials" @click.stop>
            <a
              v-for="social in ['facebook', 'instagram']"
              :key="social"
              v-if="salonSingle[social]"
              :href="salonSingle[social]"
              rel="noopener"
              target="_blank"
            >
              <icon :name="social" />
            </a>
          </div>
        </div>
        <span class="edit-link items-total">
          <inline-svg class="salon-car-icon" src="/images/car_icon.svg"  />
          <span>{{ salonSingle.announcements.total }}</span>
        </span>
        <nuxt-link
          class="edit-link"
          style="bottom: -12px;"
          :to="$localePath(`/dashboard/${salonSingle.type_id}/settings`)"
          @click.native="setPageRef($route.path)"
          v-if="salonIsOwner(salonSingle)"
        >
          <icon name="edit" />
        </nuxt-link>
      </div>
      <h2 class="title-with-line text-center">
        <span>
          <template v-if="!salonSingle.is_official">{{ $t(isShop ? 'shop' : 'salon') }}
            "{{
              salonSingle.name || salonSingle.user.full_name
            }}"
          </template>
          <template v-else>{{ salonSingle.name || salonSingle.user.full_name}}</template>
        </span>
      </h2>
      <!-- ------------------ -->

      <p v-if="salonSingle.description" class="mb-4"  style="font-weight: 400;font-size: 15px;">
        {{ salonSingle.description }}
      </p>
      <!-- ------------------ -->
      <div class="row align-items-lg-end profile_info">
        <div class="col-lg-12 mb-2 d-flex" >
            <div v-if="salonSingle.phones && salonSingle.phones.length" class="profile_info-details border-padding-none mr-5">
              <icon name="phone-call" />
              <span
                class="d-inline-flex"
                v-html="
                getConcatPhones(
                  salonSingle.phones,
                  3,
                  true,
                  {
                    telegram: salonSingle.telegram || [],
                    whatsapp: salonSingle.whatsapp || [],
                  },
                  salonSingle.short_number,
                )
              "
              ></span>
            </div>
            <div v-if="hasWorkingHours" class="profile_info-details border-padding-none">
              <icon name="time" />
              <span
                class="working-time"
                v-html="
                getWorkingDays(
                  salonSingle.working_days,
                  salonSingle.working_hours,
                )
              "
              />
            </div>
        </div>
        <div :class="`col-lg-12 mb-2`" v-if="salonSingle.address">
          <div class="profile_info-details border-padding-none">
            <icon name="placeholder" />
            <span style="font-weight: 500">{{ salonSingle.address }}</span>
          </div>
        </div>
      </div>
      <!-- ------------------ -->

      <template v-if="salonSingle.gallery_urls.length">
        <gallery
          where="salon"
          :media="[salonSingle.gallery_urls, salonSingle.gallery_thumbs]"
          :show-slider="false"
        />
        <thumbs-gallery where="salon" :media="salonSingle.gallery_thumbs" />
      </template>
    </div>
    <!-- ------------------ -->

    <grid
      v-if="salonSingle.announcements.data.length"
      :announcements="salonSingle.announcements.data"
      :paginate="$paginate(salonSingle.announcements)"
      :pending="pending"
      @pending="pending = true"
      @change-page="changePage"
      escape-duplicates
      :needAutoScroll="true"
    />
  </div>
</template>
<style>
.border-padding-none {
  border:none !important;
  padding-bottom: 0 !important;
}
.items-total {
  bottom: -12px !important;
  display: flex;
  left: 25px !important;
  font-size: 14px !important;
  font-weight: 500;
}
</style>
<script>
import { mapGetters, mapActions } from 'vuex'

import { SalonsMixin } from '~/mixins/salons'

import Grid from '~/components/announcements/Grid'
import Gallery from '~/components/announcements/inner/Gallery'
import ThumbsGallery from '~/components/announcements/inner/ThumbsGallery'

export default {
  components: {
    Grid,
    Gallery,
    ThumbsGallery,
  },
  mixins: [SalonsMixin],
  data() {
    return {
      pending: false,
    }
  },
  computed: {
    ...mapGetters(['salonSingle']),

    hasWorkingHours() {
      return !!this.getWorkingDays(
        this.salonSingle.working_days,
        this.salonSingle.working_hours,
      )
    },
    messengers() {
      let msg = []
      let phonesLength = this.salonSingle.phones?.length || 0
      if (this.salonSingle.whatsapp?.slice(0, phonesLength).find((wp) => wp))
        msg.push('Whatsapp')
      if (this.salonSingle.telegram?.slice(0, phonesLength).find((tg) => tg))
        msg.push('Telegram')
      return msg.join('/')
    },
    isShop() {
      return this.routeName.includes('parts')
    },
  },
  methods: {
    ...mapActions(['getSalonById']),

    async changePage() {
      this.pending = true
      await this.getSalonById({
        id: this.$route.params.id,
        page: this.$route.query.page || 1,
      })
      this.pending = false
      this.scrollTo('.profile_info')
    },
    scrollFunc() {
      setTimeout(() => {
        this.$scrollTo('.profile_info',1000);
        // const el = this.$refs.scrollToMe
        // if (el) {
        //   el.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
        // }
      }, 1)
    },
  },
  mounted() {
    this.scrollFunc()
  },
}
</script>
