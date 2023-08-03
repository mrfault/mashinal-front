<template>
   <div class="ma-penalties__top">
      <div v-if="cars.data.length" :class="{'mr-0 mt-3' : isMobileBreakpoint}" class="ma-penalties__top--search">
         <div class="form-group lighterOnDarkMode isSearchInput">
            <div class="text-input">
               <input
                  v-model="searchNumber"
                  :placeholder="$t('search_number')"
                  autocomplete="off"
                  class="car-number-show-popover"
                  maxlength="9"
                  type="text"
                  @input="onInputChange"
                  @keypress="validateInput"
               >
               <inline-svg src="/new-icons/fi_search.svg"/>
            </div>
         </div>
      </div>
      <div v-show="carsList.length" class="ma-penalties__top--numbers">
         <div
            id="carNumberContainer"
            :class="{
                    'overflow-x-hidden': carsList.length < 5 && !isMobileBreakpoint,
                    'overflow-x-hidden-mobile': carsList.length < 3 && isMobileBreakpoint
                  }"
            class="ma-penalty-number-chip__container"
            @mousedown="startDragging"
         >
            <div class="ma-penalty-number-chip__list">
               <div
                  v-for="(car, index) in carsList"
                  :key="index + 98237492"
                  :class="{
            'ma-penalty-number-chip--active': selectedCar == car,
            'ma-penalty-number-chip--disabled': car.sync_status !== 1,
            'ma-penalty-number-chip--active--disabled':
              selectedCar == car && car.sync_status !== 1
          }"
                  class="ma-penalty-number-chip"
                  @click="selectCar(car)"
               >
                  {{ formattedCarNumber(car.car_number) }}
               </div>
            </div>
         </div>
         <div v-if="(carsList.length > 4 && isMobileBreakpoint) || (carsList.length > 5 && !isMobileBreakpoint)"
              class="ma-penalties__top--numbers__scrollButton">
            <button @click="scrollToRight">
               <icon name="chevron-right"/>
            </button>
         </div>
      </div>
   </div>
</template>

<script>
export default {
   props:{
      cars: Object,
      carsList: Array,
   },
   data(){
      return{
         searchNumber: "",
      }
   },
   methods:{
      startDragging(event) {
         event.preventDefault(); // Disable content selection while dragging

         const container = event.currentTarget;
         let startX = event.clientX;
         let scrollLeft = container.scrollLeft;

         const scrollByDragging = (event) => {
            const distance = event.clientX - startX;
            container.scrollLeft = scrollLeft - distance;
         };

         const stopDragging = () => {
            document.removeEventListener('mousemove', scrollByDragging);
            document.removeEventListener('mouseup', stopDragging);
            container.style.userSelect = ''; // Restore default content selection behavior
         };

         document.addEventListener('mousemove', scrollByDragging);
         document.addEventListener('mouseup', stopDragging);
         container.style.userSelect = 'none'; // Disable content selection during dragging
      },
      scrollToRight(e) {
         const carNumberContainer = document.getElementById('carNumberContainer');
         carNumberContainer.scrollLeft += 100
      },

      onInputChange() {
         if (this.searchNumber.trim() === "") {
            this.carsList = this.cars.data;
         } else if (this.isValidInput(this.searchNumber)) {
            this.filterCarNumber();
         } else {
            this.carsList = [];
         }
      },
      isValidInput(text) {
         const validCharactersRegex = /^[A-Za-z0-9]*$/;
         return validCharactersRegex.test(text);
      },
      filterCarNumber() {
         const searchCarNumber = this.searchNumber.trim();

         if (
            this.containsRussianLetters(searchCarNumber) ||
            this.containsDisallowedCharacters(searchCarNumber)
         ) {
            this.carsList = [];
            return;
         }

         this.carsList = this.cars.data.filter((car) =>
            car.car_number.toLowerCase().includes(searchCarNumber.toLowerCase())
         );

         this.selectedCar = null;
      },
      validateInput(event) {
         const enteredChar = event.key;
         const validCharactersRegex = /^[A-Za-z0-9]*$/;

         if (!validCharactersRegex.test(enteredChar)) {
            event.preventDefault();
         }
      },

      selectCar(car){
         this.$emit('selectedCar', car)
      }

   },
   mounted() {

      const carNumberContainer = document.getElementById('carNumberContainer');
      carNumberContainer.addEventListener('mousedown', this.startDragging);
   }
}
</script>

<style scoped>

</style>
