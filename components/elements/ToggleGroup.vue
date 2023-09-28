<template>
   <div class="toggle_group">
      <label v-if="label">{{ label }}</label>
      <div class="toggle_container">
         <div
            :class="['toggle_item', { active: selected === item.id }, { disabled: disabled }]"
            v-for="item in items"
            :key="item.id"
            @click="setSelected(item)"
         >
            <slot :item="item"/>
         </div>
      </div>
   </div>
</template>

<script>
export default {
   props: {
      label: {
         type: String,
      },
      defaultValue: {
         type: [Number, String],
         default: 1
      },
      disabled: {
         type: Boolean,
         default: false
      },
      items: Array,
   },
   data() {
      return {
         selected: 0,
      };
   },
   methods: {
      setSelected(item) {
         this.selected = item.id;
         this.$emit("change", item);
      },
   },
   mounted() {
      this.selected = this.defaultValue;
   },
   watch: {
      defaultValue() {
         this.selected = this.defaultValue;
      }
   }
};
</script>

<style scoped lang="scss">
.toggle_group {
   label {
      margin-bottom: 16px;
   }

   .toggle_container {
      display: flex;
      gap: 16px;

      .toggle_item {
         position: relative;
         flex: 1;
         border-radius: 8px;
         cursor: pointer;
         border: 1px solid #cdd5df;

         &.disabled {
            pointer-events: none;
            border-color: #cdd5df;
            opacity: 0.4;
         }

         &.active {
            background-color: #EFF4FF;
            border-color: #155eef;
         }

         .check_icon {
            position: absolute;
            top: 16px;
            left: 16px;
            width: 16px;
            height: 16px;
            color: #155eef;
            z-index: 10;
         }
      }
   }
}

.dark-mode {
   .toggle_group {
      .toggle_container {
         .toggle_item {
            background-color: #121926;
            border-color: transparent;

            &.active {
               border-color: #155eef;
            }
         }
      }
   }
}
</style>
