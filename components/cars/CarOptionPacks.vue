<template>
  <div class="car-option-packs row" >
    <div class="col-6 col-lg-6 mb-2 mb-lg-3" v-for="pack in packs" :key="pack.id">
      <div :class="['pack-item',{'active': selected.includes(pack.id)}]" @click="selected = pack.id">
        <div class="pack-icon">
          <icon :name="pack.icon"/>
        </div>
        <div class="pack-info">
          <strong>{{$t(pack.name)}}</strong>
          <span v-html="$t(pack.description)"></span>
        </div>
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
        for(let key in this.value)
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
              icon: 'seat'
           },
           {
              id: 1,
              name: 'proxodimiy',
              description: "proxodimiy_info",
              icon: 'car-gearing'
           },
           {
              id: 2,
              name: 'economic',
              description: "economic_info",
              icon: 'oil'
           },
           {
              id: 3,
              name: 'fast',
              description: "fast_info",
              icon: 'seat'
           },
        ]
     }
   }
}
</script>
