<template>
   <div
      :class="['customDropdown',
         {
            'active' : isActive,
            'selected' : value,
            'disabled' : disabled,
            'search' : search,
            'color' : color,
         }
      ]"
      @keyup.esc="isActive = false"
      @click="isActive = !isActive"
      v-click-outside="close"
   >
      <template>
         <div class="customDropdown__head" @keyup.esc="isActive = false">
            <span class="customDropdown__placeholder" v-if="!search || !isActive">{{ placeholder }}</span>

            <input
               v-if="search && isActive"
               type="text"
               ref="input"
               :placeholder="inputPlaceholder"
               v-model="searchValue"
               @click.stop
            >

            <span class="customDropdown__selected" v-if="!search || !isActive">
               <template v-if="translateLocale">
                  {{ value && value.name[locale] }}
               </template>

               <template v-else-if="translate">
                  {{ (value.name) ? $t(value.name) : $t(value) }}
               </template>

               <template v-else>
                  {{ (value.name) ? value.name : value }}
               </template>
             </span>

            <icon name="chevron-down" />
         </div>

         <Transition name="opacity">
            <ul class="customDropdown__main" v-if="isActive" @keyup.esc="isActive = false">
               <li
                  class="customDropdown__main-item remove"
                  @click="removeValue"
               >
                  <inline-svg :src="'/icons/close.svg'" :width="'10px'" :height="'10px'" />

                  <span v-if="!hideClearSearch">{{ $t('clear_search') }}</span>
               </li>

               <li
                  :class="['customDropdown__main-item', {'selected' : item.name === value}]"
                  v-for="(item, i) in filteredOptions"
                  :key="i"
                  @click="selectItem(item)"
               >
                  <div
                     v-if="color"
                     class="customDropdown__main-itemColor"
                     :style="{ backgroundColor: `${item.code }`}"
                  ></div>

                  <template v-if="translateLocale">
                     {{ item && item.name[locale] }}
                  </template>

                  <template v-else-if="translate">
                     {{ (item.name) ? $t(item.name) : $t(item) }}
                  </template>

                  <template v-else>
                     {{ (item.name) ? item.name : item }}
                  </template>
               </li>
            </ul>
         </Transition>
      </template>
   </div>
</template>

