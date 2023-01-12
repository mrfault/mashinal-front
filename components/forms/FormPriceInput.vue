<template>
  <div class="form-group">
    <div class="text-input">
      <input
        :id="id"
        ref="input"
        :class="{invalid, disabled, [inputClass]: !!inputClass}"
        :disabled="disabled"
        :maxlength="maxlength"
        :placeholder="placeholder"
        :value="numericValue"
        type="number"
        @focus="showSuffix = false"
        @input="updateInput"
        @keydown="handleKeyDown"
        @keyup="handleKeyUp"
      />
      <icon v-if="invalid" name="alert-circle"/>
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
    inputClass: String,
    maxlength: {
      type: Number,
      default: 9
    },
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
    // handleNumeric(appendSuffix = false) {
    //   clearTimeout(this.typingTimer);
    //   this.showSuffix = appendSuffix;
    //   let isSame = this.prevValue === this.value;
    //   this.prevValue = this.value;
    // },
    checkPrice(num) {
      var isFloat = num % 2 == 0;
      var isNumeric = num.match(/^[\d\.]+$/g);
      var result = "";

      if (!isFloat && isNumeric) {
        console.log(1)
        return num.length > this.maxlength ? num.slice(0, this.maxlength) : num;

      } else if (isFloat && isNumeric) {
        console.log(2)
        var [tam, kesr] = num.split(".");

        tam = tam.length > this.maxlength ? tam.slice(0, this.maxlength) : tam;
        if (kesr) {

          kesr = kesr.length > 2 ? kesr.slice(0, 2) : kesr;
        }

        return [tam, kesr].join(".");
      }
    },
    readValue(value) {
      return value.toString().replace(/\D+/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    },
    handleKeyUp(e) {
      if (this.typingInterval) {
        clearTimeout(this.typingTimer);
        // this.typingTimer = setTimeout(this.handleNumeric, this.typingInterval);
      }
    },
    handleKeyDown(e) {
      if (this.typingInterval) {
        clearTimeout(this.typingTimer);
      }
    },

    removeDecimal() {
      var n = this.numericValue
      var tam = Math.trunc(this.numericValue)
      var decimal = Math.abs(n - Math.floor(n))
      var firstTwo = parseFloat(decimal.toString().substring(2, 4));
      var final = `${tam}.${firstTwo}`
      var final2 = parseFloat(final)
      console.log("decimal:", decimal, "firstTwo:", firstTwo, "truncate:", tam, "final", final)
      this.numericValue = final2;
    },
    removeDecimal2() {
      if (this.numericValue % 1 !== 0) {
        this.numericValue = this.numericValue.toFixed(2)
      }
      this.numericValue = parseFloat(this.numericValue).toFixed(2);
    }
  },
  computed: {
    numericValue: {
      get() {
        return this.value;
      },
      // set(value) {
      //   if (value % 1 !== 0)
      //     this.$emit('input', value.match(/^\d+\.?\d{0,2}/));
      //   else
      //     this.$emit('input', value);
      //
      // }
      set(value) {
        console.log("type", typeof(value))
        console.log("value", value)
        if (value % 1 !== 0) {

          this.$emit('input', parseFloat(value.match(/^\d+\.?\d{0,2}/)));
        } else if ((value.toString().length > this.maxlength) && (value % 1 == 0)) {

          this.$emit('input', value.toString().substring(0, this.maxlength));
        } else if((value == null) || (value == 0) || (value == "")){

          this.$emit('input', value = null)
        }else {
          this.$emit('input', value)
        }
      }
    }
  }
  ,
}
</script>
