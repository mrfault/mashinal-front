<template>
  <div 
    contenteditable 
    @input="inputValue = $event.target.innerText"
  >
    {{ inputValue }}
  </div>
</template>

<script>
export default {
  props: {
    value: {}
  },
  computed: {
    inputValue: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit('input', value);
      }
    }
  }
};
</script>