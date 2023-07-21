<template>
   <div
      :class="{ 'checked': checked }"
      class="custom-checkbox"
      @click="toggleChecked"
   >
      <div :class="{'checkbox-checked': checked}" class="checkbox-border">
         <div v-if="checked" class="checkbox-tick">
            <svg fill="none" height="9" viewBox="0 0 12 9" width="12" xmlns="http://www.w3.org/2000/svg">
               <path d="M10.6668 1.5L4.25016 7.91667L1.3335 5" stroke="#155EEF" stroke-linecap="round" stroke-linejoin="round"
                     stroke-width="2"/>
            </svg>

         </div>
      </div>
   </div>
</template>

<script>
export default {
   props: {
      value: Boolean,
   },
   data() {
      return {
         checked: this.value,
      };
   },
   computed: {},
   methods: {
      toggleChecked() {
         this.checked = !this.checked;
         this.$emit('input', this.checked);
      },
   },
};
</script>

<style>
.custom-checkbox {
   display: inline-block;
   cursor: pointer;
}

.checkbox-border {
   display: flex;
   justify-content: center;
   align-items: center;
   border-radius: 6px;
   border: 1px solid #CDD5DF;
   width: 20px;
   height: 20px;
   margin-right: 12px;
}

.checkbox-tick {
   display: flex;
   justify-content: center;
   align-items: center;
   /*transform: rotate(90deg);*/
}

.checkbox-checked {
   border: 1px solid #155EEF !important;
}
</style>
