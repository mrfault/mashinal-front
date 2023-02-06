<template>
  <div class="moderator-car-brand">
    <div class="moderator-car-brand__image">
      <img v-if="isMoto" :src="'/images/moto-placeholder.jpg'" alt="o"/>
      <img v-else :src="brand.transformed_media ? brand.transformed_media : '/images/car-placeholder.png'" alt="o"/>
    </div>
    <h6 class="moderator-car-brand__title row">
      <div class="col-12 col-md-auto px-0">
        <span>{{ $t('name') }}: </span>
        <span v-if="userData && userData.name"><strong>{{ userData.name }}</strong></span>
        <span v-else-if="userData && userData.full_name"><strong>{{ userData.full_name }}</strong></span>
      </div>
      <div class="col-12 col-md-auto px-0">
        <template>
          /
        </template>
        <span v-if="isAutosalon && userData.autosalon">{{ $t('autosalon') }}: </span>
        <span v-if="isAutosalon && userData.autosalon"><strong>{{ userData.autosalon.name }}</strong></span>
      </div>
      <div class="col-12 col-md-auto px-0">
        <template v-if="isAutosalon ">
          /
        </template>
        <span v-if="isExternalSalon">{{ $t('external_salon') }}: </span>
        <span v-if="isExternalSalon"><strong>{{ userData.external_salon.name }}</strong></span>
      </div>
      <div class="col-12 col-md-auto px-0">
        <template v-if="isExternalSalon ">
          /
        </template>
        <span>{{ $t('mobile_phone_number') }}: </span>
        <strong v-if="userData && userData.phone">{{ userData.phone }}</strong>
      </div>
      <div class="col-12 col-md-auto px-0">
        <template v-if="userData && userData.email">
          /
          <span>{{ $t('email') }}:</span>
          <strong> {{ userData.email }}</strong>
        </template>
      </div>
      <div class="col-12 col-md-auto px-0">
        <template>
          /
        </template>
        <span>{{ $t('announcement_created_at') }}:</span>
        <strong>{{ formattedDate }}</strong>
      </div>
      <div class="col-12 col-md-auto px-0">
        <template v-if="smsRadarData && smsRadarData.ownerType">
          /
        </template>
        <span v-if="smsRadarData && smsRadarData.ownerType">{{ $t('owner_type') }}:</span>
        <strong v-if="smsRadarData && smsRadarData.ownerType">{{ smsRadarData.ownerType }}</strong>
      </div>
    </h6>
  </div>
</template>

<script>
export default {
  props: {
    brand: {
      type: Object,
      default() {
        return {

          transformed_media: '/images/car-placeholder.png',
          name: 'vehicle_id_mark',
        }
      },
    },
    smsRadarData: Object,
    createdAt: String,
    isAutosalon: Boolean,
    isExternalSalon: Boolean,
    userData: Object,
    isMoto: Boolean,
    changeLog: Object
  },
  computed: {
    formattedDate() {
      return this.$moment(this.createdAt).format(`DD.MM.YYYY  HH:mm`)
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
    font: 500 15px TTHoves;
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
