<template>
  <div class="card m-0">
    <form @submit.prevent>
      <h2 class="title-with-line full-width">
        <span>{{ $t('get_a_business_profile') }}</span>
      </h2>

      <form-text-input
        :placeholder="$t('name') + ', ' + $t('surname')"
        class="mb-3"
      />
      <form-text-input
        :placeholder="$t('mobile_number')"
        class="mb-3"
      />

      <p>{{ $t('you_will_have_to_pay_100_to_get_a_business_profile') }}</p>
      <hr class="mt-2"/>
      
      <button class="btn btn--green full-width">
        {{ $t('pay') }}
      </button>
    </form>
  </div>
</template>

<script>
export default {

}
</script>
