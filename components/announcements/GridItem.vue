<template>
  <div class="announcements-grid_item">
    {{ announcement.id_unique }}
  </div>
</template>

<script>
export default {
  props: {
    announcement: {}
  }
}
</script>