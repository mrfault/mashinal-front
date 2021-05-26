<template>
  <button class="btn-sq btn-sq--color-red" @click.stop="handleClick">
    <icon name="compare" />
  </button>
</template>

<script>
export default {
  props: {
    announcement: {}
  },
  methods: {
    handleClick() {

    }
  }
}
</script>