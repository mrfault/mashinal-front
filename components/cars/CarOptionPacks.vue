<template>
   <div class="car-option-packs">
      <div :class="['pack-item',{'active': selected?.includes(pack.id)}]" @click="selected = pack.id"
           v-for="pack in packs" :key="pack.id">
         <div class="pack-icon">
            <icon :name="pack.icon"/>
         </div>
         <div class="pack-info">
            <strong>{{ $t(pack.name) }}</strong>
            <span v-html="$t(pack.description)"></span>
         </div>
      </div>
   </div>
</template>

<script>
export default {
   props: {
      value: {}
   },
   computed: {
      selected: {
         get() {
            return this.value;
         },
         set(index) {
            let value = [];

            for (let key in this.value)
               if (this.value[key] != index) value.push(this.value[key]);
            if (this.value.indexOf(index) === -1) value.push(index);
            this.$emit('input', value);
         }
      }
   },
   data() {
      return {
         packs: [
            {
               id: 0,
               name: 'vmestitelniy',
               description: "vmestitelniy_info",
               values: {
                  n_of_seats: [
                     {key: 3, name: "Number of seats: 5"},
                     {key: 4, name: "Number of seats: 6"},
                     {key: 5, name: "Number of seats: 7"},
                     {key: 6, name: "Number of seats: 8"},
                     {key: 7, name: "Number of seats: 9"}
                  ],
                  trunk_volume_from: 500
               },
               icon: 'seat'
            },
            {
               id: 1,
               name: 'proxodimiy',
               description: "proxodimiy_info",
               values: {
                  gearing: [{name: "polnyy", key: 3}],
                  clearance_from: 20
               },

               icon: 'car-gearing'
            },
            {
               id: 2,
               name: 'economic',
               description: "economic_info",
               values: {
                  fuel_rate_to: 7
               },
               icon: 'oil'
            },
            {
               id: 3,
               name: 'fast',
               description: "fast_info",
               values: {
                  acceleration_to: 7
               },
               icon: 'dashboard'
            },
         ]
      }
   },
   watch: {
      value() {
         let objects = []
         this.packs.forEach((pack) => {
            if ( this.selected && this.selected.includes(pack.id)) {
               objects.push(pack)
            }
         })
         this.$emit('getObjects', objects);
      }
   }
}
</script>

<style lang="scss">
.car-option-packs {
   display: grid;
   grid-template-columns: 1fr 1fr;
   gap: 32px 24px;

   .pack-item {
      user-select: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      min-height: 72px;
      border: 1px solid #CDD5DF;
      border-radius: 12px;
      padding: 16px;

      &:hover {
         background-color: #ECF2F9;
      }

      &.active {
         border-color: #2970FF;
      }

      .pack-info {
         width: 100%;

         strong {
            display: block;
            font-weight: 500;
         }

         span {
            font-size: 13px;
         }
      }

      .pack-icon {
         flex-shrink: 0;
         font-size: 40px;
         margin-right: 15px;

         i {
            display: flex;
         }
      }
   }
}

.dark-mode {
   .car-option-packs {

      .pack-item {
         border: 1px solid #121926;
         background-color: #121926;

         &.active {
            border-color: #2970FF;
         }
      }
   }
}

@media (max-width: 1150px) {
   .car-option-packs {

      .pack-item {
         flex-direction: column;
         align-items: start;
         gap: 11px;

         &:hover {
            background-color: unset;
         }

         .pack-info {
            width: 100%;

            strong {
               font-size: 16px;
            }
         }
      }
   }
}
</style>
