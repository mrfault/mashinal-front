<template>
  <div class="row mt-5">
    <section v-if="user.admin_group === 1" class="container px-1"> <!--supervisor-->
      <div class="row">
        <div class="col-12">
          <button v-if="rejectArray && rejectArray.length === 0"
                  :class="{'pending':button_loading, 'disabled': notValid}"
                  :disabled="notValid"
                  class="btn btn--green w-50"

                  @click.prevent="sendData(1)">{{ $t('confirm') }}
          </button>
          <button :class="{'pending':button_loading, 'disabled': notValid}" :disabled="notValid"
                  class="btn btn--red w-50 ml-1"

                  @click.prevent="sendData(0)">{{ $t('reject') }}
          </button>
          <button :class="{'pending':button_loading, 'disabled': notValid}" :disabled="notValid"
                  class="btn btn--pale-red w-50 ml-1"

                  @click.prevent="sendData(3)"
          >
            {{ $t('deactive_announce') }}
          </button>
          <button :disabled="notValid" class="btn btn--yellow w-50 ml-1" @click="handleBackList">
            {{ $t('back_to_list') }}
          </button>
          <button
            v-if="user.admin_group === 1 && single_announce.transferred"
            :disabled="showTransferComment"
            class="btn btn--green w-50"
            @click="showTransferComment = true"
          >
            {{ $t('Show comment') }}
          </button>

        </div>
        <div v-if="showTransferComment" class="col-6 mt-2">
          <textarea class="ma-input" v-html="single_announce.transferred.comment"/>
        </div>
      </div>
    </section>

    <section v-else-if="user.admin_group === 2" class="container"> <!--moderator-->
      <div class="row">
        <div v-if="moderator" class="col-6 col-lg-2">
            <span class="timer">
              {{ getTimer.data }}
            </span>
        </div>
        <div class="col-auto">
          <form-text-input v-if="getTimer.unix > 60*2" v-model="form.delay_comment"
                           :placeholder="$t('delay_comment')"
                           type="text"/>
        </div>

        <div class="col-auto">
            <span v-if="getTimer.unix < 60*2 || (getTimer.unix > 60*2 && form.delay_comment.length)">
              <button v-if="rejectArray && rejectArray.length === 0"
                      :class="{'pending':button_loading, 'disabled': notValid}"
                      :disabled="notValid"
                      class="btn btn--green w-50"

                      @click.prevent="sendData(1)">{{ $t('confirm') }}</button>

              <!-- sendData(0) -->
              <button v-if="rejectArray.length" :class="{'pending':button_loading, 'disabled': notValid}"
                      :disabled="notValid"
                      class="btn btn--red w-50 ml-5"


                      @click.prevent="transferToSupervisor(true)">{{ $t('reject') }}</button>
            </span>

          <button :class="{'pending':button_loading, 'disabled': notValid}" :disabled="notValid"
                  class="btn btn--green w-50"

                  @click.prevent="openTransferModal">{{ $t('comment_to_supervisor') }}
          </button>
        </div>
      </div>
    </section>

    <section v-else-if="user.admin_group === 3" class="container"> <!--call center-->
      <div class="row">
        <div class="col-12">
          <button :class="{'pending':button_loading, 'disabled': notValid}" :disabled="notValid"
                  class="btn btn--green w-50"

                  @click.prevent="sendData(2)">{{ $t('send_to_moderate') }}
          </button>

          <button :class="{'pending':button_loading, 'disabled': notValid}" :disabled="notValid"
                  class="btn btn--pale-red w-50 ml-1"

                  @click.prevent="sendData(3)"
          >
            {{ $t('deactive_announce') }}
          </button>

          <button :class="{'disabled': notValid}" :disabled="notValid" class="btn btn--yellow w-50 ml-1"
                  @click="handleBackList">
            {{ $t('back_to_list') }}
          </button>

          <button :disabled="notValid" class="btn btn--green w-50"
                  @click.prevent="openTransferModal">{{ $t('Transfer to Supervisor') }}
          </button>


        </div>

      </div>
    </section>
  </div>
</template>

<script>
import {mapGetters} from "vuex";
import moment from 'moment'

