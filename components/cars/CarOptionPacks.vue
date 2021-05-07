<template>
  <div class="car-option-packs row" >
    <div class="col-6 col-lg-3 mb-2 mb-lg-3">
      <div :class="['pack-item',{'active': selected.includes(0)}]" @click="selected = 0">
        <div class="pack-icon">
          <icon name="seat"/>
        </div>
        <div class="pack-info">
          <strong>{{$t('vmestitelniy')}}</strong>
          <span v-html="$t('vmestitelniy_info')"></span>
        </div>
      </div>
    </div>
    <div class="col-6 col-lg-3 mb-2 mb-lg-3">
      <div :class="['pack-item',{'active': selected.includes(1)}]" @click="selected = 1">
        <div class="pack-icon">
          <icon name="car-gearing"/>
        </div>
        <div class="pack-info">
          <strong>{{$t('proxodimiy')}}</strong>
          <span v-html="$t('proxodimiy_info')"></span>
        </div>
      </div>
    </div>
    <div class="col-6 col-lg-3 mb-2 mb-lg-3">
      <div :class="['pack-item',{'active': selected.includes(2)}]" @click="selected = 2">
        <div class="pack-icon">
          <icon name="oil"/>
        </div>
        <div class="pack-info">
          <strong>{{$t('economic')}}</strong>
          <span v-html="$t('economic_info')"></span>
        </div>
      </div>
    </div>
    <div class="col-6 col-lg-3 mb-2 mb-lg-3">
      <div :class="['pack-item',{'active': selected.includes(3)}]" @click="selected = 3">
        <div class="pack-icon">
          <icon name="dashboard"/>
        </div>
        <div class="pack-info">
          <strong>{{$t('fast')}}</strong>
          <span v-html="$t('fast_info')"></span>
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
          if(this.value[key] != index) value.push(this.value[key]);
        if(this.value.indexOf(index) === -1) value.push(index);
        this.$emit('input', value);
      }
    }
  }
}
</script>