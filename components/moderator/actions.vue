<template>
  <div class="row mt-5">
    <section v-if="user.admin_group === 1" class="container"> <!--supervisor-->
      <div class="row">
        <div class="col-12">
          <button v-if="rejectArray && rejectArray.length === 0"
                  :class="{'button_loading':button_loading, 'disabled': notValid}"
                  :disabled="notValid"
                  class="btn btn--green w-50"

                  @click.prevent="sendData(1)">{{ $t('confirm') }}
          </button>
          <button :class="{'button_loading':button_loading, 'disabled': notValid}" :disabled="notValid"
                  class="btn btn--red w-50 ml-1"

                  @click.prevent="sendData(0)">{{ $t('reject') }}
          </button>
          <button :class="{'button_loading':button_loading, 'disabled': notValid}" :disabled="notValid"
                  class="btn btn--pale-red w-50 ml-1"

                  @click.prevent="sendData(3)"
          >
            {{ $t('deactive_announce') }}
          </button>
          <button :disabled="notValid" class="btn btn--yellow w-50 ml-1" @click="handleBackToList">
            {{ $t('back_to_list') }}
          </button>
        </div>
      </div>
    </section>
    <section v-else-if="user.admin_group === 2" class="container"> <!--moderator-->
      <div class="row">
        <div class="col-6 col-lg-2">
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
                      :class="{'button_loading':button_loading, 'disabled': notValid}"
                      :disabled="notValid"
                      class="btn btn--green w-50"

                      @click.prevent="sendData(1)">{{ $t('confirm') }}</button>

              <!-- sendData(0) -->
              <button v-else :class="{'button_loading':button_loading, 'disabled': notValid}" :disabled="notValid"
                      class="btn btn--red w-50 ml-5"


                      @click.prevent="transferToSupervisor(true)">{{ $t('reject') }}</button>
            </span>

          <button :class="{'button_loading':button_loading, 'disabled': notValid}" :disabled="notValid"
                  class="btn btn--green w-50"

                  @click.prevent="transferModal = true">{{ $t('comment_to_supervisor') }}
          </button>
        </div>
      </div>
    </section>
    <section v-else-if="user.admin_group === 3" class="container"> <!--call center-->
      <div class="row">
        <div class="col-12">
          <button :class="{'button_loading':button_loading, 'disabled': notValid}" :disabled="notValid"
                  class="btn btn--green w-50"

                  @click.prevent="sendData(2)">{{ $t('send_to_moderate') }}
          </button>

          <button :class="{'button_loading':button_loading, 'disabled': notValid}" :disabled="notValid"
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
export default {
  props: {
    rejectArray: Array,
    button_loading: Boolean,
    notValid: Boolean,
    getTimer: Object,
    announcement: Object,
    id: Number,
    type: {
      type: String,
      default: 'cars'
    },
  },
  data() {
    return {
      form: this.$clone(this.announcement),
    }
  },
  methods: {
    sendData(status) {
      if (this.form.is_new && this.form.mileage > 500) {
        this.$toasted.show(this.$t('Yürüş xanası 500 dən çox olmamalıdır.'), {
          type: 'error',
        })
        this.$emit('handleLoading', false)
      } else if (!this.form.is_new && this.form.mileage == 0) {
        this.$toasted.show(this.$t('Nəqliyyat vasitəsi yeni deyilsə yürüş 500-dən çox olmalıdır.'), {
          type: 'error',
        })
        this.$emit('handleLoading', false)
      } else if ((this.type == 'cars') && this.form.customs_clearance && !this.form.vin) {
        this.$toasted.show(this.$t('Nəqliyyat vasitəsi gömrükdən keçməyibsə ban nömrəsini yazmaq mütləqdir'), {
          type: 'error',
        })
      }else if(this.form.price == 0) {
        this.$toasted.show(this.$t('Minimal Qiymət 1 olmalıdır.'), {
          type: 'error',
        })
      }

        else {
        this.$emit('sendData', status)
      }
    },
    handleBackList() {
      if (this.user.admin_group == 2) {
        location.href = '/alvcp/resources/announcements';
      } else {
        location.href = '/alvcp/resources/announcements';
      }
    },
    async handleBackToList() {
      await this.$axios.$post('/ticket/detach/' + this.id + '/car')
      return location.href = '/alvcp/resources/announcements';
    },
    openTransferModal() {
      this.$emit('openTransferModal', true)
    }
  },
  watch: {
    form: {
      deep: true,
      handler() {
        this.$emit("formChanged", this.form)
      },
    },
  }
}
</script>
