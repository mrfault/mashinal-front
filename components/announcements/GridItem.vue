<template>
  <div :class="colClass || 'stratch-child-block'">
    <div
      class="announcements-grid_gallery"
      @click="goToAnnouncement"
      v-if="showGallery"
    >
      <a
        v-if="clickable && !isMobileBreakpoint && !$env.DEV"
        target="_blank"
        :href="getLink"
        class="abs-link"
        @click.stop
      >
        <span class="sr-only">{{ getAnnouncementTitle(announcement) }}</span>
      </a>
      <div class="d-flex">
        <div>
          <div
            class="item-bg"
            role="img"
            v-lazy:background-image="$withBaseUrl(announcement.media.thumb[0])"
          ></div>
        </div>
        <div>
          <div
            class="item-bg wider"
            role="img"
            v-lazy:background-image="$withBaseUrl(announcement.media.thumb[1])"
          ></div>
          <div
            class="item-bg wider"
            role="img"
            v-lazy:background-image="$withBaseUrl(announcement.media.thumb[2])"
          ></div>
        </div>
      </div>
    </div>
    <div class="announcements-grid_item" @click="goToAnnouncement">
      <a
        v-if="clickable && !isMobileBreakpoint && !$env.DEV"
        target="_blank"
        :href="getLink"
        class="abs-link"
        @click.stop
      >
        <span class="sr-only">{{ getAnnouncementTitle(announcement) }}</span>
      </a>
      <div
        class="item-bg"
        role="img"
        :aria-label="getAnnouncementTitle(announcement)"
        v-lazy:background-image="getImage"
        v-if="!showGallery"
      >
        <div class="item-overlay" v-if="showOverlay">
          <div class="item-overlay__top">
            <div class="item-overlay__top--left">
              <add-favorite :announcement="announcement" />
            </div>
            <div class="item-overlay__top--right">
              <span
                class="btn-sq btn-sq--color-red active"
                v-if="announcement.has_monetization"
              >
                <icon name="speaker" v-tooltip="$t('ad_announcement')" />
              </span>
              <template
                v-if="announcement.is_autosalon || announcement.is_part_salon"
              >
                <span class="badge badge-blue">SHOP</span>
              </template>
              <template v-if="showStatus">
                <span class="badge active" v-if="true">
                  {{ $t('accepted') }}
                </span>
                <span
                  class="badge pending"
                  v-else-if="
                    announcement.status == 2 &&
                    announcement.system_paid_announce &&
                    !announcement.system_paid_announce.is_paid
                  "
                >
                  {{ $t('need_pay') }}
                </span>
                <span
                  class="badge pending"
                  v-else-if="announcement.status == 2"
                >
                  {{ $t('under_consideration') }}
                </span>
                <span
                  class="badge rejected"
                  v-else-if="announcement.status == 0"
                >
                  {{ $t('rejected') }}
                </span>
                <span
                  class="badge inactive"
                  v-else-if="announcement.status == 3"
                >
                  {{ $t('inactive') }}
                </span>
              </template>
            </div>
          </div>
          <div class="item-overlay__bottom">
            <span
              class="d-flex"
              v-if="
                announcement.status === undefined || announcement.status == 1
              "
            >
              <add-comparison
                :id="announcement.id_unique"
                v-if="getType === 'Car'"
              />
            </span>
            <div class="item-overlay__bottom--right">
              <span class="badge" v-if="announcement.has_360">
                360
                <sup>o</sup>
              </span>
              <span class="badge" v-if="announcement.created_at">
                {{ $formatDate(announcement.created_at, 'D MMM')[locale] }}
              </span>
            </div>
          </div>
        </div>
      </div>
      <!-- price, title -->
      <div class="item-details">
        <div class="d-flex">
          <h3 class="item-details__price">
            {{ announcement.price }}
          </h3>
        </div>
        <h3 class="item-details__title">
          {{ getAnnouncementTitle(announcement) }}
        </h3>
        <!-- year, odometer, credit, barter -->
        <div class="item-details--infos">
          <span class="item-details__year" v-if="getTextLine">
            <span>{{ getTextLine }}</span>
          </span>
          <span class="item-details__options">
            <icon
              name="percent"
              v-tooltip="$t('credit_possible')"
              v-if="announcement.credit"
            />
            <icon
              name="barter"
              v-tooltip="$t('tradeable')"
              v-if="announcement.tradeable || announcement.exchange_possible"
            />
          </span>
        </div>
        <!-- checkbox and counts -->
        <div
          class="item-details__checks"
          @click.stop
          v-if="showCheckbox || showPhoneCount"
        >
          <span
            class="call-count"
            v-if="announcement.show_phone_number_count || showPhoneCount"
          >
            <icon name="phone-call" />
            {{ announcement.show_phone_number_count || 0 }}
            <icon name="eye" />
            {{ announcement.view_count }}
          </span>
          <div class="item-checkbox" v-if="showCheckbox" style="">
            <form-checkbox
              :value="selected"
              :input-name="`selected_${announcement.id_unique}`"
              transparent
              @input="handleChange"
            />
          </div>
        </div>
        <hr class="mt-1" v-if="showCheckbox && announcement.status === 1" />
        <div class="item-details__actions">
          <template v-if="showCheckbox && announcement.status === 1">
            <span>
              <monetization-button
                v-if="!announcement.has_monetization"
                :announcement="announcement"
                class-name="red-outline"
              />
              <monetization-stats-button v-else :announcement="announcement" />
            </span>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AddFavorite from '~/components/announcements/AddFavorite'
