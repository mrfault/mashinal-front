<template>
  <div class="damage-options">
    <div class="d-flex flex-column flex-lg-row">
      <div class="car-damage-img">
        <inline-svg src="/img/car-damage.svg" :class="beatenParts" />
        <div :class="['car-part', 'car-part_'+part.id]" v-for="(part, index) in carParts" :key="index">
          <span @click="showStateModal(index)" :class="['car-part_point', {selected: state.hasOwnProperty(index)}]"></span>
        </div>
      </div>
      <div class="car-damage-text" v-if="getPartsData()">
        <div v-for="(part, index) in state" :key="index"> 
          <h4>{{ state[index].name }}</h4>
          <p>
            {{ getPartsData(index).map(key => $t(key)).join(', ') }}
            <em v-if="getPartsData(index, 'comment')[0]"> - {{ state[index].form[getPartsData(index, 'comment')[0]] }}</em>
          </p>
        </div>
      </div>
    </div>
    <modal-popup 
      :toggle="!!active.name" 
      :title="active.name"
      @close="active = false"
    >
      <div class="form">
        <div class="row">
          <div class="col-6 mb-2 mb-3" v-for="(name, index) in Object.keys(emptyForm).reverse()" :key="index">
            <form-checkbox :label="$t(name)" v-model="form[name]" :input-name="name" />
          </div>
          <div class="col-12">
            <button class="btn btn--green full-width" @click="addToState(active.index)">
              {{ $t('save') }}
            </button>
          </div>
          <!-- <div class="col-6">
            <button class="btn btn--red full-width" @click="removeFromState(active.index)">
              {{ $t('delete') }}
            </button>
          </div> -->
        </div>
      </div>
    </modal-popup>
  </div>
</template>

<script>
export default {
  props: ['selected'],
  data() {
    return {
      active: false,
      state: {},
      form: {},
      emptyForm: {
        metal: false,
        painted: false,
        dent: false,
        scratch: false
      },
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
      this.$emit('update-car-damage-part', index);
      this.active = {...this.carParts[index], index: index };
    },
    selectDamage() {
      this.active = false;
      let parts = {};
      for(let i in this.state)
        parts[i] = this.state[i].form;
      this.$emit('update-car-damage', parts);
    },
    removeFromState(index){
      this.$delete(this.state, index);
      this.selectDamage();
      this.active = false;
    },
    addToState(index) {
      if(Object.keys(this.form).filter(key => this.form[key]).length) {
        this.active.form = { ...this.form };
        this.$set(this.state, index, { ...this.active });
        this.selectDamage();
      } else {
        this.removeFromState(index);
      }
    },
    getPartsData(index = -1, get_comment) {
      if(index < 0) return Object.keys(this.state).length;
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
  mounted() {
    if(this.selected !== undefined) {
      for(let i in this.selected)
        this.$set(this.state, i, {...this.carParts[i], index: parseInt(i), form: this.selected[i]});
    }
    this.$nuxt.$on('update-car-damage-part', (form) => {
      this.form = { ...this.emptyForm, ...form }
    });
  },
  beforeDestroy() {
    this.$nuxt.$off('update-car-damage-part');
  }
}
</script>