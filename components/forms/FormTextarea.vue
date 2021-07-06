<template>
  <div class="form-group">
    <div class="text-input">
      <icon :name="iconName" v-if="iconName" :class="{invalid, disabled}" />
      <textarea 
        :id="id"
        :placeholder="placeholder" 
        :maxlength="maxlength" 
        :disabled="disabled"
        :class="{invalid, valid, disabled}"
        v-model="inputValue"
      ></textarea>
      <icon name="alert-circle" v-if="invalid" class="invalid" />
      <icon name="check-circle" v-else-if="valid" class="valid" />
      <slot />
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      value: {},
      id: String,
      iconName: String,
      placeholder: {
        type: String,
        default: ' '
      },
      maxlength: {
        type: Number,
        default: 500
      },
      disabled: {
        type: Boolean,
        default: false
      },
      invalid: {
        type: Boolean,
        default: false
      },
      valid: {
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
          value = (this.disabled || (this.value.length > this.maxlength)) ? this.value : value;
          this.$emit('input', value);
          // check if value was changed
          if(value !== this.prevValue) {
            this.$emit('change', value);
            this.prevValue = value;
          }
        }
      }
    }
  }
</script>