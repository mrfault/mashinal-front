<template>
  <div class="pages-catalog">
    <div class="container">
      <breadcrumbs :crumbs="crumbs">
        <share-it type="publish" v-if="$route.params.body" />
      </breadcrumbs>

      <div class="alco-form">
        <div class="form-items row">
          <div class="col-lg-4">
              <div class="alc-logo d-flex justify-content-center flex-column align-items-center">
                <img src="/img/alco.svg"/>
                <span class="alco-num">1</span>
              </div>
              <div class="alc-inputs">
                <h4 class="alco-h4 pl-1 pr-1">İçki miqdarı (1)</h4>
                <div class="d-flex">
                  <form-select class="col-6" :label="$t('type')" :options="[]"/>
                  <form-select class="col-6" :label="$t('type')" :options="[]"/>
                </div>
                <div class="mx-1 mt-3">
                  <h4 class="alco-h4 pr-1">Cinsiniz</h4>
                  <form-switch :options="['Kişi','Qadın']"/>
                </div>
              </div>
          </div>
          <div class="col-lg-4">
            <div class="alc-logo d-flex justify-content-center flex-column align-items-center">
              <img src="/img/alco.svg"/>
              <span class="alco-num">2</span>
            </div>
            <div class="alc-inputs">
              <h4 class="alco-h4 pl-1 pr-1">İçki miqdarı (2)</h4>
              <div class="d-flex">
                <form-select class="col-6" :label="$t('type')" :options="[]"/>
                <form-select class="col-6" :label="$t('type')" :options="[]"/>
              </div>
              <div class="mx-1 mt-3">
                <h4 class="alco-h4 pr-1">Çəkiniz</h4>
                <form-select :label="$t('type')" :options="[]"/>
              </div>
            </div>
          </div>
          <div class="col-lg-4">
            <div class="alc-logo d-flex justify-content-center flex-column align-items-center">
              <img src="/img/alco.svg"/>
              <span class="alco-num">3</span>
            </div>
            <div class="alc-inputs">
              <h4 class="alco-h4 pl-1 pr-1">İçki miqdarı (3)</h4>
              <div class="d-flex">
                <form-select class="col-6" :label="$t('type')" :options="[]"/>
                <form-select class="col-6" :label="$t('type')" :options="[]"/>
              </div>
              <div class="mx-1 mt-3">
                <h4 class="alco-h4 pr-1">Neçə saat keçib?</h4>
                <form-select :label="$t('type')" :options="[]"/>
              </div>
            </div>
          </div>
        </div>
        <div class="submit-button mt-3 d-flex justify-content-end mr-1 pb-2">
          <button class="btn btn--green">Nə zaman sükan arxasına keçə bilərəm?</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      crumbs:[
        { name: 'alcometer'},
      ]
    }
  }
}
</script>


<style lang="scss">
.alco-num {
  margin-top:25px;
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
  background: #F81734;
}
.alco-h4 {
  font-weight: 500;
  font-size: 14px;
  line-height: 17px;
  color: #081A3E;
}
.alc-logo {
  margin-top: 40px;
}
.alco-form {
  background-color: white;
  border-top: 1px solid #ECF2F9;
  padding-left: 15px;
  padding-right: 15px;
}
</style>