export default {
  props: {
    single_announce: Object,

    showTransferComment: false,
    rejectArray: Array,
    button_loading: Boolean,
    notValid: Boolean,
    announcement: Object,
    id: Number,
    type: {
      type: String,
      default: 'cars'
    },
    imageCount: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      form: this.$clone(this.announcement),
      getTimer: {
        data: '',
        unix: 0
      },
    }
  },
  computed: {
    ...mapGetters({
      moderator: 'moderator/moderator',
    }),
    originalVinLength() {
      if (this.announcement.vin) {
        return this.announcement.vin.replace(/[^a-zA-Z,0-9 ]/g, "").length
      } else return 0
    }
  },

  mounted() {
    if (this.id && (this.user.admin_group == 2)) {
      setInterval(() => {
        let timer = moment().diff(moment(this.moderator.created_at));
        var duration = moment.duration(timer);
        var days = duration.days(),
          hrs = duration.hours(),
          mins = duration.minutes(),
          secs = duration.seconds();

        if (hrs.toString().length === 1) hrs = '0' + hrs;
        if (mins.toString().length === 1) mins = '0' + mins;
        if (secs.toString().length === 1) secs = '0' + secs;
        let _return = '';

        if (days > 0) _return += days + 'd. ';

        _return += hrs + ':' + mins + ':' + secs;

        this.getTimer.data = _return;
        this.getTimer.unix = timer / 1000;
      }, 1000);
    }

  },
  methods: {
    sendData(status) {
      if (this.form.is_new && this.form.mileage > 500) {
        this.$toasted.show(this.$t('Əgər nəqliyyat vasitəsi yenidirsə yürüş xanası 500 dən çox olmamalıdır.'), {
          type: 'error',
        })
        this.$emit('handleLoading', false)
      } else if (((this.type == 'cars') || (this.type == 'commercial')) && (this.imageCount < 3)) {
        this.$toasted.show(this.$t('Şəkillər 3-dən az olmamalıdır.'), {
          type: 'error',
        })
        this.$emit('handleLoading', false)
      } else if (((this.type == 'moto') || (this.type == 'moto_atv') || (this.type == 'scooter')) && (this.imageCount < 2)) {
        this.$toasted.show(this.$t('Şəkillər 2-dən az olmamalıdır.'), {
          type: 'error',
        })
        this.$emit('handleLoading', false)
      } else if (((this.type == 'moto') || (this.type == 'moto_atv') || (this.type == 'scooter')) && (this.form.volume <= 0)) {
        this.$toasted.show(this.$t('Həcm boş olmamalıdır.'), {
          type: 'error',
        })
        this.$emit('handleLoading', false)
      } else if (((this.type == 'part')) && (this.imageCount < 1)) {
        this.$toasted.show(this.$t('Ən az 1 şəkil yüklənməlidir'), {
          type: 'error',
        })
        this.$emit('handleLoading', false)
      } else if ((this.type == 'cars') && (!this.form.car_number && !this.form.vin)) {
        this.$toasted.show(this.$t('Avtomobilin nömrəsi və ya VİN nömrə" boş ola bilməz.'), {
          type: 'error',
        })
        this.$emit('handleLoading', false)
      } else if ((this.type == 'cars') && (this.form.car_number != '') && !(/^[0-9]{2} - {1}[a-zA-Z]{2} - {1}[0-9]{3}$/.test(this.form.car_number))) {
        this.$toasted.show(this.$t('Qeydiyyat nişanının formatı standarta uyğun deyil'), {
          type: 'error',
        })
        this.$emit('handleLoading', false)
        // }
        //   else if (((this.type == 'moto') || (this.type == 'moto_atv') || (this.type == 'scooter')) && ((this.form.car_number != '') || !this.form.car_number || (this.form.car_number == null)) && !(/^[0-9]{2} - {1}[a-zA-Z]{1,2} - {1}[0-9]{3}$/.test(this.form.car_number) )) {
        //     this.$toasted.show(this.$t('Qeydiyyat nişanının formatı standarta uyğun deyil'), {
        //       type: 'error',
        //     })
        //     this.$emit('handleLoading', false)
      } else if (this.form.volume && ((this.form.volume == '') || !this.form.volume || (this.form.volume == 0))) {
        this.$toasted.show(this.$t('Həcm boş ola bilməz'), {
          type: 'error',
        })
        this.$emit('handleLoading', false)
      } else if ((this.type == 'cars') && !this.form.selectedColor.length) {
        this.$toasted.show(this.$t('Rəng boş ola bilməz'), {
          type: 'error',
        })
        this.$emit('handleLoading', false)
      } else if (((this.type == 'moto') || (this.type == 'moto_atv') || (this.type == 'scooter') || (this.type == 'commercial')) && !this.form.selectedColor) {
        this.$toasted.show(this.$t('Rəng boş ola bilməz'), {
          type: 'error',
        })
        this.$emit('handleLoading', false)
      } else if (!this.form.is_new && this.form.mileage == 0) {
        this.$toasted.show(this.$t('Nəqliyyat vasitəsi yeni deyilsə yürüş 500-dən çox olmalıdır.'), {
          type: 'error',
        })
        this.$emit('handleLoading', false)
      } else if ((this.type == 'cars') && this.form.customs_clearance && !this.form.vin.length) {
        this.$toasted.show(this.$t('Nəqliyyat vasitəsi gömrükdən keçməyibsə ban nömrəsini yazmaq mütləqdir'), {
          type: 'error',
        })
      } else if (((this.type == 'cars') || (this.type == 'commercial')) && (this.form.vin) && (this.originalVinLength !== 0) && this.originalVinLength < 17) {
        this.$toasted.show(this.$t('VIN nömrənin formatı düzgün deyil'), {
          type: 'error',
        })
      } else if ((this.type == 'part') && (!this.form.is_negotiable) && (this.form.price < 1)) {
        this.$toasted.show(this.$t('Minimal Qiymət 1 olmalıdır.'), {
          type: 'error',
        })
      } else if ((this.type !== 'part') && this.form.price == 0) {
        this.$toasted.show(this.$t('Minimal Qiymət 1 olmalıdır.'), {
          type: 'error',
        })
      } else {
        this.$emit('sendData', status)
      }
    },
    async handleBackList() {
      if (this.user.admin_group == 1) {
        if (this.type == 'cars') {
          await this.$axios.$post('/ticket/detach/' + this.single_announce.id + '/car')
          location.href = '/alvcp/resources/announcements';
        }
        if (this.type == 'moto') {
          await this.$axios.$post('/ticket/detach/' + this.single_announce.id + '/motorcycles')
          location.href = '/alvcp/resources/motorcycles';
        }
        if (this.type == 'commercial') {
          await this.$axios.$post('/ticket/detach/' + this.single_announce.id + '/commercials')
          location.href = '/alvcp/resources/commercials';
        }
        if (this.type == 'moto_atv') {
          await this.$axios.$post('/ticket/detach/' + this.single_announce.id + '/moto-atvs')
          location.href = '/alvcp/resources/moto-atvs';
        }
        if (this.type == 'part') {
          await this.$axios.$post('/ticket/detach/' + this.single_announce.id + '/parts')
          location.href = '/alvcp/resources/parts';
        }
        if (this.type == 'scooters') {
          await this.$axios.$post('/ticket/detach/' + this.single_announce.id + '/scooters')
          location.href = '/alvcp/resources/scooters';
        }

      } else {
        if (this.type == 'cars') {
          await this.$axios.$post('/ticket/detach/' + this.single_announce.id + '/car')
        }
        if (this.type == 'moto') {
          await this.$axios.$post('/ticket/detach/' + this.single_announce.id + '/motorcycles')
        }
        if (this.type == 'commercial') {
          await this.$axios.$post('/ticket/detach/' + this.single_announce.id + '/commercials')
        }
        if (this.type == 'moto_atv') {
          await this.$axios.$post('/ticket/detach/' + this.single_announce.id + '/moto-atvs')
        }
        if (this.type == 'part') {
          await this.$axios.$post('/ticket/detach/' + this.single_announce.id + '/parts')
        }
        if (this.type == 'scooters') {
          await this.$axios.$post('/ticket/detach/' + this.single_announce.id + '/scooters')
        }
        location.href = '/alvcp/resources/announce-moderators';
      }
    },
    openTransferModal() {
      this.$emit('openTransferModal', true)
    },
    transferToSupervisor(cs) {
      this.$emit('transferToSupervisor', cs)
    }
  },
  watch: {
    form: {
      deep: true,
      handler() {
        this.$emit("formChanged", this.form)
      },
    },
    announcement: {
      deep: true,
      handler() {
        this.form = this.announcement
      }
    }
  }
}
</script>

