<template>
  <button :class="['btn full-width', `btn--${className} `]" @click.stop="handleClick">
    <icon name="edit" /> {{ $t('edit') }}
  </button>
</template>

<script>
export default {
  props: {
    announcement: {},
    className: {
      default: 'dark-blue'
    }
  },
  methods: {
    handleClick() {
      
    }
  }
}
</script>