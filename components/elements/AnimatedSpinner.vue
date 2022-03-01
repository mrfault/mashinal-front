<template>
  <div class="lds-spinner">
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
  </div>
</template>

<script>
export default {
  name: "AnimatedSpinner"
}
</script>

<style scoped lang="scss">

.lds-spinner {
  transform: scale(0.5);
  color: official;
  display: inline-block;
  position: relative;
  width: 80px;
  height: 80px;
}

.lds-spinner div {
  transform-origin: 40px 40px;
  animation: lds-spinner 1.2s linear infinite;
}

.lds-spinner div:after {
  content: " ";
  display: block;
  position: absolute;
  top: 3px;
  left: 37px;
  width: 18px;
  margin:-17px;
  height: 18px;
  border-radius: 50%;
  background: #fff;
}

.lds-spinner div:nth-child(1) {
  transform: rotate(0deg);
  animation-delay: -1.1s;
&:after {
   background: #0A77E8;
 }
}

.lds-spinner div:nth-child(2) {
  transform: rotate(30deg);
  animation-delay: -1s;
&:after {
   background: #0F9AF0;
 }
}

.lds-spinner div:nth-child(3) {
  transform: rotate(60deg);
  animation-delay: -0.9s;
&:after {
   background: #0F9AF0;
 }
}

.lds-spinner div:nth-child(4) {
  transform: rotate(90deg);
  animation-delay: -0.8s;
&:after {
   background: #13BDF7;
 }
}

.lds-spinner div:nth-child(5) {
  transform: rotate(120deg);
  animation-delay: -0.7s;
&:after {
   background: #13BDF7;
 }
}

.lds-spinner div:nth-child(6) {
  transform: rotate(150deg);
  animation-delay: -0.6s;
&:after {
   background: #18E0FF;
 }
}

.lds-spinner div:nth-child(7) {
  transform: rotate(180deg);
  animation-delay: -0.5s;
&:after {
   background: #18E0FF;
 }
}

.lds-spinner div:nth-child(8) {
  transform: rotate(210deg);
  animation-delay: -0.4s;
&:after {
   background: #65EAFF;
 }
}

.lds-spinner div:nth-child(9) {
  transform: rotate(240deg);
  animation-delay: -0.3s;
&:after {
   background: #65eaff;
 }
}

.lds-spinner div:nth-child(10) {
  transform: rotate(270deg);
  animation-delay: -0.2s;
&:after {
   background: #0A77E8;
 }
}

.lds-spinner div:nth-child(11) {
  transform: rotate(300deg);
  animation-delay: -0.1s;
&:after {
   background: #0a77e8;
 }
}

.lds-spinner div:nth-child(12) {
  transform: rotate(330deg);
  animation-delay: 0s;
&:after {
   background: #0a77e8;
 }
}

@keyframes lds-spinner {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}

</style>
