<template>
  <transition-group name="fade">
    <div
      class="comparison-preview"
      v-if="visible"
      key="comparison-preview"
      ref="comparisonPreview"
      @focusout="$emit('close')"
      tabindex="0"
    >
      <div class="comparison-preview__title d-flex">
        <h4 >{{ $t('announcements') }}</h4>
        <span class="cursor-pointer close" @click="$emit('close')">
          <icon name="cross" />
        </span>
      </div>

      <vue-scroll :ops="scrollOps">
        <div class="comparison-preview__list">
          <template v-for="(announcement, index) in list">
            <div class="comparison-preview__list-item" :key="'announcement-' + announcement.id">
              <img :src="getAnnouncementImage(announcement)" alt="">
              <div class="info">
                <div class="info__title text-truncate">{{ getAnnouncementTitle(announcement) }}</div>
                <div class="info__desc text-truncate">{{ getAnnouncementTextLine(announcement) }}</div>
                <div class="info__price text-truncate">{{ announcement.price }}</div>
              </div>
              <button class="remove-btn" @click="remove(announcement.id_unique)">
                <icon name="garbage" />
              </button>
            </div>
            <hr :key="'hr-' + announcement.id" v-if="index < list.length - 1"/>
          </template>
        </div>
      </vue-scroll>

      <button class="btn btn--red btn--unaffected-by-theme full-width" v-if="list.length > 1" @click="compare">
        <icon name="compare" />
        {{ $t('compare') }}
      </button>
    </div>
  </transition-group>
</template>

<script>
export default {
  props: {  
    visible: {
      type: Boolean,
      required: true
    }
  },
  methods: {
    remove(id) {
      this.$store.dispatch('comparison/removeAnnouncement', id)
    },
    compare() {
      this.$router.push(this.$localePath('/comparison'))
    }
  },
  computed: {
    list() {
      return this.$store.getters['comparison/list']
    },
    scrollOps() {
      return  {
        scrollPanel: {
          maxHeight: this.isMobileBreakpoint ? undefined : 350
        }
      }
    }
  },
  watch: {
    visible(value) {
      if (value) {
        this.$nextTick(() => {
          this.$refs.comparisonPreview.focus()
        })
      }
    }
  }
}
</script>