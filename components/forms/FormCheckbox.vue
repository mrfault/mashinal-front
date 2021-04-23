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
      <label :for="id || inputName">
        <span class="checkbox">
          <icon name="check" />
        </span>
        <icon class="checkbox-icon" :name="iconName" v-if="iconName" />
        <span class="text-truncate">{{ label }}</span>
      </label>
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
      }
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
  }
</script>