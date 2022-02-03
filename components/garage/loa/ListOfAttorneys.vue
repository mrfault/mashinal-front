<template>
  <div class="attorney-list">
    <template v-if="attorneys.length">
      <div
        class="card mb-4 m-0"
        v-for="attorney in attorneys"
        :key="attorney.id"
      >
        <div class="d-flex">
          <h2><icon class="mr-2" name="stamp" /></h2>
          <h2
            class="attorney-date"
            :class="{ 'title-with-line': !isMobileBreakpoint }"
          >
            <span>{{ $t('auth_date') }}: {{ attorney.formatted_created_at }}</span>
          </h2>
          <span class="attorney-checked" :class="getStatus(attorney.status)">
            <icon :name="['wall-clock', 'check', 'cross'][attorney.status]" />
            {{ $t(getStatus(attorney.status)) }}
            <span v-if="attorney.status === 2">
              : {{ attorney.formatted_expire_date }}
            </span>
          </span>
        </div>
        <div class="attorney-info-wrapper">
          <div class="attorney-info" style="flex-grow: 1">
            <span class="model-title">{{ $t('car_number') }}</span>
            <span>{{ attorney.car_number }}</span>
          </div>
          <div class="attorney-info" style="flex-grow: 2">
            <span class="model-title">{{ $t('letter_type') }}</span>
            <span>{{ $t('letter_type_options')[attorney.type - 1] }}</span>
          </div>
          <div style="flex-grow: 1;text-align: right">
            <button
              v-if="attorney.status === 1"
              class="btn btn--red-outline mr-1"
            >
              {{ $t('disable_attorney') }}
            </button>
            <button
              @click.prevent="getPdf(attorney.id)"
              class="btn btn--dark-blue"
            >
              <icon name="download" />
              {{ $t('download') }}
            </button>
          </div>
        </div>
        <!--      <div  class="d-flex justify-content-between">-->
        <!--        <button class="btn btn&#45;&#45;red-outline">{{ $t('disable_attorney') }}</button>-->
        <!--        <a href="#" @click.prevent="getPdf(attorney.id)"  class="attorney-more">-->
        <!--          {{ $t('detail') }}  <icon name="arrow-right"/>-->
        <!--        </a>-->
        <!--      </div>-->
      </div>
    </template>
    <template v-else>
      <attorney-empty></attorney-empty>
    </template>
  </div>
</template>

<script>
import download from 'downloadjs'
import templates from '~/pages/profile/templates.vue'
import AttorneyEmpty from '~/components/garage/AttorneyEmpty.vue'
export default {
  components: { templates, AttorneyEmpty },
  props: {
    attorneys: {},
  },
  methods: {
    getStatus(status) {
      return ['pending', 'approved', 'rejected_attorney'][status]
    },
    async getPdf(id) {
      try {
        const data = await this.$axios.$get(
          `https://dev.mashin.al/api/attorney/get_pdf/${id}`,
          {
            responseType: 'blob',
          },
        )
        download(data, 'etibarname-' + id + '.pdf', 'application/pdf')
      } catch (e) {
        this.$toasted.error(this.$t('garage_error_3504'))
      }
    },
  },
}
</script>

<style lang="scss">
.attorney-list {
  .model-title {
    color: #646e95;
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
    color: #246eb2;
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
      color: #29a53e;
    }
    &.rejected_attorney {
      color: #f81734;
    }
    &.pending {
      color: #646e95;
    }
    i {
      margin-right: 5px;
      font-size: 14px;
    }
  }
}
</style>
