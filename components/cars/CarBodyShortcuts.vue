<template>
   <div :class="['car-body-shortcuts',{'has-value': !!Object.keys(value).length}]">
      <div :class="['shortcut', {'active': !!selected[index]}]" @click="selected = index"
           v-for="(shortcut, index) in shortcuts" :key="index">
         <img :src="`/img/car-body-shortcuts/${index + 1}.png`" :alt="$t(shortcut.name)"/>
         <span>{{ $t(shortcut.name) }}</span>
      </div>
   </div>
</template>

<script>
import {mapGetters} from 'vuex';

export default {
   props: {
      value: {}
   },
   data() {
      return {
         shortcuts: [
            {name: 'hatchback', keys: [4, 5, 27]},
            {name: 'sedan', keys: [2, 15, 24]},
            {name: 'liftback', keys: [3]},
            {name: 'kabriolet', keys: [18]},
            {name: 'kupe', keys: [12, 22]},
            {name: 'universal', keys: [23, 1, 31, 32, 30]},
            {name: 'furgon', keys: [20]},
            {name: 'vnedorojnik', keys: [6, 8, 9]},
            {name: 'pickup', keys: [13, 16, 17, 34]},
            {name: 'miniven', keys: [11]}
         ]
      }
   },
   computed: {
      ...mapGetters(['bodyOptions']),

      selected: {
         get() {
            return this.value;
         },
         set(index) {
            let value = {};
            for (let key in this.value)
               if (key != index) value[key] = [...this.shortcuts[key].keys];
            if (!this.value[index]) value[index] = [...this.shortcuts[index].keys];
            this.$emit('input', value);
         }
      }
   },
}
</script>

<style lang="scss">
.car-body-shortcuts {
   width: 100%;
   display: grid;
   grid-template-columns: 1fr 1fr;
   gap: 16px 20px;

   &:hover,
   &.has-value {
      //.shortcut {
      //  opacity: .4;
      //}
   }

   .shortcut {
      padding: 16px 6px 12px 6px;
      background-color: #fff;
      border-radius: 12px;
      cursor: pointer;
      font-weight: 500;
      text-align: center;
      color: black;
      border: 1px solid #fff;
      transition: opacity .2s ease-out, transform .2s ease-out;

      img {
         height: 100px;
         width: 100%;
         object-fit: contain;
      }

      &:hover,
      &.active {
         transform: scale(1.03);
      }

      &.active {
         border-color: #2970FF;
         color: #246EB2;
         opacity: 1;
      }

      &:not(.active):hover {
         opacity: .7;
      }
   }
}

.dark-mode {
   .car-body-shortcuts {

      .shortcut {
         background-color: #1B2434;
         border-color: #1B2434;
         color: white;

         &.active {
            border-color: #2970FF;
         }
      }
   }
}

@media (max-width: 1150px) {
   .car-body-shortcuts {
      width: 100%;
      display: flex;
      gap: 16px 20px;
      overflow: scroll;
      padding: 8px 4px;

      .shortcut {
         min-width: 200px;
         border: 1px solid #CDD5DF;
      }
   }
}
</style>
