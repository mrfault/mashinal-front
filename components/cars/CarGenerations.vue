<template>
   <div class="carGenerations">
      <h4 class="carGenerations__title">Nəsil</h4>

      <ul class="carGenerations__items">
         <li
            class="carGenerations__items-item"
            v-for="item in items"
            :key="item.id"
         >
            <input
               :id="item.id"
               type="radio"
               name="carGenerationsRadio"
               @input="selectItem(item)"
               ref="input"
            >

            <label
               :for="item.id"
               :style="`background: url('${item.car_type_generation[0].transformed_media.main[0]}') center center / cover no-repeat`"
            >
               <span>{{ item.short_name[locale] }}</span>
            </label>
         </li>
      </ul>
   </div>
</template>

<script>
   export default {
      methods: {
         selectItem(item) {
            this.$emit('selected', item.id);
         }
      },

      props: {
         items: {
            type: Array,
            default() { return [] }
         },
         disabled: {
            type: Boolean,
            default: false
         }
      },

      watch: {
         disabled(val) {
            if (val) this.$emit('selected', '');

            if (this.$refs.input) {
               [...this.$refs.input].forEach(item => {
                  item.checked = false;
               })
            }
         }
      }
   }
</script>

<style lang="scss" scoped>
   .carGenerations {
      padding: 16px;
      border-radius: 8px;
      border: 1px solid #CDD5DF;
      background-color: #FFFFFF;

      &__title {
         font-weight: 400;
         font-size: 16px;
         line-height: 20px;
         color: #202939;
         margin-bottom: 16px;
      }

      &__items {
         display: flex;
         justify-content: space-between;
         flex-wrap: wrap;
         list-style: none;
         margin: 0;
         padding: 0;

         &-item {
            position: relative;
            overflow: hidden;
            &:before {
               content: '';
               position: absolute;
               left: 1px;
               bottom: 16px;
               width: 100%;
               height: 56px;
               border-radius: 8px;
               background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, #081A3E 100%);
               z-index: 2;
            }

            input {
               display: none;
               &:checked {
                  & + {
                     label {
                        &:before, &:after {
                           content: '';
                        }

                        span {
                           left: 34px;
                        }
                     }
                  }
               }
            }

            label {
               position: relative;
               display: flex;
               align-items: center;
               flex-direction: column;
               margin-bottom: 16px;
               width: 196px;
               height: 120px;
               border-radius: 8px;
               cursor: pointer;
               transition: all .3s;

               &:before {
                  position: absolute;
                  bottom: 12px;
                  left: 12px;
                  width: 16px;
                  height: 16px;
                  border-radius: 50%;
                  background-color: #155EEF;
                  z-index: 3;
               }

               &:after {
                  position: absolute;
                  bottom: 16px;
                  left: 16px;
                  width: 8px;
                  height: 8px;
                  background: url("/icons/check_white.svg") center center / cover no-repeat;
                  z-index: 3;
               }

               span {
                  position: absolute;
                  bottom: 12px;
                  left: 12px;
                  font-size: 13px;
                  line-height: 16px;
                  color: #FFFFFF;
                  z-index: 3;
               }
            }
         }
      }
   }
</style>