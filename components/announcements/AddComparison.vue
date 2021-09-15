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
      required: true
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
        this.$store.dispatch('comparison/toggleAnnouncement', id)
      } else {
        // this.$store.dispatch('comparison/toggleModel', id)
      }
    }
  },
  computed: {
    isActive() {
      if (this.type === 'announcement') {
        return this.$store.getters['comparison/announcementIds'].findIndex(aId => aId === id) >= 0
      } else {
        // return this.$store.getters['comparison/modelIds'].findIndex(aId => aId === id) >= 0
        return false
      }
    }
  }
}
</script>