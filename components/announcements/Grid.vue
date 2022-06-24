<template>
  <div
    :class="[
      'announcements-grid',
      { 'loading-content': pending, paginated: paginate },
    ]"
  >
    <div :class="{ container: hasContainer }">
      <div class="title grid-title" v-if="title && showTitle">
        <h2>
          <icon :name="iconName" v-if="iconName" />
          <span>{{ title }}</span>
        </h2>
        <nuxt-link v-if="showAll" :to="showAll">
          {{ $t('all') }}
          <icon name="arrow-right" />
        </nuxt-link>
      </div>
    </div>

    <div :class="{ container: hasContainer }">
      <div class="row mb-n2 mb-lg-n3">
        <!-- <span class="test" ref="scrollToMe"></span> -->
        <template v-for="(announcement, index) in announcements">
          <template v-if="where === 'catalog'">
            <grid-item
              :col-class="'col-lg-6 mb-2 mb-lg-4'"
              :announcement="announcement"
              :track-views="trackViews"
              :show-gallery="true"
              :key="announcement.id_unique"
            />
          </template>
          <template v-else>
            <div
              :class="[
                {
                  'col-lg-mid': checkItemIndex(index + 2, announcement),
                  'pt-4 mt-1': checkItemTop(index, announcement),
                  'pb-4 mb-4': checkItemBottom(index, announcement),
                  'col-6 col-xs-12 col-lg-3 col-xl-auto': !isProfilePage,
                  'col-6 col-xs-6 col-lg-3 col-xl-auto': isProfilePage,
                },
                checkItemB(index, announcement)
                  ? 'col-b mb-0 pb-2 mb-lg-4 mt-lg-6 pt-lg-4 pb-lg-4'
                  : 'mb-2 mb-lg-3',
              ]"
              :key="announcement.id_unique + (escapeDuplicates ? '_' + index : '')"
            >
              <grid-item
                :announcement="announcement"
                :show-monetization-actions="showMonetizationActions"
                :show-checkbox="showCheckbox"
                :show-status="showStatus"
                :show-phone-count="showPhoneCount"
                :show-overlay="showOverlay"
                :clickable="clickable"
                :track-views="trackViews"
                :isProfilePage="isProfilePage"
              />
            </div>
            <template
              v-if="
                !isMobileBreakpoint && checkItemIndex(index + 1, announcement)
              "
            >

              <div
                class="col-6 col-lg-auto mb-lg-4 mt-lg-6 pt-lg-4 pb-lg-4"
                :key="'banner_' + index"
              >
                <site-banner @bannerLoaded="showBanner = true" v-show="showBanner" type="in-part" />
                <div
                  v-if="!showBanner"
                  class="announcements-grid_banner d-flex align-items-center justify-content-center"
                  @click="$router.push($localePath(bannerLink))"
                >

                  <div
                    class="banner-bg"
                    :style="{
                      backgroundImage: `url(${getBannerImage(index + 1)})`,
                    }"
                  ></div>
                </div>
              </div>
            </template>

          </template>
        </template>
      </div>
    </div>

    <pagination
      v-if="paginate && paginate.last_page > 1"
      :page-count="paginate.last_page"
      :value="paginate.current_page"
      @change-page="changePage"
    />
  </div>
</template>

<style>
@media (min-width: 1025px) {
  .announcements-grid .col-lg-auto {
    width: 20%;
  }
}
</style>
<script>
import GridItem from '~/components/announcements/GridItem'
import SiteBanner from "~/components/banners/SiteBanner";

export default {
  props: {
    showMonetizationActions: {
      type: Boolean,
      default: true,
    },
    announcements: {
      type: Array,
      default: () => [],
    },
    title: String,
    iconName: String,
    showAll: String,
    showTitle: {
      type: Boolean,
      default: true,
    },
    trackViews: {
      type: Boolean,
      default: true,
    },
    pushIntoRouter: {
      type: Boolean,
      default: true,
    },
    showStatus: Boolean,
    showCheckbox: Boolean,
    showPhoneCount: Boolean,
    paginate: {},
    pending: Boolean,
    watchRoute: Boolean,
    escapeDuplicates: Boolean,
    hasContainer: Boolean,
    banner: String,
    bannerPlace: Number,
    bannerCount: Number,
    bannerFor: String,
    bannerLink: String,
    where: String,
    showOverlay: {
      type: Boolean,
      default: true,
    },
    clickable: {
      type: Boolean,
      default: true,
    },
    isProfilePage: Boolean,
    needAutoScroll: Boolean,
  },
  components: {
    SiteBanner,
    GridItem,
  },
  data() {
    return {
      showBanner: false,
    }
  },
  methods: {
    changePage(page) {
      if (this.showAll) {
        this.$emit('pending')
        this.$router.push({ path: this.showAll, query: { page } }, () => {
          this.scrollTo('.announcements-grid', [-15, -20])
        })
      } else {
        if (!this.pushIntoRouter) {
          this.$emit('change-page', page)
        } else {
          this.$router.push({ query: { ...this.$route.query, page } }, () => {
            this.$emit('change-page', page)
          })
        }
      }
    },
    checkItemIndex(index, item) {
      if (this.getAnnouncementType(item) !== this.bannerFor) return false
      return this.banner && index % this.bannerPlace === 0
    },
    checkItemB(index, item) {
      return (
        this.checkItemIndex(index + 1, item) ||
        this.checkItemIndex(index + 2, item) ||
        this.checkItemIndex(index + 3, item) ||
        this.checkItemIndex(index + 4, item)
      )
    },
    checkItemTop(index, item) {
      return (
        this.checkItemIndex(index + 3, item) ||
        this.checkItemIndex(index + 4, item)
      )
    },
    checkItemBottom(index, item) {
      return (
        this.checkItemIndex(index + 1, item) ||
        this.checkItemIndex(index + 2, item)
      )
    },
    getBannerImage(index) {
      let count = (index / this.bannerPlace) % this.bannerCount
      count = count === 0 ? this.bannerCount : count
      return this.banner
        .replace('{count}', count)
        .replace('{locale}', this.locale)
    },
    scrollFunc() {
      setTimeout(() => {
        const el = this.$refs.scrollToMe
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }, 1000)
    },
  },
  watch: {
    '$route.query.page'(page) {
      if (this.watchRoute) this.changePage(page)
    },
  },
  mounted() {
    if (this.needAutoScroll) {
      this.scrollFunc()
    }
  },
}
</script>