import AddComparison from '~/components/announcements/AddComparison'
import MonetizationButton from '~/components/announcements/MonetizationButton'
import MonetizationStatsButton from '~/components/announcements/MonetizationStatsButton'

export default {
  props: {
    announcement: {},
    showStatus: Boolean,
    showCheckbox: Boolean,
    showPhoneCount: Boolean,
    showGallery: Boolean,
    showOverlay: Boolean,
    clickable: Boolean,
    trackViews: Boolean,
    colClass: String,
  },
  components: {
    MonetizationStatsButton,
    MonetizationButton,
    AddFavorite,
    AddComparison,
  },
  data() {
    return {
      selected: false,
    }
  },
  computed: {
    getType() {
      let item = this.announcement
      if (item.moto_brand) return 'Motorcycle'
      else if (item.scooter_brand) return 'Scooter'
      else if (item.moto_atv_brand) return 'Atv'
      else if (item.commercial_brand) return 'Commercial'
      else if (item.car_catalog) return 'Car'
      else if (item.title) return 'Part'
      return ''
    },
    getLink() {
      let type = 'cars'
      if (['Motorcycle', 'Scooter', 'Atv'].includes(this.getType)) type = 'moto'
      else if (['Commercial'].includes(this.getType)) type = 'commercial'
      else if (['Part'].includes(this.getType)) type = 'parts'
      let path = `/${type}/announcement/${this.announcement.id_unique}`
      return this.$localePath(path)
    },
    getTextLine() {
      if (['Part'].includes(this.getType)) return this.announcement.description
      let text = `${this.announcement.year} ${this.$t('plural_forms_year')[0]}`
      if (
        // this.getCapacity &&
        this.showOverlay
      )
        text +=
          // `, ${this.getCapacity}`text +=
          `, ${this.announcement.humanize_mileage} ${this.$t('char_kilometre')}`
      return text
    },
    getImage() {
      let item = this.announcement

      if (item.has_360 == false) {
        if (item.media && item.media.thumb && item.media.thumb.length)
          return this.$withBaseUrl(item.media.thumb[0])
        else if (item.media && item.media.length)
          return this.$withBaseUrl(item.media[0].thumb || item.media[0])
        return false
      }else{
        return this.$withBaseUrl(item.has_360)
      }
    },
    getCapacity() {
      let item = this.announcement,
        type = this.getType
      let capacity = item.car_catalog?.capacity || item.capacity
      let showLitres = ['Car', 'Commercial'].includes(type)
      if (!capacity || capacity == '0') return false
      if (showLitres && capacity > 50) capacity = (capacity / 1000).toFixed(1)
      return `${capacity} ${this.$t(
        showLitres ? 'char_litre' : 'char_sm_cube',
      )}`
    },
  },
  methods: {
    goToAnnouncement() {
      if (!this.clickable) return

      if (this.trackViews) {
        this.fbTrack('ViewContent', {
          content_type: 'product',
          content_category: this.getType,
          content_ids: [this.announcement.id_unique],
          content_name:
            this.getAnnouncementTitle(this.announcement) +
            ', ' +
            this.announcement.year,
        })
      }

      if (!this.isMobileBreakpoint && !this.$env.DEV) return
      this.$router.push(this.getLink)
    },
    handleChange(value) {
      this.selected = value
      this.$nuxt.$emit(
        'select-announcement',
        this.announcement.id_unique,
        value,
        true,
      )
    },
    selectAnnouncement(id, value, controls = false) {
      if (controls || id != this.announcement.id_unique) return
      this.handleChange(value)
    },
  },
  mounted() {
    this.$nuxt.$on('select-announcement', this.selectAnnouncement)
  },
  beforeDestroy() {
    this.$nuxt.$off('select-announcement', this.selectAnnouncement)
  },
}
</script>
