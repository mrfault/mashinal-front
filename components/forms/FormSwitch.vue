<template>
  <div class="form-group">
    <div class="form-switch">
      <button type="button" :class="[{'active': isActive(option), 'disabled':isDisabled(option)}]" v-for="(option, index) in options" :key="index"
        @click="selectedValue = option.key">
        {{ option.sign || option.name }}
      </button>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      value: {},
      options: {},
      disabled: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        prevValue: this.value
      }
    },
    methods: {
      isActive(option) {
        return this.selectedValue === option.key;
      },
      isDisabled(option) {
        if(option.disabled) return true;
        return this.disabled;
      }
    },
    computed: {
      selectedValue: {
        get() {
          return this.value;
        },
        set(value) {
          value = this.disabled ? this.value : value;
          this.$emit('input', value);
          this.$emit('change', value);
        }
      }
    }
  }
</script>