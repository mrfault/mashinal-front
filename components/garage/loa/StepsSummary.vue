<template>
  <div class="steps-summary">
    <div class="row">
      <div class="col-lg-6" v-for="(user, i) in users" :key="i">
        <div class="card-bordered">
          <div class="img">
            <img :src="user.img || `/img/user.${isDarkMode ? 'jpg' : 'svg'}`" alt="" />
          </div>
          <h4>{{ user.first_name || '-----' }}<br/>{{ user.last_name || '---' }}</h4>
          <p class="text-dark-blue-3">{{ $t('letter_' + (i === 0 ? 'sender' : 'recepient')) }}</p>
        </div>
      </div>
      <div class="col-lg-12">
        <div class="card-bordered">
          <div class="vehicle-specs">
            <ul>
              <li v-for="(value, key) in specs" :key="key">
                <span class="w-auto">{{ $t(key) }}</span>
                <span>{{ value }}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    
  </div>
</template>

<script>
export default {
  props: {
    car: {}
  },
  data() {
    return {
      users: [
        {},
        {}
      ]
    }
  },
  computed: {
    specs() {
      return {
        transport_mark: this.car.mark,
        transport_registered_number: this.car.car_number.replace(/([A-Z]{1,2})/, ' $1 ')
      }
    }
  }
}
</script>