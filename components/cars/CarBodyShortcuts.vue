<template>
  <div :class="['car-body-shortcuts','row',{'has-value': !!Object.keys(value).length}]">
    <div class="col-6 col-lg-auto mb-2 mb-lg-3" v-for="(shortcut, index) in shortcuts" :key="index">
      <div :class="['shortcut', {'active': !!selected[index]}]" @click="selected = index">
        <img class="full-width" :src="`/img/car-body-shortcuts/${index + 1}.png`" :alt="$t(shortcut.name)" />
        <span>{{ $t(shortcut.name) }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  props: {
    value: {}
  },
  data() {
    return {
      shortcuts: [
        { name: 'hatchback', keys: [4,5,27] },
        { name: 'sedan', keys: [2,15,24] },
        { name: 'liftback', keys: [3] },
        { name: 'kabriolet', keys: [18] },
        { name: 'kupe', keys: [12,22] },
        { name: 'universal', keys: [23,1,31,32,30] },
        { name: 'furgon', keys: [20] },
        { name: 'vnedorojnik', keys: [6,8,9] },
        { name: 'pickup', keys: [13,16,17,34] },
        { name: 'miniven', keys: [11] }
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
        for(let key in this.value)
          if (key != index) value[key] = [...this.shortcuts[key].keys];
        if (!this.value[index]) value[index] = [...this.shortcuts[index].keys];
        this.$emit('input', value);
      }
    }
  }
}
</script>