<template>
  <button
    class="btn-sq btn-sq--color-red"
    :class="{'active': isActive}"
    @click.stop="handleClick"
  >
    <icon name="compare" />
  </button>
</template>

<script>
export default {
  props: {
    announcement: {
      type: Object,
      required: true
    }
  },
  methods: {
    handleClick() {
    this.$store.dispatch('comparison/toggleAnnouncement', this.announcement.id_unique)
    }
  },
  computed: {
    isActive() {
      return this.$store.getters['comparison/announcementIds'].findIndex(id => this.announcement.id_unique === id) >= 0
    }
  }
}
</script>