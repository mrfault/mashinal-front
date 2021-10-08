<template>
  <div class="card m-0">
    <form @submit.prevent>
      <h2 class="title-with-line full-width">
        <span>{{ $t('contact_us') }}</span>
      </h2>

      <form-text-input
        :placeholder="$t('name') + ', ' + $t('surname')"
        class="mb-3"
      />
      <form-text-input
        :placeholder="$t('mobile_number')"
        class="mb-3"
      />

      <p>{{ $t('you_will_be_contacted_shortly') }}</p>
      <hr class="mt-2"/>
      
      <button class="btn btn--green full-width">
        {{ $t('apply') }}
      </button>
    </form>
  </div>
</template>

<script>
export default {

}
</script>
