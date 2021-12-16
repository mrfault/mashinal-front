<template>
  <form class="form" @submit.prevent="submit" novalidate>
    <div class="row">
      <div class="col-lg-8">
        <div class="video-record_wrapper" >
          <video-record 
            :key="isMobileBreakpoint"
            @start="disabled = true, showText = true"
            @retake="disabled = true, showText = false"
            @finish="disabled = false, showText = false"
            @result="videoFile = $event"
          >
            <transition name="fade">
              <div class="running-text" v-if="showText && isMobileBreakpoint">
                <p>{{ stepReceivedData.runningText }}</p>
              </div>
            </transition>
          </video-record>
        </div>
      </div>
      <div class="col-lg-4" v-if="!isMobileBreakpoint">
        <h4 class="mt-0">{{ $t('video_recording') }}</h4>
        <div class="info-text full-width mb-3 mt-3"><icon name="alert-circle" /> 
          <span>{{ $t('video_recording_info_text') }}</span>
        </div>
        <transition name="fade">
          <div class="running-text" v-if="showText && !isMobileBreakpoint">
            <p>{{ stepReceivedData.runningText }}</p>
          </div>
        </transition>
      </div>
    </div>
    <hr class="mb-2 mb-lg-3" />
    <div class="row justify-content-end pb-2 pb-lg-0">
      <div class="col-12 col-lg-1-5">
        <button type="submit" :class="['btn btn--green full-width', { pending, 'disabled': disabled }]">
          {{ $t('confirm') }}
        </button>
      </div>
    </div>
    <modal-popup 
      :toggle="showModal" 
      :title="`<i class='icon-alert-circle mr-6' aria-hidden='true'></i> ` + $t('attention')"
      @close="showModal = false"
      v-if="isMobileBreakpoint"
    >
      <p>
        <span>{{ $t('video_recording_info_text') }}</span>
      </p>
    </modal-popup>
  </form>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

const VideoRecord = () => import('~/components/garage/loa/VideoRecord');

export default {
  components: {
    VideoRecord
  },
  data() {
    return {
      pending: false,
      disabled: true,
      showModal: true,
      showText: false
    }
  },
  computed: {
    ...mapGetters('letterOfAttorney', ['stepSendData', 'stepReceivedData']),

    videoFile: {
      get() { 
        return this.stepSendData.videoFile
      },
      set(value) { 
        this.updateSendData({ key: 'videoFile', value });
      }
    },
  },
  created() {
    this.updateReceivedData([
      { key: 'runningText', value: `Lorem Ipsum is simply dummy text of the printing and typesetting industry.
        Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown
        printer took a galley of type and scrambled it to make a type specimen book. It has survived not
        only five centuries, but also the leap into electronic typesetting, remaining essentially
        unchanged. It was popularised in the 1960s with the release of Letraset sheets containing
        Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker
        including versions of Lorem Ipsum.` 
      }
    ]);
  },
  methods: {
    ...mapActions('letterOfAttorney', ['updateSendData', 'updateReceivedData']),
    
    updateData() {

    },
    submit() {
      if (this.pending) return;
      this.pending = true;
      try {
        this.pending = false;
        this.updateData();
        window.open(URL.createObjectURL(this.videoFile));
        // this.$emit('confirm');
      } catch (err) {
        this.pending = false;
      }
    }
  }
}
</script>