<template>
  <div class="modal-like-container">
    <div class="state__block" @click.stop>
      <div class="d-flex justify-content-between">

        <p class="ma-modal-title">{{ modal__title }}</p>
        <span class="cursor-pointer close" @click.prevent="closePopup">
                  <icon name="cross"/>
                </span>
      </div>

      <div v-if="type=='part'" class="">
        <search-checkbox :day="$t('part_photo_reject_1')"
                         class="overlay-checkbox__search"
                         item_key="part_photo_reject_1"
                         @select-checked="handleChange"

        />
        <search-checkbox :day="$t('part_photo_reject_2')"
                         class="overlay-checkbox__search"
                         item_key="part_photo_reject_2"
                         @select-checked="handleChange"

        />
        <search-checkbox :day="$t('part_photo_reject_3')"
                         class="overlay-checkbox__search"
                         item_key="part_photo_reject_3"
                         @select-checked="handleChange"

        />
        <search-checkbox :day="$t('part_photo_reject_4')"
                         class="overlay-checkbox__search"
                         item_key="part_photo_reject_4"
                         @select-checked="handleChange"

        />

      </div>
      <div v-else-if="type=='360'" class="">
        <search-checkbox :day="$t('360_reject_1')"
                         :default-checked="data['360_photo_reject_1']"
                         class="overlay-checkbox__search"
                         item_key="360_photo_reject_1"
                         @select-checked="handleChange"

        />


      </div>
      <div v-else>
        <search-checkbox :day="$t('front_error')"
                         :default-checked="data.front_error"
                         class="overlay-checkbox__search"
                         item_key="front_error"
                         @select-checked="handleChange"
        />
        <search-checkbox :day="$t('back_error')"
                         :default-checked="data.back_error"
                         class="overlay-checkbox__search"
                         item_key="back_error"
                         @select-checked="handleChange"
        />
        <search-checkbox :day="$t('left_error')"
                         :default-checked="data.left_error"
                         class="overlay-checkbox__search"
                         item_key="left_error"
                         @select-checked="handleChange"

        />
        <search-checkbox :day="$t('right_error')"
                         :default-checked="data.right_error"
                         class="overlay-checkbox__search"
                         item_key="right_error"
                         @select-checked="handleChange"
        />


        <search-checkbox :day="$t('interior_error')"
                         :default-checked="data.interior_error"
                         class="overlay-checkbox__search"
                         item_key="interior_error"
                         @select-checked="handleChange"
        />
        <search-checkbox :day="$t('not_this_car_error')"
                         :default-checked="data.not_this_car_error"
                         class="overlay-checkbox__search"
                         item_key="not_this_car_error"
                         @select-checked="handleChange"
        />
      </div>


      <button
        :class="[
                        'btn btn--green w-50',
                      ]"
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
  props: ['modal__title', 'default_data', 'type'],
  data() {
    return {
      data:
        {
          part_photo_reject_1: this.default_data.includes('part_photo_reject_1'),
          front_error: this.default_data.includes('front_error'),
          back_error: this.default_data.includes('back_error'),
          left_error: this.default_data.includes('left_error'),
          right_error: this.default_data.includes('right_error'),
          interior_error: this.default_data.includes('interior_error'),
          not_this_car_error: this.default_data.includes('not_this_car_error'),
          '360_photo_reject_1': this.default_data.includes('360_photo_reject_1'),
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
  }
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
    top: 60px;
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
