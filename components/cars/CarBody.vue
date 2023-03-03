<template>
   <div class="carBody">
      <h4 class="carBody__title">Ban növü</h4>

      <ul class="carBody__items">
         <li class="carBody__items-item" v-for="item in items" :key="item.id">
            <input
               :id="`radio${item.id}`"
               type="radio"
               name="radio"
               @input="selectItem(item)"
            >

            <label :for="`radio${item.id}`">
               <img :src="item.transformed_media" alt="carBody_icon">

               <span>{{ item.name[locale] }}</span>
            </label>
         </li>
      </ul>
   </div>
</template>

<script>
export default {
   methods: {
      selectItem(item) {
         console.log('ssss',item)
         this.$emit('selected', item.id);
      }
   },
   props: {
      items: {
         type: Array,
         default() {
            return []
         }
      }
   }
}
</script>

<style lang="scss" scoped>
   .carBody {
      padding: 16px 16px 0 16px;
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
            input {
               display: none;
               &:checked {
                  & + {
                     label {
                        border-color: #155EEF;

                        &:before, &:after {
                           content: '';
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
               padding-top: 35px;
               width: 196px;
               height: 104px;
               border-radius: 8px;
               border: 1px solid transparent;
               background-color: #EFF4FF;
               cursor: pointer;
               transition: all .3s;

               &:before {
                  position: absolute;
                  top: 12px;
                  left: 12px;
                  width: 16px;
                  height: 16px;
                  border-radius: 50%;
                  background-color: #155EEF;
               }

               &:after {
                  position: absolute;
                  top: 16px;
                  left: 16px;
                  width: 8px;
                  height: 8px;
                  background: url("/icons/check_white.svg") center center / cover no-repeat;
               }

               img {
                  max-width: 82px;
               }

               span {
                  margin-top: 10px;
                  font-size: 13px;
                  line-height: 16px;
                  color: #202939;
               }
            }
         }
      }
   }
</style>