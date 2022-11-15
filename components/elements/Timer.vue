<template>
  <strong>{{ (timer || showBeforeStart) && formatTime }}</strong>
</template>

<script>
  export default {
    props: {
      duration: {
        type: Number,
        default: 60*60*24
      },
      saveAs: String,
      autoReset: {
        type: Boolean,
        default: true
      },
      format: {
        type: String,
        default: 'H:i:s'
      },
      showBeforeStart: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        timer: null,
        totalTime: this.duration,
        saveAfter: 3
      }
    },
    methods: {
      startTimer() {
        this.saveTime(true);
        this.timer = setInterval(() => this.countdown(), 1000);
      },
      stopTimer() {
        clearInterval(this.timer);
        this.timer = null;
      },
      resetTimer() {
        this.saveTime(true);
        this.totalTime = this.duration;
      },
      padTime(time) {
        return (time < 10 ? '0' : '') + time;
      },
      mcountdown() {
        if (this.totalTime > 0){
          this.totalTime--;
          this.saveTime();
        } else {
          this.$emit('timeOver');
          this.totalTime = 0;
          this.autoReset && this.resetTimer();
        }
      },
      saveTime(force = false) {
        if (this.saveAs) {
          if (!force && (this.saveAfter > 0 && this.totalTime > 0)){
            this.saveAfter--;
          } else {
            localStorage.setItem(this.saveAs, this.totalTime > 0 ? this.totalTime : this.duration);
            this.saveAfter = 3;
          }
        }
      }
    },
    computed: {
      hours() {
        return this.padTime(Math.floor(this.totalTime / 3600));
      },
      minutes() {
        return this.padTime(Math.floor((this.totalTime - (this.hours * 3600)) / 60));
      },
      seconds() {
        return this.padTime(this.totalTime - (this.hours * 3600) - (this.minutes * 60));
      },
      formatTime() {
        if (this.format === 'i:s')
          return `${this.minutes}:${this.seconds}`;
        return `${this.hours}:${this.minutes}:${this.seconds}`;
      }
    },
    mounted() {
      if (this.saveAs) {
        const saved = localStorage.getItem(this.saveAs);
        this.totalTime = (saved && (saved > 3 ? saved - 3 : 0)) || this.duration;
      }

      this.startTimer();
    }
  }
</script>