<script>
   export default {
      data() {
         return {
            isActive: false,
            searchValue: '',
         }
      },

      methods: {
         // onClick(e) {
         //    document.querySelectorAll('.customDropdown').forEach(dropdown => {
         //       dropdown.classList.remove('active');
         //    });
         //    e.currentTarget.classList.toggle('active');
         //
         //    if (this.$refs.input) this.$refs.input.focus();
         //
         //    // if (this.search) {
         //    //    if (this.translate) {
         //    //       console.log('this.translate', this.translate)
         //    //       console.log('this.value', this.value)
         //    //    if (this.value.name) {
         //    //       this.setPlaceholder = this.$t(this.value.name);
         //    //    } else {
         //    //       this.setPlaceholder = this.$t(this.value);
         //    //    }
         //    // } else {
         //    //    (this.value.name) ? this.setPlaceholder = this.value.name : this.setPlaceholder = this.value;
         //    // }
         //    // }
         //    // }
         // },

         selectItem(item) {
            if (this.getFullDetails) {
               this.setValue = item;
            } else {
               item.name ? this.setValue = item.name : this.setValue = item;
            }

            this.searchValue = '';
         },

         removeValue() {
            this.setValue = this.searchValue = '';
         },

         close() {
            this.isActive = false;
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

         setPlaceholder: {
            get() {
               return this.placeholder;
            },
            set(value) {
               this.$emit('input', value);
            }
         },

         filteredOptions() {
            if (this.search) {
               return this.options?.filter(item => {
                  if (item.name) {
                     return String(item.name).toLowerCase().includes(this.searchValue.toLowerCase());
                     // return item?.name.includes(this.searchValue);
                  } else {
                     return String(item).toLowerCase().includes(this.searchValue.toLowerCase());
                     // return console.log(String(item))
                  }
                  // setTimeout(() => {
                  //    document.querySelectorAll('.customDropdown__main-item').forEach(li => {
                  //       this.selectedItems.forEach(selectedItem => {
                  //          if (li.getAttribute('data-id') == selectedItem.id) {
                  //             li.classList.add('selected')
                  //          }
                  //       })
                  //    })
                  // }, 0)
               })
            } else {
               return this.options;
            }
         },
      },

      props: {
         value: {
            default: ''
         },

         placeholder: {
            type: String,
            default: ''
         },

         inputPlaceholder: {
            type: String,
            default: ''
         },

         getFullDetails: {
            type: Boolean,
            default: false
         },

         hideClearSearch: {
            type: Boolean,
            default: false
         },

         disabled: {
            type: Boolean,
            default: false
         },

         translate: {
            type: Boolean,
            default: false
         },

         translateLocale: {
            type: Boolean,
            default: false
         },

         color: {
            type: Boolean,
            default: false
         },

         search: {
            type: Boolean,
            default: false
         },

         options: {
            type: Array,
            default() {
               return []
            }
         }
      },

      watch: {
         disabled(val) {
            if (val) this.removeValue();
         },

         isActive() {
            this.$nextTick(() => this.$refs?.input?.focus());
         }

         // clearValue(newVal, oldVal) {
         //    if (oldVal) {
         //       if (typeof newVal === 'object') {
         //          if (newVal.id !== oldVal.id) {
         //             this.removeValue();
         //          } else if (newVal.key !== oldVal.key) {
         //             this.removeValue();
         //          }
         //       } else {
         //          if (newVal !== oldVal) {
         //             this.removeValue();
         //          }
         //       }
         //    }
         // }
      },

      mounted() {
         window.addEventListener("keyup", (e) => {
            if (e.keyCode === 27) this.close();
         });
      },

      beforeDestroy() {
         window.addEventListener('keyup', this.close);
      }
   }
</script>

<style lang="scss">
   .customDropdown {
      position: relative;
      min-width: 66px;
      z-index: 10;
      border-radius: 8px;

      &__head {
         position: relative;
         display: flex;
         align-items: center;
         justify-content: space-between;
         height: 52px;
         padding: 15px 16px;
         border-radius: 8px;
         border: 1px solid #CDD5DF;
         transition: all .3s;

         input {
            width: 95%;
            border: none;
            outline: none;
            padding: 0 10px 0 0;
            font-weight: 400;
            font-size: 16px;
            line-height: 20px;
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
            background-color: transparent;

            &::placeholder {
               color: #697586;
            }

            &:focus{
               text-overflow: ellipsis;
               overflow: hidden;
               white-space: nowrap;
            }
         }

         .icon-chevron-down {
            position: absolute;
            top: 50%;
            right: 16px;
            transform: translateY(-50%);
            transition: all .3s;

            &:before {
               margin-left: 0;
            }
         }
      }

      &__placeholder {
         font-size: 16px;
         color: #1B2434;
         user-select: none;
      }

      &__selected {
         font-weight: 400;
         font-size: 16px;
         line-height: 20px;
         color: #202939;
         padding-right: 20px;
         user-select: none;

         text-overflow: ellipsis;
         overflow: hidden;
         white-space: nowrap;
      }

      &__main {
         position: absolute;
         top: 62px;
         left: 0;
         width: 100%;
         max-height: 240px;
         padding: 8px ;
         list-style: none;
         overflow-x: hidden;
         overflow-y: auto;
         border-radius: 8px;
         border: 1px solid #CDD5DF;
         background-color: #FFFFFF;
         z-index: 13;

         &::-webkit-scrollbar {
            width: 15px; // Ширина скролла.
         }

         &::-webkit-scrollbar-track {
            background-color: transparent; // Цвет трека.
         }

         &::-webkit-scrollbar-thumb:vertical {
            height: 50px;
         }

         &::-webkit-scrollbar-thumb {
            border: 4px solid transparent;
            background-clip: padding-box;
            border-radius: 9999px;
            background-color: #9AA4B2;
         }

         //&::-webkit-scrollbar-thumb:hover {
         //   background-color: #9AA4B2; // Цвет скролла при наведении.
         //}

         &-item {
            padding: 12px 8px;
            font-weight: 400;
            font-size: 16px;
            line-height: 20px;
            color: #1B2434;
            border-radius: 8px;
            cursor: pointer;
            transition: all .3s;
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;

            &:hover {
               background-color: #EEF2F6;
            }

            &.remove {
               display: flex;
               align-items: center;

               svg {
                  margin: 1px 6px 0 0;

                  path {
                     stroke: #697586;
                  }
               }
            }

            &.selected {
               background-color: #EEF2F6;
            }
         }

         &-itemColor {
            width: 24px;
            height: 24px;
            margin-right: 10px;
            border-radius: 50%;
         }
      }

      &.active {
         z-index: 11;

         &:hover {
            .customDropdown__head {
               border-color: #155EEF;

            }
         }

         .customDropdown__head {
            border-color: #155EEF;

            i {
               transform: translateY(-50%) rotate(-180deg);
            }
         }

         .customDropdown__main {
            border-color: #155EEF;
         }
      }

      &.selected {
         .customDropdown__placeholder {
            position: absolute;
            top: 9px;
            font-weight: 400;
            font-size: 12px;
            line-height: 14px;
            color: #4B5565;
         }

         .customDropdown__selected {
            //position: absolute;
            //bottom: 9px;
            margin-top: 15px;
         }
      }

      &.disabled {
         pointer-events: none;

         .customDropdown__head {
            .icon-chevron-down {
               &:before {
                  color: #CDD5DF;
               }
            }
         }

         .customDropdown__placeholder {
            color: #4B5565;
         }
      }

      &.color {
         .customDropdown__main {
            &-item {
               display: flex;
            }
         }
      }

      &:hover {
         .customDropdown__head {
            border-color: #84ADFF;
         }
      }

      &::-webkit-scrollbar {
         width: 0; // Ширина скролла.
      }
   }

   .dark-mode {
      .customDropdown {
         &__placeholder {
            color: #9AA4B2 !important;
         }

         &__selected {
            color: #FFFFFF;
         }

         &__head {
            border: unset;
            background-color: #121926;

            .icon-chevron-down {
               &:before {
                  color: #9AA4B2;
               }
            }
         }

         &__main {
            border: unset;
            background-color: #121926;
            &-item {
               color: #9AA4B2;

               &.selected {
                  background-color: #eef2f62b;
               }

               &:hover {
                  background-color: #eef2f62b;
               }

               svg {
                  path {
                     fill: #9AA4B2;
                     stroke: #9AA4B2;
                  }
               }
            }
         }
      }
   }
</style>
