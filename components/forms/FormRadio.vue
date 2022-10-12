<template>
  <div class="form-group">
    <div class="radio-input">
      <input
        class="sr-only"
        :id="id || `${inputName}_${radioValue}`"
        :type="type"
        :name="inputName"
        :value="radioValue"
        :disabled="disabled"
        :class="{invalid, disabled}"
        v-model="inputValue"
      />
      <label :for="id || `${inputName}_${radioValue}`" :class="{transparent}" @click="handleClick">
        <span class="radio-point"></span>
        <span class="text-truncate">{{ label }}</span>
      </label>
      <slot />
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      value: {},
      id: String,
      type: {
        type: String,
        default: 'radio'
      },
      label: {
        type: String,
        default: ' '
      },
      radioValue: {
        default: 1
      },
      inputName: {
        type: String,
        default: ''
      },
      disabled: {
        type: Boolean,
        default: false
      },
      invalid: {
        type: Boolean,
        default: false
      },
      transparent: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        prevValue: this.value
      }
    },
    computed: {
      inputValue: {
        get() {
          return this.value;
        },
        set(value) {
          value = this.disabled ? this.value : value;
          this.$emit('input', value);
          // check if value was changed
          if (value !== this.prevValue) {
            this.$emit('change', value);
            this.prevValue = value;
          }
        }
      }
    },
    methods: {
      handleClick() {
        if (this.disabled) this.$emit('try');
      }
    }
  }
</script>
