<template>
  <button
    class="btn-sq btn-sq--color-red"
    :class="{'active': isActive}"
    @click.prevent.stop="handleClick"
  >
    <icon name="compare" />
  </button>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
props: {
    id: {
      type: [Number, String],
      required: false
    },
    type: {
      type: String,
      required: false,
      default: 'announcement',
      validator(val) {
        return ['announcement', 'model'].includes(val)
      }

    }
  },
  methods: {
    async handleClick() {
      if (this.type === 'announcement') {
        if (this.announcementsList.findIndex(a => a.id_unique === this.id) >= 0) {
          this.$toasted.success(this.$t('comparison_removed'))
        } else {
          this.$toasted.success(this.$t('comparison_added'))
        }
        await this.$store.dispatch('comparison/toggleAnnouncement', this.id)
      } else {
        if (this.modelsList.findIndex(a => a.id === this.id) >= 0) {
          this.$toasted.success(this.$t('comparison_removed'))
        } else {
          this.$toasted.success(this.$t('comparison_added'))
        }
        await this.$store.dispatch('comparison/toggleModel', this.id)
      }
    }
  },
  computed: {
    ...mapGetters({
      announcementsList: 'comparison/announcementsList',
      announcementIds: 'comparison/announcementIds',
      modelsList: 'comparison/modelsList'
    }),
    isActive() {
      if (this.type === 'announcement') {
        return this.announcementIds.findIndex(aId => aId === this.id) >= 0
      } else {
        return this.modelsList.findIndex(model => model.id === this.id) >= 0
      }
    }
  }
}
</script>