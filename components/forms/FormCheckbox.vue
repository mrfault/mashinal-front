<template>
  <div class="form-group">
    <div class="checkbox-input">
      <input 
        class="sr-only"
        :id="id || inputName"
        :type="type"
        :name="inputName"
        :value="checkedValue"
        :disabled="disabled"
        :class="{invalid, disabled}"
        :true-value="typeof inputValue === 'number' ? 1 : true"
        :false-value="typeof inputValue === 'number' ? 0 : false"
        v-model="inputValue"
      />
      <label :for="id || inputName" :class="{transparent, 'pr-0': labelClick}" @click="handleClick">
        <span class="checkbox">
          <icon name="check" />
        </span>
        <icon class="checkbox-icon" :name="iconName" v-if="iconName" />
        <span class="text-truncate text-dark-blue-2 text-hover-red pl-3 pl-lg-0 cursor-pointer" v-if="labelClick" @click.stop.prevent="$emit('label-click')">
          {{ label }}
          <icon class="ml-1" name="chevron-right" />
        </span>
        <span class="text-truncate" v-else>{{ label }}</span>
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
        default: 'checkbox'
      },
      label: {
        type: String,
        default: ' '
      },
      checkedValue: {
        default: true
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
      iconName: {
        type: String,
        default: ''
      },
      transparent: {
        type: Boolean,
        default: false
      },
      labelClick: {
        type: Boolean
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