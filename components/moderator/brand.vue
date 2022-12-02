<template>
  <div class="moderator-car-brand">
    <div class="moderator-car-brand__image">
      <img :src="brand.transformed_media ? brand.transformed_media : '/images/car-placeholder.png'" alt="o"/>
    </div>
    <h6 class="moderator-car-brand__title">
      <span>{{ $t('name') }}: </span>
      <span v-if="userData"><strong>{{ userData.name }}</strong></span>
      <template>
        /
      </template>
      <span>{{ $t('mobile_phone_number') }}: </span>
      <strong v-if="userData && userData.phone">{{ userData.phone }}</strong>
      <template>
        /
        <span>{{ $t('email') }}:</span>
        <strong v-if="userData && userData.email"> {{ userData.email }}</strong>
        <span v-else>{{ $t('not_set') }}</span>
      </template>
      <template>
        /
      </template>
      <span>{{ $t('announcement_created_at') }}:</span>
      <strong>{{ formattedDate }}</strong>
      <template v-if="smsRadarData && smsRadarData.ownerType">
        /
      </template>
      <span v-if="smsRadarData && smsRadarData.ownerType">{{ $t('owner_type') }}:</span>
      <strong v-if="smsRadarData && smsRadarData.ownerType">{{ smsRadarData.ownerType }}</strong>
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
    smsRadarData: Object,

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
  computed: {
    formattedDate() {
      return this.$moment(this.userData.created_at).add(3, 'hour').format(`DD.MM.YYYY  hh:mm`)
    }
  }
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
