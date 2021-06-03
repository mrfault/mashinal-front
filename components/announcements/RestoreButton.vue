<template>
  <button :class="['btn full-width', `btn--${className} `]" @click.stop="handleClick">
    <icon name="refresh" /> {{ $t('restore') }}
  </button>
</template>

<script>
export default {
  props: {
    announcement: {},
    className: {
      default: 'dark-blue-outline'
    }
  },
  methods: {
    handleClick() {
      
    }
  }
}
</script>