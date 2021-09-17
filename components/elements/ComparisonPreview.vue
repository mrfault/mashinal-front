<template>
  <transition-group name="fade">
    <div
      class="comparison-preview"
      v-if="visible"
      key="comparison-preview"
      ref="comparisonPreview"
    >
      <div class="comparison-preview__title d-flex">
        <h4 >{{ activeType === 'announcements' ? $t('comparison_announcements') : $t('comparison_models') }}</h4>
        <span class="cursor-pointer close" @click="$emit('close')">
          <icon name="cross" />
        </span>
      </div>

      <form-buttons
        v-if="typeButtons.length > 1"
        class="mt-2"
        btn-class="pale-red-outline"
        :options="typeButtons"
        :group-by="2"
        v-model="activeType"
      />

      
      <vue-scroll :ops="scrollOps">
        <!-- Announcements -->
        <div class="comparison-preview__list" v-if="activeType === 'announcements'">
          <template v-for="(announcement, index) in announcementsList">
            <div class="comparison-preview__list-item" :key="'announcement-' + announcement.id">
              <img :src="getAnnouncementImage(announcement)" alt="">
              <div class="info">
                <div class="info__title text-truncate">{{ getAnnouncementTitle(announcement) }}</div>
                <div class="info__desc text-truncate">{{ getAnnouncementTextLine(announcement) }}</div>
                <div class="info__price text-truncate">{{ announcement.price }}</div>
              </div>
              <button class="remove-btn" @click="removeAnnouncement(announcement.id_unique)">
                <icon name="garbage" />
              </button>
            </div>
            <hr :key="'hr-' + announcement.id" v-if="index < announcementsList.length - 1"/>
          </template>
        </div>

        <!-- Models -->
        <div class="comparison-preview__list" v-if="activeType === 'models'">
          <template v-for="(model, index) in modelsList">
            <div class="comparison-preview__list-item" :key="'model-' + model.id">
              <img :src="model.model.transformed_media" alt="">
              <div class="info">
                <div class="info__title text-truncate">{{ getModelTitle(model) }}</div>
                <div class="info__desc text-truncate"  v-for="desc in getModelDescription(model)" :key="desc">
                  {{ desc }}
                </div>
              </div>
              <button class="remove-btn" @click="removeModel(model.id)">
                <icon name="garbage" />
              </button>
            </div>
            <hr :key="'hr-' + model.id" v-if="index < modelsList.length - 1"/>
          </template>
        </div>
      </vue-scroll>

      <button
        class="btn btn--red btn--unaffected-by-theme full-width compare-btn"
        v-if="activeType === 'announcements' ? announcementsList.length > 1 : modelsList.length > 1"
        @click="compare"
      >
        <icon name="compare" />
        {{ $t('compare') }}
      </button>
    </div>
  </transition-group>
</template>

<script>
import { ComparisonMixin } from '~/mixins/comparison'

export default {
  mixins: [ComparisonMixin],
  props: {  
    visible: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      activeType: 'announcements'
    }
  },
  mounted() {
    this.updateActiveTab()
  },
  methods: {
    removeAnnouncement(id) {
      this.$store.dispatch('comparison/removeAnnouncement', id)
    },
    removeModel(id) {
      this.$store.dispatch('comparison/removeModel', id)
    },
    compare() {
      this.$router.push(this.$localePath('/comparison'))
    },
    updateActiveTab() {
      if (!this.announcementsList.length) {
        this.activeType = 'models'
      } else if (!this.modelsList.length) {
        this.activeType = 'announcements'
      }
    }
  },
  computed: {
    announcementsList() {
      return this.$store.getters['comparison/announcementsList']
    },
    modelsList() {
      return this.$store.getters['comparison/modelsList']
    },
    scrollOps() {
      return  {
        scrollPanel: {
          maxHeight: this.isMobileBreakpoint ? undefined : '350'
        }
      }
    },
    typeButtons() {
      const buttons = []
      if (this.announcementsList.length) {
        buttons.push({ key: 'announcements', name: this.$t('comparison_announcements') })
      }
      
      if (this.modelsList.length) {
        buttons.push({ key: 'models', name: this.$t('comparison_models') })
      }

      return buttons
    }
  },
  watch: {
    visible(value) {
      if (value) {
        this.$nextTick(() => {
          // this.$refs.comparisonPreview.focus()
        })
      }
    },
    announcementsList() {
      this.updateActiveTab()
    },
    modelsList() {
      this.updateActiveTab()
    }
  }
}
</script>