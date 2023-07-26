<template>
   <ul class="viewAspect">
      <li
         :class="['viewAspect__item', {'active' : setValue === option.id}]"
         v-for="option in options"
         :key="option.id"
         @click="setValue = option.id"
      >{{ option.name }}</li>
   </ul>
</template>

<script>
   export default {
      computed: {
         setValue: {
            get() {
               return this.value;
            },
            set(value) {
               return this.$emit('input', value);
            }
         }
      },

      props: {
         value: {
            type: Number,
            default: 1
         },

         options: {
            type: Array,
            default() { return [] }
         }
      }
   }
</script>

<style lang="scss" scoped>
   .viewAspect {
      display: flex;
      align-items: center;
      border-radius: 12px;
      padding: 8px;
      background-color: rgba(32, 41, 57, 0.88);
      pointer-events: all;

      &__item {
         padding: 8px 10px;
         font-size: 15px;
         font-weight: 500;
         line-height: 18px;
         color: #FFFFFF;
         border-radius: 8px;
         transition: all .3s;
         cursor: pointer;

         &.active {
            background-color: #4B5565;
         }
      }
   }
</style>
