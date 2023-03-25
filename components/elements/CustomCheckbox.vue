<template>
   <div :class="['customCheckbox', className, {'checkbox' : checkbox}]">
      <input
         type="checkbox"
         :id="id"
         v-model="checked"
      >

      <label :for="id">{{ text }}</label>
   </div>
</template>

<script>
   export default {
      data() {
         return {
            checked: false
         }
      },

      methods: {
         removeValue() {
            this.checked = false;
         },
      },

      props: {
         id: {
            type: String,
            default: 'id'
         },
         className: {
            type: String,
            default: ''
         },
         text: {
            type: String,
            default: 'Text'
         },
         checkedValue: {
            type: Boolean,
            default: false
         },
         checkbox: {
            type: Boolean,
            default: false
         },
         clearValue: {
            required: false
         },
      },

      watch: {
         checked() {
            this.$emit('check', this.checked);
         },

         clearValue(newVal, oldVal) {
            if (oldVal) {
               if (typeof newVal === 'object') {
                  if (newVal.id !== oldVal.id) {
                     this.removeValue();
                  } else if (newVal.key !== oldVal.key) {
                     this.removeValue();
                  }
               } else {
                  if (newVal !== oldVal) {
                     this.removeValue();
                  }
               }
            }
         }
      },

      mounted() {
         this.checked = this.checkedValue;
      }
   }
</script>

<style lang="scss" scoped>
   .customCheckbox {
      position: relative;
      width: 100%;

      input {
         display: none;

         &:checked {
            & + label {
               border-color: #528BFF;
            }
         }
      }

      label {
         height: 52px;
         font-weight: 400;
         font-size: 15px;
         line-height: 18px;
         margin: 0;
         text-align: center;
         color: #202939;
         padding: 16px 17px;
         border-radius: 8px;
         border: 1px solid #CDD5DF;
         cursor: pointer;
         transition: all .3s;
      }

      &.checkbox {
         input {
            &:checked {
               & + label {
                  border-color: #CDD5DF;

                  &:before {
                     border-color: #155EEF;
                     background-color: #EFF4FF;
                  }

                  &:after {
                     content: '';
                  }
               }
            }
         }

         label {
            width: 100%;
            padding: 16px 17px 16px 48px;
            text-align: left;

            &:before, &:after {
               position: absolute;
               top: 50%;
               transform: translateY(-50%);
            }

            &:before {
               content: '';
               left: 16px;
               width: 24px;
               height: 24px;
               border-radius: 4px;
               border: 1px solid #CDD5DF;
               background-color: transparent;
            }

            &:after {
               left: 21px;
               width: 14px;
               height: 11px;
               background: url("/icons/check_blue.svg") center center / cover no-repeat;
            }
         }
      }
   }
</style>