<template>
  <div class="pages-catalog">
    <div class="container">
      <breadcrumbs :crumbs="crumbs">
        <share-it type="publish" v-if="$route.params.body" />
      </breadcrumbs>

      <div class="alco-form">
        <div class="form-items row">
          <div class="col-lg-4">
            <div
              class="alc-logo d-flex justify-content-center flex-column align-items-center"
            >
              <img src="/img/alco.svg" />
              <span class="alco-num">1</span>
            </div>
            <div class="alc-inputs">
              <h4 class="alco-h4 pl-1 pr-1">İçki miqdarı (1)</h4>
              <div class="d-flex">
                <form-select class="col-6" :label="$t('type')" :options="[]" />
                <form-select class="col-6" :label="$t('type')" :options="[]" />
              </div>
              <div class="mx-1 mt-3">
                <h4 class="alco-h4 pr-1">Cinsiniz</h4>
                <form-switch
                  class="interior-exterior-switcher"
                  auto-width
                  style="width: fit-content; pointer-events: all;"
                  v-model="showInterior"
                  :options="['Kişi', 'Qadın']"
                />
              </div>
            </div>
          </div>
          <div class="col-lg-4">
            <div
              class="alc-logo d-flex justify-content-center flex-column align-items-center"
            >
              <img src="/img/alco.svg" />
              <span class="alco-num">2</span>
            </div>
            <div class="alc-inputs">
              <h4 class="alco-h4 pl-1 pr-1">İçki miqdarı (2)</h4>
              <div class="d-flex">
                <form-select class="col-6" :label="$t('type')" :options="[]" />
                <form-select class="col-6" :label="$t('type')" :options="[]" />
              </div>
              <div class="mx-1 mt-3">
                <h4 class="alco-h4 pr-1">Çəkiniz</h4>
                <form-select :label="$t('type')" :options="[]" />
              </div>
            </div>
          </div>
          <div class="col-lg-4">
            <div
              class="alc-logo d-flex justify-content-center flex-column align-items-center"
            >
              <img src="/img/alco.svg" />
              <span class="alco-num">3</span>
            </div>
            <div class="alc-inputs">
              <h4 class="alco-h4 pl-1 pr-1">İçki miqdarı (3)</h4>
              <div class="d-flex">
                <form-select class="col-6" :label="$t('type')" :options="[]" />
                <form-select class="col-6" :label="$t('type')" :options="[]" />
              </div>
              <div class="mx-1 mt-3">
                <h4 class="alco-h4 pr-1">Neçə saat keçib?</h4>
                <form-select :label="$t('type')" :options="[]" />
              </div>
            </div>
          </div>
        </div>
        <div class="submit-button mt-3 d-flex justify-content-end mr-1 pb-2">
          <button class="btn btn--green">
            Nə zaman sükan arxasına keçə bilərəm?
          </button>
        </div>
      </div>

      <div class="alco-form my-4">
        <div class="row">
          <div class="col-12 col-lg-5">
            <div class="ma-alco-card__bottom">
              <h3 class="ma-alcometer-title-dotted">
                Alkotesterin göstəriciləri
              </h3>
              <div class="ma-alco-card__bottom--body">
                <alcometer-promil :promilValue="promilValue"></alcometer-promil>
                <h3 class="ma-alco-card__bottom--body--desc">
                  Alkoqol konsentrasiyası:
                </h3>
                <h3 class="ma-alco-card__bottom--body--value">
                  2.50
                </h3>
                <h3 class="ma-alco-card__bottom--body--desc">
                  çəkilmiş havanın litrinə düşən milliqram
                </h3>
              </div>
            </div>
          </div>
          <div class="col-12 col-lg-7">
            <div class="ma-alco-card__bottom">
              <h3 class="ma-alcometer-title-dotted">İntoksikasiya dərəcəsi</h3>
              <div class="ma-alco-card__bottom--body">
                <alcometer-speedometer :speedometerValue="speedometerValue"></alcometer-speedometer>
                <h3 class="ma-alco-card__bottom--body--desc">
                  Sürmək olar:
                </h3>
                <h3 class="ma-alco-card__bottom--body--value">
                  30
                </h3>
                <h3 class="ma-alco-card__bottom--body--desc">
                  saat sonra
                </h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AlcometerPromil from '~/components/alcometer/promil.vue'
import AlcometerSpeedometer from '~/components/alcometer/speedometer.vue'
export default {
  components: {
    AlcometerPromil,
    AlcometerSpeedometer
  },
  data() {
    return {
      showInterior: true,
      crumbs: [{ name: 'alcometer' }],
      promilValue: '5.00',
      speedometerValue: 30,
    }
  },
}
</script>

<style lang="scss">
.alco-num {
  margin-top: 25px;
  margin-bottom: 25px;
  color: white;
  width: 26px;
  height: 26px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 15px;
  font-weight: 500;
  border-radius: 50%;
  background: #f81734;
}
.alco-h4 {
  font-weight: 500;
  font-size: 14px;
  line-height: 17px;
  color: #081a3e;
}
.alc-logo {
  margin-top: 40px;
}
.alco-form {
  background-color: white;
  border-top: 1px solid #ecf2f9;
  padding-left: 15px;
  padding-right: 15px;
}

$ma-blue-1: #081a3e;

.ma-alcometer-title-dotted {
  padding: 0 20px;
  position: relative;
  color: $ma-blue-1;
  font: 500 24px Gilroy;
  display: inline;
  text-align: center;
  &::before,
  &::after {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 5px;
    height: 5px;
    border-radius: 50%;
    content: '';
    background: $ma-blue-1;
  }
  &::before {
    left: 0;
  }
  &::after {
    right: 0;
  }
}
.ma-alco-card__bottom {
  margin-top: 56px;
  display: flex;
  flex-direction: column;
  align-items: center;
  &--body {
    padding: 38px 0 52px 0;
    &--desc {
      font: 500 20px Gilroy;
      border-color: $ma-blue-1;
      text-align: center;
    }
    &--value {
      padding: 10px 10px 5px 10px;
      background: #ecf2f9;
      border-radius: 4px;
      text-align: center;
      font: 500 20px Gilroy;
      width: 220px;
      margin: 18px auto;
    }
  }
}
.ma-alcometer__graph {
  width: 100%;
  height: 250px;
  margin-bottom: 46px;
  svg {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
}
.ma-alcometer__promil--text {
  font: 500 20px Gilroy;
}
</style>
