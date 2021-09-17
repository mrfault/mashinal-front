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
export default {
props: {
    id: {
      type: [Number, String],
      required: false
    },
    model: {
      type: Object,
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
    handleClick() {
      if (this.type === 'announcement') {
        this.$store.dispatch('comparison/toggleAnnouncement', this.id)
      } else {
        // this.$store.dispatch('comparison/toggleModel', this.model)
      }
    }
  },
  computed: {
    isActive() {
      if (this.type === 'announcement') {
        return this.$store.getters['comparison/announcementIds'].findIndex(aId => aId === this.id) >= 0
      } else {
        return false // this.$store.getters['comparison/modelsList'].findIndex(model => model.catalog_id === this.model.catalog_id) >= 0
      }
    }
  }
}
</script>