<style lang="scss" scoped>
section {
  position: relative;

  &.disable:before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 2;
  }
}

.timer {
  font-size: 18px;
  color: #fff;
  letter-spacing: 2px;
  background: #050a25;
  padding: 6px 10px 0 10px;
  display: inline-block;
  height: 34px;
  border-radius: 4px;
  width: 160px;
}

.old_value {
  position: relative;
  left: -16px;
  font-size: 14px;
}

.logs {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  text-align: center;
  background: rgba(0, 0, 0, 0.5);
  z-index: 9999;

  .log {
    background: #fff;
    display: inline-block;
    margin-top: 20px;
    max-height: 80%;
    overflow-y: auto;

    & > div {
      padding: 10px;
    }

    .title {
      position: relative;

      span {
        position: absolute;
        right: 0;
        top: 0;
        padding: 5px 10px;
        cursor: pointer;
        color: #b90026;
      }
    }

    .body {
      border-top: 1px solid rgba(0, 0, 0, 0.5);
      border-bottom: 1px solid rgba(0, 0, 0, 0.5);
      text-align: left;

      & > div {
        border-bottom: 1px dashed #000000;
        margin: 5px 0;
        padding: 5px 0;
      }
    }

    .foot {
      .closeBtn {
        display: inline-block;
        padding: 5px 22px;
        background: #b90026;
        color: #fff;
        cursor: pointer;
      }
    }
  }
}
</style>
