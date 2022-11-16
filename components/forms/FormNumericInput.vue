<template>
  <div class="form-group">
    <div class="text-input">
      <input
        type="text"
        :id="id"
        :class="{invalid, disabled, [inputClass]: !!inputClass}"
        :placeholder="placeholder"
        :value="numericValue"
        :disabled="disabled"
        ref="input"
        @focus="showSuffix = false"
        @keyup="handleKeyUp"
        @keydown="handleKeyDown"
        @blur="handleNumeric(true)"
        @input="updateInput"
      />
      <icon name="alert-circle" v-if="invalid" />
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      value: {},
      id: String,
      disabled: {
        type: Boolean,
        default: false
      },
      float: {
        type: Boolean,
        default: false,
      },
      invalid: {
        type: Boolean,
        default: false
      },
      minValue: {
        type: Number,
        default: 0
      },
      maxValue: {
        type: Number,
        default: 99999999
      },
      suffix: {
        type: String,
        default: ''
      },
      placeholder: {
        type: String,
        default: ' '
      },
      typingInterval: {
        default: 450
      },
      inputClass: String
    },
    data() {
      return {
        showSuffix: true,
        prevValue: this.value,
        typingTimer: -1
      }
    },
    methods: {
      updateInput(e) {
        this.numericValue = e.target.value;
        this.$forceUpdate();
      },
      handleNumeric(appendSuffix = false) {
        clearTimeout(this.typingTimer);
        this.showSuffix = appendSuffix;
        this.numericValue = this.validateValue(this.value);
        let isSame = this.prevValue === this.value;
        this.prevValue = this.value;
        if (!isSame) this.$emit('change', this.getValue(this.value));
      },
      validateValue(value) {
        if ((this.minValue > 0 && value === 0) || (!value && value !== 0)) return '';
        value = value < this.minValue ? this.minValue : value;
        value = value > this.maxValue ? this.maxValue : value;
        return value;
      },
      getValue(value) {
        if(this.float) {
          let parsedValue = value;
          value = isNaN(parsedValue) ? this.value : parsedValue;
          return value;
        }

        let maxlength = this.readValue(this.maxValue).length;
        let parsedValue = this.$parseNumber(this.readValue(value).slice(0, maxlength));
        value = isNaN(parsedValue) ? '' : parsedValue;
        return value;
      },
      readValue(value) {
        return value.toString().replace(/\D+/g,'').replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
      },
      handleKeyUp(e) {
        if (this.typingInterval) {
          clearTimeout(this.typingTimer);
          this.typingTimer = setTimeout(this.handleNumeric, this.typingInterval);
        }
      },
      handleKeyDown(e) {
        if (this.typingInterval) {
          clearTimeout(this.typingTimer);
        }
      }
    },
    computed: {
      numericValue: {
        get() {
          let suffix = !this.suffix || !this.showSuffix || this.value === '' ? '' : ' ' + this.suffix;
          return !this.float ?  this.readValue(this.value) + suffix : this.value;
        },
        set(value) {
          this.$emit('input', this.getValue(value));
        }
      }
    }
  }
</script>
