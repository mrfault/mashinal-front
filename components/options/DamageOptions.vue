<template>
  <div class="damage-options">
    <h2 class="title-with-line mt-2 mt-lg-3" v-if="readOnly">
      <span>{{ $t('body_condition') }}</span>
    </h2>
    <div class="d-flex flex-column flex-lg-row align-items-start">
      <div class="car-damage-img" v-if="imageIsActive">
        <inline-svg src="/img/car-damage.svg" :class="beatenParts" />
        <div :class="['car-part', 'car-part_'+part.id]" v-for="(part, index) in carParts" :key="index">
          <span @click="showStateModal(index)" :class="['car-part_point', {selected: state.hasOwnProperty(index), 'read-only': readOnly}]"></span>
        </div>
      </div>
      <div class="car-damage-text" v-if="getPartsData()">
        <div v-for="(part, index) in state" :key="index"> 
          <h4>{{ state[index].name }}</h4>
          <p>
            {{ getPartsData(index).map(key => $t(key)).join(', ') }}
            <em v-if="getPartsData(index, 'comment')[0]"> — {{ state[index].form[getPartsData(index, 'comment')[0]] }}</em>
          </p>
        </div>
      </div>
    </div>
    <modal-popup 
      :toggle="!!active.name" 
      :title="active.name"
      @close="active = false"
    >
      <div class="form" v-if="forms[active.index]">
        <div class="row">
          <div class="col-6 mb-2 mb-lg-3" v-for="(name, index) in Object.keys(forms[active.index]).reverse()" :key="index">
            <form-checkbox :label="$t(name)" v-model="forms[active.index][name]" :input-name="name" />
          </div>
          <div class="col-12">
            <button class="btn btn--green full-width" @click="addToState(active.index)">
              {{ $t('save') }}
            </button>
          </div>
        </div>
      </div>
    </modal-popup>
  </div>
</template>

<script>
export default {
  props: {
    selected: {
      default: () => ({})
    },
    readOnly: Boolean,
    imageIsActive: Boolean
  },
  data() {
    let f = i => ({
      metal: this.selected?.[i]?.metal || false,
      painted: this.selected?.[i]?.painted || false,
      dent: this.selected?.[i]?.dent || false,
      scratch: this.selected?.[i]?.scratch || false
    });
    return {
      active: false,
      state: {},
      forms: [f(0), f(1), f(2), f(3), f(4), f(5), f(6)],
      carParts: [
        { name: this.$t('part_front_bumper'), id:'front' },
        { name: this.$t('part_front_left_door'), id:'left-door-front' },
        { name: this.$t('part_rear_left_door'), id:'left-door-rear' },
        { name: this.$t('part_front_right_door'), id:'right-door-front' },
        { name: this.$t('part_rear_right_door'), id:'right-door-rear' },
        { name: this.$t('part_roof'), id:'roof' },
        { name: this.$t('part_rear_bumper'), id:'rear' }
      ]
    }
  },
  methods: {
    showStateModal(index) {
      if (this.readOnly) return;
      this.active = {...this.carParts[index], index: index };
    },
    selectDamage() {
      if (this.readOnly) return;
      this.active = false;
      let parts = {};
      for(let i in this.state)
        parts[i] = this.state[i].form;
      this.$emit('update-car-damage', parts);
    },
    removeFromState(index){
      if (this.readOnly) return;
      this.$delete(this.state, index);
      this.selectDamage();
      this.active = false;
    },
    addToState(index) {
      if (this.readOnly) return;
      let form = {...this.forms[this.active.index]};
      if (Object.keys(form).filter(key => form[key]).length) {
        this.active.form = form;
        this.$set(this.state, index, { ...this.active });
        this.selectDamage();
      } else {
        this.removeFromState(index);
      }
    },
    getPartsData(index = -1, get_comment) {
      if (index < 0) return Object.keys(this.state).length;
      return Object.keys(this.state[index].form).filter(key => (
        this.state[index].form[key] && (get_comment ? key === 'comment' : key !== 'comment')
      )).reverse();
    }
  },
  computed: {
    beatenParts() {
      let parts = this.carParts
        .filter((part, index) => this.state.hasOwnProperty(index))
        .map(part => part.id)
      return [...new Set(parts)];
    }
  },
  created() {
    for(let i in this.selected)
      this.$set(this.state, i, {...this.carParts[i], index: parseInt(i), form: this.selected[i]});
  }
}
</script>