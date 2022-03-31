<template>
  <div class="video-record">
    <div class="video-record_inner">
      <div class="video-record_player">
        <video ref="video" playsinline class="video-js vjs-default-skin"></video>
        <div class="video-record_square"></div>
      </div>
      <div class="video-record_overlay">
        <slot />
        <div class="video-record_controls">
          <button type="button" class="video-record_control" @click="toggleRecording">
            <span :class="recording ? 'stop' : 'rec'"></span>
          </button>
          <span class="video-record_control">
            <span class="time">{{ timer }}<template v-if="!isMobileBreakpoint">{{ ' / 1:00' }}</template></span>
          </span>
          <button type="button" class="video-record_control" @click="retakeVideo">
            <icon name="reset"></icon>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import 'video.js/dist/video-js.css';
import 'videojs-record/dist/css/videojs.record.css';
import videojs from 'video.js';
import 'webrtc-adapter';
import RecordRTC from 'recordrtc';
import Record from 'videojs-record/dist/videojs.record.js';
import FFmpegjsEngine from 'videojs-record/dist/plugins/videojs.record.ffmpegjs.js';

export default {
  data() {
    return {
      player: '',
      timer: '0:00',
      starting: false,
      recording: false,
      started: false,
      blob: '',
      ready: false
    }
  },
  mounted() {
    if (!window.FFmpegjsEngine) window.FFmpegjsEngine = FFmpegjsEngine;
    if (!window.Record) window.Record = Record;
    if (!window.RecordRTC) window.RecordRTC = RecordRTC;
    // define player size
    let size = this.isMobileBreakpoint 
      ? ((this.isMobileDevice && this.isPortraitOrientation) ? [600,441] : [441,600]) 
      : [1150,600];
    // init player
    this.player = videojs(this.$refs.video, {
      controls: false,
      bigPlayButton: false,
      controlBar: {
        deviceButton: false,
        recordToggle: false,
        pipToggle: false
      },
      fill: true,
      width: size[0],
      height: size[1],
      plugins: {
        record: {
          pip: false,
          audio: true,
          video: {
            width: { min: size[0], ideal: size[0], max: size[0] },
            height: { min: size[1], ideal: size[1], max: size[1] }
          },
          maxLength: 60,
          debug: this.$env.DEV,
          frameWidth: size[0],
          frameHeight: size[1]
        }
      }
    });
    // handle errors
    this.player.on('deviceReady', () => {
      if (this.ready) {
        this.player.record().start();
      } else {
        this.ready = true;
      }
    });
    this.player.on('deviceError', () => {
      this.$toasted.error('Device error:', this.player.deviceErrorCode);
    });
    this.player.on('error', (element, error) => {
      console.error(error);
      this.$toasted.error(error);
    });
    // start / finish video recording
    this.player.on('startRecord', () => {
      this.starting = false;
      this.started = true;
      this.recording = true;
      this.$emit('start');
    });
    this.player.on('progressRecord', () => {
      if (!this.recording) return;
      let time = parseInt(this.player.record().getCurrentTime());
      let min = Math.floor(time / 60), sec = time % 60;
      this.timer = `${min}:${sec < 10 ? '0'+sec : sec}`;
    });
    this.player.on('finishRecord', () => {
      this.recording = false;
      this.player.record().stopDevice();
      if (!this.started) return;
      this.blob = this.player.recordedData;
      this.$emit('result', this.blob);
      this.$emit('finish');
    });
    this.player.record().getDevice();
  },
  methods: {
    toggleRecording() {
      if (this.starting || (this.started && !this.recording)) return;
      this[`${this.recording ? 'stop' : 'start'}Recording`]();
    },
    startRecording() {
      
      this.starting = true;
      this.player.record().getDevice();
    },
    stopRecording() {
      this.player.record().stopDevice();
    },
    retakeVideo() {
      if (this.starting) return;
      this.started = false;
      this.timer = '0:00';
      this.stopRecording();
      this.startRecording();
      this.$emit('retake');
    }
  },
  beforeDestroy() {
    this.player?.dispose();
  }
}
</script>