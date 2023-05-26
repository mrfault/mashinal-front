<template>
  <div class="modal-like-container">
    <div class="state__block" @click.stop>
      <div class="d-flex justify-content-between">

        <p class="ma-modal-title">{{ modal__title }}</p>
        <span class="cursor-pointer close" @click.prevent="closePopup">
                  <icon name="cross"/>
                </span>
      </div>



        <search-checkbox :day="$t('vin_reject_1')"

                         class="overlay-checkbox__search"
                         item_key="vin_reject_1"
                         @select-checked="handleChange"
        />

       <search-checkbox :day="$t('vin_reject_2')"

                        class="overlay-checkbox__search"
                        item_key="vin_reject_2"
                        @select-checked="handleChange"
       />


      <button
        :class="['btn btn--green w-50',]"
        class="my-2"
        type="button"
        @click.prevent="savePhotoIssues"
      >
        {{ $t('save') }}
      </button>

    </div>
  </div>
</template>

<script>
import SearchCheckbox from './CheckboxComponent.vue'

export default {
  components: {
    SearchCheckbox
  },
  props: ['modal__title', 'default_data', 'type',],
  data() {
    return {
      data:
        {
           vin_reject_1: this.$t('vin_reject_1'),
           vin_reject_2: this.$t('vin_reject_2'),

        }
    }
  },
  methods: {
    savePhotoIssues(e) {

      this.$emit('save', {
        data: this.data,
      });
      this.$emit('close')
    },

    closePopup() {
      this.$emit('close')
    },

    handleChange(v) {

      let key = Object.keys(v)[0];
      this.data[key] = v[key];

    }
  },

}
</script>

<style lang="scss" scoped>

.ma-modal-title {
  font: 500 20px Gilroy !important;
}

.state {
  position: relative;

  &__block {
    border-radius: 6px;
    /*background-image: url("../static/images/bg__lol.png");*/
    background-color: #fff;
    box-shadow: 0 5px 40px rgba(0, 0, 0, 0.35);
    border: 1px solid rgba(0, 0, 0, 0);
    width: 340px;
    height: fit-content;
    background-position: center;
    background-size: cover;
    background-repeat: no-repeat;
    position: absolute;
    z-index: 50;
    top: 35%;
    padding: 20px;
    min-width: 550px;

    &__save {
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      width: 100%;
      height: 30px;
      cursor: pointer;
      border-radius: 2px;
      background-color: #b90026;
      margin-top: 17px;

      span {
        color: #ffffff;
        font-size: 12px;
        font-weight: 700;
        line-height: 18px;
        font-family: 'Gilroy';
      }
    }

    &__delete {
      color: #888888;
      cursor: pointer;
      font-size: 10px;
      font-weight: 400;
      margin-top: 10px;
      line-height: 18px;
      display: flex;
      justify-content: center;
      margin-bottom: 15px;
    }

    p {
      color: #243749;
      font-size: 14px;
      font-weight: 700;
      line-height: 18px;
      margin-bottom: 12px;
    }

    textarea {
      width: 100%;
      margin-top: 15px;
      height: 90px;
      border-radius: 2px;
      border: 1px solid #d7d7d7;
      background-image: linear-gradient(180deg, #ededed 0%, #e5e5e5 100%);
      color: #888888;
      font-size: 12px;
      font-weight: 400;
      font-family: 'Gilroy';
      line-height: 18px;
      padding: 10px;
    }

  }
}

.modal-like-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(#000, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 11;

  border-radius: 6px;

  span, p {
    font-family: Gilroy !important;
  }
}
</style>
