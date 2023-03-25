<template>
   <div class="customInput">
      <input
         v-if="type === 'text'"
         type="text"
         :placeholder="placeholder"
      >

      <input
         v-else
         type="text"
         :placeholder="placeholder"
         @input="formatNumber($event)"
      >
   </div>
</template>

<script>
   export default {
      methods: {
         formatNumber(e) {
            e.target.value = e.target.value
               .replace(/[a-zа-я]/gi, '')
               .replace(/\./g, '')
               .replace(/\,/g, '')
               .replace(/\//g, '')
               .replace(/\D+/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

            this.setValue = e.target.value;
         }
      },

      computed: {
         setValue: {
            get() {
               return this.value;
            },
            set(value) {
               this.$emit('input', value);
            }
         },
      },

      props: {
         value: {
            default: ''
         },

         type: {
            type: String,
            default: 'text'
         },

         placeholder: {
            type: String,
            default: 'placeholder'
         }
      }
   }
</script>

<style lang="scss" scoped>
   .customInput {
      padding: 14px 16px;
      border-radius: 8px;
      border: 1px solid #CDD5DF;
      background-color: #FFFFFF;
      transition: all .3s;

      &:hover {
         border-color: #84ADFF;
      }

      &:has(input:focus) {
         border-color: #155EEF;
      }

      input {
         font-size: 16px;
         width: 100%;
         padding: 0;
         border: none;
         outline: none;

         &::placeholder {
            color: #697586;
         }
      }
   }
</style>