<template>
  <div class="attorney-list">
    <div class="card mb-4 m-0" v-for="attorney in attorneys" :key="attorney.id">
      <div class="d-flex">
        <h2 class="attorney-date" :class="{'title-with-line': !isMobileBreakpoint}">
          <span>Qeydiyyat tarixi: {{ attorney.formatted_created_at }}</span>
        </h2>
        <span class="attorney-checked" :class="getStatus(attorney.status)">
          <icon :name="attorney.status === 1 ? 'check' :'cross' "/>
          {{ $t(getStatus(attorney.status)) }}
        </span>
      </div>
      <div class="attorney-info-wrapper">
        <div class="attorney-info">
          <span class="model-title">Marka/model</span>
          <span>CUPRA Formentor VZ5</span>
        </div>
        <div class="attorney-info">
          <span class="model-title">Etibarnamənin növü</span>
          <span>Nəqliyyat vasitəsinə sərəncam verilməsinə dair etibarnamə</span>
        </div>
        <div>
          <button class="btn btn--red-outline mr-1">{{ $t('disable_attorney') }}</button>
          <button @click.prevent="getPdf(attorney.id)" class="btn btn--dark-blue">{{ $t('download') }}</button>
        </div>
      </div>
<!--      <div  class="d-flex justify-content-between">-->
<!--        <button class="btn btn&#45;&#45;red-outline">{{ $t('disable_attorney') }}</button>-->
<!--        <a href="#" @click.prevent="getPdf(attorney.id)"  class="attorney-more">-->
<!--          {{ $t('detail') }}  <icon name="arrow-right"/>-->
<!--        </a>-->
<!--      </div>-->
    </div>
  </div>
</template>

<script>
import download from 'downloadjs'
export default {
  props: {
    attorneys: {}
  },
  methods: {
    getStatus(status) {
      return [
        'pending',
        'approved',
        'rejected'
      ][status]
    },
    async getPdf(id) {
      try {
        const data = await this.$axios.$get(`https://dev.mashin.al/api/attorney/get_pdf/${id}`,{
          responseType: 'blob'
        })
        download(data,'etibarname-'+id+'.pdf','application/pdf')
      }catch (e) {
        this.$toasted.error('xəta baş verdi')
      }

    }
  }
}
</script>

<style lang="scss">
.attorney-list {
  .model-title {
    color: #646E95;
    font-size: 14px;
  }
  .attorney-info {
    display: flex;
    flex-direction: column;
  }
  .attorney-info-wrapper {
    display: flex;
    justify-content: space-between;
  }
  @media (max-width: 1025px) {
    .attorney-info {
      margin-bottom: 10px;
    }
    .attorney-info-wrapper {
      display: block;
    }
  }
  .card {
    display: flex;
    flex-direction: column;
  }

  .attorney-date {
    width: 100%;
  }

  .attorney-more {
    color: #246EB2;
    font-size: 14px;
    i {
      margin-left: 5px;
      font-size: 10px;
    }
  }
  .attorney-checked {
    font-size: 14px;
    white-space: nowrap;
    padding-left: 23px;
    &.approved {
      color: #29A53E;
    }
    &.rejected {
      color: red
    }
    i {
      margin-right: 5px;
      font-size: 10px;
    }
  }
}
</style>
