<template>
   <div :class="['row', iconsOnly || groupBy === 5 ? '' : 'mb-n2 mb-lg-n3']">
      <div
         :class="[
            'item mb-2 mb-lg-3',
            iconsOnly ? 'col-2 col-lg-1' : `col-6 col-lg-${groupBy === 5 ? '1-5' : ([1,2,3,4,6,12].includes(groupBy) ? 12 / groupBy : 4)}`
         ]"
         v-for="(option, index) in options"
         :key="option.title"
      >
         <div
            :class="['selectable-block', {'disabled': option.disabled, 'active': selected === option.title || selected === getKey(option), 'icons-only': iconsOnly}]"
            @click.stop="selected = { value: option.id || option.title, index, key: getKey(option) }"
            v-tooltip="iconsOnly && $t(option.title)"
         >
            <div class="block-icon">
               <icon v-if="option.title !== 'registration_marks'" :name="option.icon"/>

               <inline-svg v-else :src="option.icon" />
            </div>

            <span class="block-info" v-if="!iconsOnly">
               {{ $t(option.title) }}

               <inline-svg
                  v-if="option.title === 'registration_marks'"
                  src="/icons/new_badge_2.svg"
                  :width="'39px'"
               />
           </span>
         </div>
      </div>
   </div>
</template>

<script>
export default {
   props: {
      value: {},
      options: Array,
      iconsOnly: Boolean,
      groupBy: {
         type: Number,
         default: 3
      }
   },
   computed: {
      selected: {
         get() {
            return this.value;
         },
         set(value) {
            let isSame = this.value === value.title || this.value === value.key || this.value === value.id;
            this.$emit('input', value);
            if (!isSame) this.$emit('change', value);
         }
      }
   },
   methods: {
      getKey(option) {
         return option.id || this.options.find(item => item.title === option.title).icon.split('-').pop();
      }
   }
}
</script>