<template>
  <div class="attorney-list">
    <template v-if="attorneys.length">
      <div
        class="card mb-4 m-0"
        v-for="attorney in attorneys"
        :key="attorney.id"
      >
        <div class="attorney-list--heading">
          <icon  name="stamp" />
          <h2
            class="attorney-date"
            :class="{ 'title-with-line': !isMobileBreakpoint }"
          >
            <span>
              {{ $t('auth_date') }}: {{ attorney.formatted_created_at }}
            </span>
          </h2>
          <span class="attorney-checked" :class="getStatus(attorney.status)">
            <icon :name="['wall-clock', 'check', 'cross'][attorney.status]" />
            {{ $t(getStatus(attorney.status)) }}
            <span v-if="attorney.status === 2">
              : {{ attorney.formatted_expire_date }}
            </span>
          </span>
        </div>

        <!-- ---------------- -->
        <!-- ---------------- -->
        <!-- ---------------- -->
        <!-- ---------------- -->
        <div class="attorney__info">
          <div class="attorney__info--details">
            <p>{{ $t('car_number') }}</p>
            <p>{{ attorney.car_number }}</p>
          </div>
          <div class="attorney__info--details">
            <p>{{ $t('letter_type') }}</p>
            <p>{{ $t('letter_type_options')[attorney.type - 1] }}</p>
          </div>
          <div class="attorney__info--buttons d-flex justify-content-end">
            <button
              @click="cancelAttorney(attorney)"
              v-if="attorney.status === 1 "
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
    cancelAttorney(attorney) {
      this.$axios.$post('/attorney/cancel',{
        id: attorney.action_id
      })
    },
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
