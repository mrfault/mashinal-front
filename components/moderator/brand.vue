<template>
  <div class="moderator-car-brand">
    <div class="moderator-car-brand__image">
      <img :src="brand.transformed_media ? brand.transformed_media : '/images/car-placeholder.png'" alt="o"/>
    </div>
    <h6 class="moderator-car-brand__title">
      <span v-if="userData">{{ userData.name }}</span>
      <template v-if="userData && userData.phone">
      /
      </template>
      <span v-if="userData && userData.phone">{{ userData.phone }}</span>
      <template v-if="userData && userData.email">
        /
      </template>
      <span v-if="userData && userData.email">{{ userData.email }}</span>
      <!--      /-->
      <!--      <span @click="showBrands">{{ $t(brand.name) }}</span>-->
      <!--      /-->
      <!--      <span @click="showModels">{{ $t(model.name) }}</span>-->
      <!--      /-->
      <!--      <span @click="showYears">{{ year }}</span>-->
    </h6>
  </div>
</template>

<script>
export default {
  props: {
    brand: {
      type: Object,
      default: {
        transformed_media: '/images/car-placeholder.png',
        name: 'vehicle_id_mark',
      },
    },

    // year: {
    //   type: Number,
    //   default: {
    //     name: 'year',
    //   },
    // },
    userData: Object,
  },
  methods: {
    showModels() {
      this.$emit('showModels', true)
    },
    showBrands() {
      this.$emit('showBrands', true)
    },
    showYears() {
      this.$emit('showYears', true)
    },
  },
}
</script>

<style lang="scss">
.moderator-car-brand {
  display: flex;
  align-items: center;
  padding-right: 20px;
  width: 100%;

  &__image {
    height: 34px;
    width: 34px;
    box-sizing: border-box;
    overflow: hidden;
    border-radius: 50%;
    border: 1px solid rgba(#081a3e, 0.3);
    margin-right: 20px;

    img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
  }

  &__title {
    width: calc(100% - 90px);
    font: 500 15px Gilroy;
    margin-bottom: 0;

    span {
      cursor: pointer;
    }
  }
}

.moderator-brand-cover {
  object-fit: cover !important;
}
</style>
