<template>
   <div
      :class="['customDropdown', className, { 'selected' : value, 'disabled' : disabled, 'search' : search }]"
      @click.stop="onClick($event)"
   >
      <template>
         <div class="customDropdown__head">
            <span class="customDropdown__placeholder">{{ placeholder }}</span>

            <input
               v-if="search"
               ref="input"
               type="text"
               :placeholder="`${placeholder}`"
               v-model="searchValue"
            >

            <span class="customDropdown__selected">
               <template v-if="translate">
                  {{ (value.name) ? $t(value.name) : $t(value) }}
               </template>

               <template v-else>
                  {{ (value.name) ? value.name : value }}
               </template>
             </span>

            <icon name="chevron-down"/>
         </div>

         <ul class="customDropdown__main">
            <li
               class="customDropdown__main-item remove"
               @click="removeValue"
            >
               <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 4L4 12" stroke="#697586" stroke-width="1.6" stroke-linecap="round"
                        stroke-linejoin="round"/>
                  <path d="M4 4L12 12" stroke="#697586" stroke-width="1.6" stroke-linecap="round"
                        stroke-linejoin="round"/>
               </svg>

               <span>Sıfırla</span>
            </li>

            <li
               class="customDropdown__main-item"
               v-for="(item, i) in filteredItems"
               :key="i"
               @click="selectItem(item)"
            >
<!--               <pre>{{item}}</pre>-->
               <template v-if="translate">
                  {{ (item.name) ? $t(item.name) : $t(item) }}
               </template>

               <template v-else>
                  {{ (item.name) ? item.name : item }}
               </template>
            </li>
         </ul>
      </template>
   </div>
</template>

<script>
   export default {
      data() {
         return {
            searchValue: ''
         }
      },

      methods: {
         onClick(e) {
            document.querySelectorAll('.customDropdown').forEach(dropdown => {
               dropdown.classList.remove('active');
            });
            e.currentTarget.classList.toggle('active');

            if (this.$refs.input) this.$refs.input.focus();

            // if (this.search) {
            //    if (this.translate) {
            //       console.log('this.translate', this.translate)
            //       console.log('this.value', this.value)
                  //    if (this.value.name) {
                  //       this.setPlaceholder = this.$t(this.value.name);
                  //    } else {
                  //       this.setPlaceholder = this.$t(this.value);
                  //    }
                  // } else {
                  //    (this.value.name) ? this.setPlaceholder = this.value.name : this.setPlaceholder = this.value;
                  // }
               // }
            // }
         },

         selectItem(item) {
            if (this.getFullDetails) {
               this.setValue = item;
            } else {
               (item.name) ? this.setValue = item.name : this.setValue = item;
            }

            this.searchValue = '';

            setTimeout(() => this.close(), 0);
         },

         removeValue() {
            this.setValue = this.searchValue = '';
         },

         close() {
            document.querySelectorAll('.customDropdown').forEach(dropdown => {
               dropdown.classList.remove('active');
            });
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

         filteredItems() {
            if (this.search) {
               return this.items?.filter(item => {
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
               return this.items;
            }
         },
      },

      props: {
         className: {
            type: String,
            default: ''
         },
         value: {
            default: ''
         },
         placeholder: {
            type: String,
            default: ''
         },
         getFullDetails: {
            type: Boolean,
            default: false
         },
         disabled: {
            type: Boolean,
            default: false
         },
         translate: {
            type: Boolean,
            default: true
         },
         search: {
            type: Boolean,
            default: false
         },
         items: {
            type: Array,
            default() {
               return []
            }
         }
      },

      watch: {
         disabled(val) {
            if (val) this.removeValue();
         }
      },

      mounted() {
         // if (this.value) this.setPlaceholder = this.value;

         window.addEventListener('click', this.close);
      },

      beforeDestroy() {
         window.addEventListener('click', this.close);
      }
   }
</script>

<style lang="scss" scoped>
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
            display: none;
            border: none;
            outline: none;
            padding: 0;
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

      &__selected {
         font-weight: 400;
         font-size: 16px;
         line-height: 20px;
         color: #202939;
      }

      &__main {
         position: absolute;
         top: 62px;
         left: 0;
         width: 100%;
         max-height: 240px;
         margin: 0;
         padding: 8px 2px 8px 8px;
         list-style: none;
         overflow-y: auto;
         border-radius: 8px;
         border: 1px solid #CDD5DF;
         background-color: #FFFFFF;
         z-index: 13;

         opacity: 0;
         visibility: hidden;
         transition: opacity .1s, visibility .1s;

         &::-webkit-scrollbar {
            width: 15px; // Ширина скролла.
         }

         &::-webkit-scrollbar-track {
            background-color: transparent; // Цвет трека.
         }

         &::-webkit-scrollbar-thumb:vertical {
            height: 30px;
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
            color: #202939;
            border-radius: 8px;
            cursor: pointer;
            transition: all .3s;

            &:hover {
               background-color: #EEF2F6;
            }

            &.remove {
               display: flex;
               align-items: center;

               svg {
                  margin: 1px 6px 0 0;
               }
            }
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

            input {
               display: block;
            }

            i {
               transform: translateY(-50%) rotate(-180deg);
            }
         }

         .customDropdown__main {
            border-color: #155EEF;

            opacity: 1;
            visibility: visible;
            transition: opacity .3s, visibility;
         }

         &.search {
            .customDropdown__placeholder, .customDropdown__selected {
               display: none;
            }
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

      &:hover {
         .customDropdown__head {
            border-color: #84ADFF;
         }
      }

      &::-webkit-scrollbar {
         width: 0; // Ширина скролла.
      }
   }
</style>