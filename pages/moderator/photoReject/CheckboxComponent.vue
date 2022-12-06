<template>
  <div>
    <div class="overlay-checkbox__search"
         @click="onChecked"
    >
      <div class="checkbox-search" :class="{checked : isChecked}"></div>
      <span>{{ day }}</span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    day: {
      type: String,
      default: ''
    },
    item_key:{},
    type:{
      default:'parent'
    },
    defaultChecked: {

      default:0,
    }
  },

  data() {
    return {
      isChecked: false
    }
  },
  mounted() {
    this.isChecked = this.defaultChecked;
  },
  created() {
    this.$nuxt.$on('reset_all_checkboxes',() => {
      this.isChecked = false;
    });
    this.$nuxt.$on('reset_all_childs',() => {
      if(this.type === 'child') {
        this.isChecked = false;
        this.$emit('select-checked', { [this.item_key]:this.isChecked });
      }
    });
  },
  methods: {
    onChecked() {
      this.isChecked = !this.isChecked;
      if(this.item_key === 'is_new')
        this.$nuxt.$emit('is_new_toggle',this.isChecked);

      this.$emit('select-checked', { [this.item_key]:this.isChecked });
    },
  }
}
</script>

<style scoped lang="scss">
.overlay-checkbox__search {
  display: flex;
  align-items: center;
  cursor: pointer;
  margin: 6px 0;
  height: 20px;
  span {
    margin-left: 10px;
    font-family: "Noto Sans";
    font-weight: 500;
    font-size: 14px !important;
    line-height: 18px;
    text-align: left;
    font-family: Gilroy;
    color: #243749 !important;
    &:hover{
      color: #1E5D98 !important;
    }
  }
  .checkbox-search.checked + span{
    color: #29A53E !important;
  }
}
.checkbox-search {
  width: 20px;
  height: 20px;
  border-radius: 2px;
  border: 1px solid #E6E8F2;
  background: #fff;
  display: flex;
  position: relative;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  padding: 9px;
  &:hover{
    color: #1E5D98;
    border: 1px solid #B8BED9;
  }
}

.checked {
  border: 1px solid #29A53E;
  &:hover{
    border: 1px solid #29A53E;
  }
}

.checked::before {
  transition: .2s;
  opacity: 1;
}

.checked::after{
  content: '';
  width: 14px;
  height: 14px;
  margin-left: 0;
  transition: .2s;
  opacity: 1;
  position: absolute;
  border-radius: 2px;
  background-color: #29A53E;
  background-image: url(/images/nike.svg);
  background-size: 8px;
  background-repeat: no-repeat;
  background-position: center;
}
</style>
