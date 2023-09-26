<template>
   <div class="form-group" @click="stop">
      <div class="checkbox-input">
         <input
            class="sr-only"
            :id="id || inputName"
            :type="type"
            :name="inputName"
            :value="checkedValue"
            :disabled="disabled"
            :class="{ invalid, disabled }"
            :true-value="typeof inputValue === 'number' ? 1 : true"
            :false-value="typeof inputValue === 'number' ? 0 : false"
            v-model="inputValue"
         />

         <label
            :for="id || inputName"
            class="cursor-pointer"
            :class="{
               transparent,
               'pr-0': labelClick,
               'has-popover': hasPopover,
               'wrap-text': skipTruncate,
               'justify-content-center' : !showInput
            }"
            @click="handleClick"
            v-tooltip="hasTooltip ? label : ''"
         >
            <span class="checkbox" v-if="showInput">
               <icon name="check" />
            </span>

            <icon class="checkbox-icon" :name="iconName" v-if="iconName"/>

            <span
               :class="[
                  'text-truncate text-dark-blue-2 text-hover-red pl-3 pl-lg-0 cursor-pointer white-space-break',
                  { 'skip-truncate': skipTruncate }
               ]"
               v-if="labelClick"
               @click.stop.prevent="$emit('label-click')"
            >
               <span v-html="label"></span>
               <icon class="ml-1" name="chevron-right" v-if="!isMobileBreakpoint" />
               <!-- <inline-svg src="/icons/chevron-right.svg" :height="14" class="ml-1"  v-if="!isMobileBreakpoint"  /> -->
            </span>

            <span
               :class="['text-truncate white-space-break', { 'skip-truncate': skipTruncate }]"
               v-html="label"
               v-else
            />
         </label>
         <slot/>
      </div>
   </div>
</template>

<script>
   export default {
      props: {
         value: {},
         id: String,
         type: {
            type: String,
            default: 'checkbox',
         },
         label: {
            type: String,
            default: ' ',
         },
         checkedValue: {
            default: true,
         },
         inputName: {
            type: String,
            default: '',
         },
         disabled: {
            type: Boolean,
            default: false,
         },
         invalid: {
            type: Boolean,
            default: false,
         },
         iconName: {
            type: String,
            default: '',
         },
         transparent: {
            type: Boolean,
            default: false,
         },
         stopPropagation: {
            type: Boolean,
            default: false,
         },
         showInput: {
            type: Boolean,
            default: true
         },
         labelClick: {
            type: Boolean,
         },
         watchValue: Boolean,
         hasTooltip: Boolean,
         skipTruncate: Boolean,
         hasPopover: Boolean
      },

      data() {
         return {
            prevValue: this.value
         }
      },

      computed: {
         inputValue: {
            get() {
               return this.value
            },
            set(value) {
               value = this.disabled ? this.value : value;
               this.$emit('input', value);
               // check if value was changed
               if (value !== this.prevValue) {
                  this.prevValue = value;
               }
               this.$emit('change', value);
               this.$emit('getIdValue', {id: this.id, value});
            }
         },
      },

      methods: {
         stop(e) {
            if (this.stopPropagation) e.stopPropagation();
         },

         handleClick() {
            if (this.disabled) this.$emit('try');
         }
      },

      watch: {
         value(value) {
            if (this.watchValue) this.inputValue = value;
         }
      }
   }
</script>
