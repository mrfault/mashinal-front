<template>
   <div class="ma-sms">
      <div v-for="(digit, index) in code" :key="index" class="ma-sms__box">
         <input
            :ref="`input${index}`"
            :value="digit"
            class="ma-sms__input"
            maxlength="1"
            type="text"
            @input="handleInput(index, $event.target.value)"
            @keydown="handleKeydown(index, $event)"
         />
      </div>
   </div>
</template>


<script>
export default {
   props: {
      value: {
         type: Number,
         default: null,
      },
   },
   data() {
      return {
         code: ['', '', '', '', ''], // Array to store the SMS code digits
         activeIndex: 0, // Index of the currently active input field
      };
   },
   watch: {
      value(newVal) {
         if (newVal !== this.code.join('')) {
            this.code = newVal.split('');
         }
      },
      code(newCode) {
         this.$emit('input', newCode.join(''));
      },
   },
   methods: {
      handleInput(index, value) {
         const sanitizedValue = value.replace(/\D/g, ''); // Remove non-digit characters

         if (sanitizedValue.length === 1) {
            this.$set(this.code, index, sanitizedValue); // Update the code array with the new value

            // Move focus to the next input field
            if (index < 4) {
               this.focusNextInput(index);
            }
         } else {
            this.$set(this.code, index, ''); // Clear the current input field
         }
      },
      handleKeydown(index, event) {
         if (event.key === 'Backspace') {
            if (index > 0 && this.code[index] === '') {
               this.$set(this.code, index - 1, ''); // Clear the previous input field when backspace is pressed
               this.focusPreviousInput(index); // Move focus to the previous input field
            } else if (index === 0 && this.code[0] !== '') {
               this.$set(this.code, 0, ''); // Clear the current input field
            }
         }
      },




      focusNextInput(index) {
         this.$refs[`input${index + 1}`][0].focus(); // Focus the next input field
         this.activeIndex = index + 1; // Update the active index
      },
      focusPreviousInput(index) {
         this.$refs[`input${index - 1}`][0].focus(); // Focus the previous input field
         this.activeIndex = index - 1; // Update the active index
      },
      isActive(index) {
         return index === this.activeIndex; // Check if an input field is currently active
      },
   },
};
</script>


