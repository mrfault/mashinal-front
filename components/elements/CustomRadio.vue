<template>
   <div :class="['customRadio', className]">
      <template v-if="type === 'template-1'">
         <h4 class="customRadio__title">{{ title }}</h4>

         <div class="customRadio__inner">
            <div
               class="customRadio__content"
               v-for="radio in options"
            >
               <input
                  type="radio"
                  name="radioItem"
                  ref="radioInput"
                  :id="`radio_${radio.key}`"
                  @input="sorting = radio.key"
               >
               <label :for="`radio_${radio.key}`">
                  <!--                              <icon-->
                  <!--                                 :class="`type-of-drive-${radio.key}`"-->
                  <!--                                 :name="getIcon('type_of_drive', radio.key)"-->
                  <!--                              />-->

                  <span>{{ radio.name }}</span>
               </label>
            </div>
         </div>
      </template>
   </div>
</template>

<script>
   export default {
      data() {
        return {

        }
      },
      computed: {
         set() {

         },
         get() {

         }
      },
      props: {
         value: {
            type: String,
            default: 'template-1'
         },

         type: {
            type: String,
            default: 'template-1'
         },

         title: {
            type: String,
            default: ''
         },

         className: {
            type: String,
            default: ''
         },

         options: {
            type: Array,
            default() { return [] }
         }
      }
   }
</script>

<style lang="scss" scoped>
   .customRadio {
      &__title {
         font-weight: 400;
         font-size: 16px;
         line-height: 20px;
         color: #1B2434;
         margin-bottom: 12px;
      }

      &__inner {
         display: flex;
         align-items: center;
      }

      &__content {
         &:not(:first-child) {
            margin-left: 16px;
         }
      }

      input {
         display: none;
         &:checked {
            & + label {
               border-color: #155EEF;

               span {
                  font-weight: 500;
                  color: #121926;
               }
            }
         }
      }

      label {
         display: flex;
         align-items: center;
         margin: 0;
         padding: 14px 16px;
         border-radius: 8px;
         border: 1px solid #CDD5DF;
         background-color: #FFFFFF;
         cursor: pointer;

         span {
            //margin-left: 10px;
            font-size: 16px;
            color: #364152;
         }
      }

      &.circle {
         width: 100%;

         .customRadio__content {
            width: 50%;
         }

         input {
            &:checked {
               & + label {
                  &:before {
                     border-color: #155EEF;
                     background-color: #EFF4FF;
                  }

                  &:after {
                     background-color: #155EEF;
                  }
               }
            }
         }

         label {
            position: relative;
            transition: all .3s;

            &:before, &:after {
               content: '';
               position: absolute;
               transform: translateY(-50%);
               border-radius: 50%;
               transition: all .3s;
            }

            &:before {
               left: 22px;
               top: 50%;
               width: 24px;
               height: 24px;
               border: 1px solid #CDD5DF;
            }

            &:after {
               left: 30px;
               top: 50%;
               transform: translateY(-50%);
               width: 8px;
               height: 8px;
            }

            span {
               margin-left: 40px;
            }
         }
      }
   }
</style>
