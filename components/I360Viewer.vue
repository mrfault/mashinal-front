<template>
  <div>
    <!-- 360 Viewer Container -->
    <div :id="identifier" ref="viewerContainer" class="v360-viewer-container">
      <!-- 360 Viewer Header -->
      <slot name="header"></slot>
      <!--/ 360 Viewer Header -->

      <!-- Percentage Loader -->
      <div v-if="!imagesLoaded" :class="{'mobile-version-360': fromFsPopup}" class="swiper-slide-bg v360-viewport">
        <h3 v-if="!fromFsPopup" style="position: absolute; top: 30%;; color: #081a3e;">{{ $t('panorama_loading') }}</h3>
        <loader>
          <div class="percentage-center">{{ percentage }}%</div>
        </loader>
      </div>
      <div v-if="onFsLightBox  && announcement.interior_360" class="switch-pnlm">
        <form-switch v-model="showInteriorSwitcher" :options="interiorOptions" auto-width
                     class="interior-exterior-switcher" style="width: fit-content;pointer-events: all;"/>
        <!--        <button @click="$nuxt.$emit('switchInterior')" class="btn " style="background-color: #246EB2;color:white;" >{{ $t('interior')}}</button>-->
      </div>
      <!--/ Percentage Loader -->

      <!-- 360 viewport -->
      <div v-show="imagesLoaded" ref="viewport" class="v360-viewport" style="background-color: transparent;">
        <canvas
          ref="imageContainer"
          v-hammer:pinch="onPinch"
          v-hammer:pinchend="onPinch"
          v-hammer:pinchin="onPinchIn"
          v-hammer:pinchout="onPinchOut"
          class="v360-image-container"
        ></canvas>
        <div v-if="boxShadow"
             v-hammer:pinch="onPinch"
             v-hammer:pinchend="onPinch"
             v-hammer:pinchin="onPinchIn"
             v-hammer:pinchout="onPinchOut"
             class="v360-product-box-shadow"
        ></div>
        <div v-if="putMainImage" class="main-image-container-360">
          <button class="btn btn--red selectMainImage" @click="selectMainImage()">Əsas şəkil et</button>
          <button :disabled="deleteButton" class="btn btn--red selectMainImage" style="left: -20px;"
                  @click="delete360()">Sil
          </button>
        </div>
      </div>
      <!--/ 360 viewport -->

      <!-- Fullscreen Button -->
      <abbr title="Fullscreen Toggle">
        <div class="v360-fullscreen-toggle text-center" @click="toggleFullScreen">
          <div :class="(buttonClass == 'dark') ? 'text-light' : 'text-dark'" class="v360-fullscreen-toggle-btn">
            <i :class="(!isFullScreen) ? 'fas fa-expand text-lg' : 'fas fa-compress text-lg'"></i>
          </div>
        </div>
      </abbr>
      <!--/ Fullscreen Button -->


    </div>
    <!--/ 360 Viewer Container -->

    <div v-if="showZoom && imagesLoaded" class="zoom-360-wrapper">
      <button class="btn btn--grey" @click="zoomIn">+</button>
      <button class="btn btn--grey" @click="zoomOut">-</button>
    </div>
  </div>
</template>

<script>
import {mapGetters} from "vuex";

const uuidv1 = require('uuid/v1');

export default {
  name: 'I360Viewer',
  props: {
    onFsLightBox: {
      type: Boolean,
      default: false,
    },
    showInterior: {
      type: Boolean,
      default: false,
    },
    fromFsPopup: {
      type: Boolean,
      default: false,
    },
    showZoom: {
      type: Boolean,
      default: false,
    },
    files: {
      type: Array,
      default: () => []
    },
    imagePath: {
      type: String,
      require: true,
      default: ''
    },
    fileName: {
      type: String,
      require: true,
      default: ''
    },
    spinReverse: {
      type: Boolean,
      require: true,
      default: true,
    },
    amount: {
      type: Number,
      require: true,
      default: 24,
    },
    autoplay: {
      type: Boolean,
      require: false,
      default: true
    },
    loop: {
      type: Number,
      require: false,
      default: 1
    },
    boxShadow: {
      type: Boolean,
      require: false,
      default: false
    },
    buttonClass: {
      type: String,
      require: false,
      default: 'light'
    },
    hotspots: {
      type: Array,
      require: true,
      default: () => []
    },
    identifier: {
      type: String,
      require: true,
      default: () => uuidv1()
    },
    paddingIndex: {
      type: Boolean,
      require: false,
      default: false
    },
    disableZoom: {
      type: Boolean,
      require: false,
      default: false
    },
    scrollImage: {
      type: Boolean,
      require: false,
      default: false
    },
    putMainImage: Boolean,
    id: Number,
  },
  data() {
    return {
      deleteButton:false,
      showInteriorSwitcher: false,
      percentage: 0,
      minScale: 0.5,
      maxScale: 4,
      scale: 0.2,
      customOffset: 10,
      currentScale: 1.0,
      currentTopPosition: 0,
      currentLeftPosition: 0,
      selectMenuOption: 1,
      currentImage: null,
      dragging: false,
      canvas: null,
      ctx: null,
      dragStart: null,
      lastX: 0,
      lastY: 0,
      currentCanvasImage: null,
      isFullScreen: false,
      viewPortElementWidth: null,
      movementStart: 0,
      movement: false,
      dragSpeed: 300,
      speedFactor: 5,
      activeImage: 1,
      stopAtEdges: false,
      imagesLoaded: false,
      loadedImages: 0,
      centerX: 0,
      centerY: 0,
      panmode: false,
      isMobile: false,
      currentLoop: 0,
      loopTimeoutId: 0,
      images: [],
      imageData: [],
      playing: false
    }
  },
  computed: {
    ...mapGetters(['announcement'])
  },
  watch: {
    showInteriorSwitcher() {
      this.$nuxt.$emit('switchInterior')
    },
    zooming(value, prev) {
      if (prev < value) this.zoomIn()
      else this.zoomOut()
    },
    currentLeftPosition(value) {
      this.redraw()
    },
    currentTopPosition(value) {
      this.redraw()
    },
    viewPortElementWidth(value) {
      this.update()
    },
    panmode(value) {
      this.attachEvents()
    },
    isFullScreen(value) {
      if (!value) {
        //exit full screen
        this.$refs.viewerContainer.classList.remove('v360-main')
        this.$refs.viewerContainer.classList.remove('v360-fullscreen')
        /* this.$refs.enterFullScreenIcon.style.display = 'block'
        this.$refs.leaveFullScreenIcon.style.display = 'none' */
      } else {
        //enter full screen
        this.$refs.viewerContainer.classList.add('v360-main')
        this.$refs.viewerContainer.classList.add('v360-fullscreen')
        /* this.$refs.enterFullScreenIcon.style.display = 'none'
        this.$refs.leaveFullScreenIcon.style.display = 'block' */

      }
      this.setImage()
    },
    playing(value) {
      if (value) {
        this.play()
      } else {
        this.stop()
      }
    }
  },
  mounted() {
    //this.toggleFullScreen()
    this.fetchData()
    document.addEventListener('fullscreenchange', this.exitHandler);
    document.addEventListener('webkitfullscreenchange', this.exitHandler);
    document.addEventListener('mozfullscreenchange', this.exitHandler);
    document.addEventListener('MSFullscreenChange', this.exitHandler);
  },
  methods: {
    initData() {
      this.checkMobile()
      this.loadInitialImage()

      this.canvas = this.$refs.imageContainer
      this.ctx = this.canvas.getContext('2d')
      this.attachEvents();
      window.addEventListener('resize', this.resizeWindow);
      this.resizeWindow()

      this.playing = this.autoplay
    },
    fetchData() {
      if (this.files.length) {
        this.imageData = this.files;
      } else {
        for (let i = 1; i <= this.amount; i++) {
          const imageIndex = (this.paddingIndex) ? this.lpad(i, "0", 2) : i
          const fileName = this.fileName.replace('{index}', imageIndex);
          const filePath = `${this.imagePath}/${fileName}`
          this.imageData.push(filePath)
        }
      }
      this.preloadImages()
    },

    lpad(str, padString, length) {
      str = str.toString()

      while (str.length < length) str = padString + str
      return str
    },

    preloadImages() {
      if (this.imageData.length) {
        try {
          this.amount = this.imageData.length;

          this.imageData.forEach((src) => {
            this.addImage(src);
          });
        } catch (error) {
          console.error(`Something went wrong while loading images: ${error.message}`);
        }
      } else {
      }
    },
    addImage(resultSrc) {
      const image = new Image();

      image.src = resultSrc + '?cache=false';
      image.crossOrigin = 'anonymous'
      image.onload = this.onImageLoad.bind(this);
      image.onerror = this.onImageLoad.bind(this);

      this.images.push(image);
    },
    onImageLoad(event) {
      const percentage = Math.round(this.loadedImages / this.amount * 100);

      this.loadedImages += 1;
      this.updatePercentageInLoader(percentage);

      if (this.loadedImages === this.amount) {
        this.onAllImagesLoaded(event);
      }/* else if (this.loadedImages === 30) {
        this.imagesLoaded = true
        this.initData()
        //this.onFirstImageLoaded(event);
      }*/
    },
    updatePercentageInLoader(percentage) {
      this.percentage = percentage;
      /* if (this.loader) {
          this.loader.style.width = percentage + '%';
      }

      if (this.view360Icon) {
          this.view360Icon.innerText = percentage + '%';
      } */

      //this.$refs.viewPercentage.innerHTML = percentage + '%';
      //console.log(percentage + '%')
    },
    onAllImagesLoaded(e) {
      this.imagesLoaded = true
      this.initData()
    },
    togglePlay() {
      this.playing = !this.playing
    },
    play() {
      this.loopTimeoutId = window.setInterval(() => this.loopImages(), 30);
    },
    onSpin() {
      if (this.playing || this.loopTimeoutId) {
        this.stop();
      }
    },
    stop() {
      if (this.activeImage == 1) {
        this.currentLoop = 0
      }
      this.playing = false;
      window.clearTimeout(this.loopTimeoutId);
    },
    loopImages() {
      if (this.activeImage == 1) {
        if (this.currentLoop == this.loop) {
          this.stop()
        } else {
          this.currentLoop++
          this.next()
        }
      } else {
        this.next()
      }
    },
    next() {
      this.turnRight()
    },
    prev() {
      this.turnLeft()
    },
    turnLeft() {
      this.moveActiveIndexDown(1);
    },
    turnRight() {
      this.moveActiveIndexUp(1);
    },
    loadImages() {
    },
    checkMobile() {
      this.isMobile = !!('ontouchstart' in window || navigator.msMaxTouchPoints);
    },
    loadInitialImage() {
      this.currentImage = this.imageData[0]
      this.setImage()
    },
    resizeWindow() {
      this.setImage()
    },
    onPinch(evt) {
    },
    onPinchEnd(evt) {
      this.tempScale = 0
    },
    onPinchIn(evt) {
      //alert('pinchin:' + evt.scale)
      this.zoomOut()
    },
    onPinchOut(evt) {
      this.zoomIn()
    },
    attachEvents() {
      if (this.panmode) {
        this.bindPanModeEvents()
      } else {
        this.bind360ModeEvents()
      }
    },
    bindPanModeEvents() {
      this.$refs.viewport.removeEventListener('touchend', this.touchEnd);
      this.$refs.viewport.removeEventListener('touchstart', this.touchStart);
      this.$refs.viewport.removeEventListener('touchmove', this.touchMove);

      this.$refs.viewport.addEventListener('touchend', this.stopDragging);
      this.$refs.viewport.addEventListener('touchstart', this.startDragging);
      this.$refs.viewport.addEventListener('touchmove', this.doDragging);

      this.$refs.viewport.removeEventListener('mouseup', this.stopMoving);
      this.$refs.viewport.removeEventListener('mousedown', this.startMoving);
      this.$refs.viewport.removeEventListener('mousemove', this.doMoving);

      this.$refs.viewport.addEventListener('mouseup', this.stopDragging);
      this.$refs.viewport.addEventListener('mousedown', this.startDragging);
      this.$refs.viewport.addEventListener('mousemove', this.doDragging);

      this.$refs.viewport.addEventListener('wheel', this.onScroll);
    },
    bind360ModeEvents() {
      this.$refs.viewport.removeEventListener('touchend', this.stopDragging);
      this.$refs.viewport.removeEventListener('touchstart', this.startDragging);
      this.$refs.viewport.removeEventListener('touchmove', this.doDragging);

      this.$refs.viewport.addEventListener('touchend', this.touchEnd);
      this.$refs.viewport.addEventListener('touchstart', this.touchStart);
      this.$refs.viewport.addEventListener('touchmove', this.touchMove);

      this.$refs.viewport.removeEventListener('mouseup', this.stopDragging);
      this.$refs.viewport.removeEventListener('mousedown', this.startDragging);
      this.$refs.viewport.removeEventListener('mousemove', this.doDragging);

      this.$refs.viewport.addEventListener('mouseup', this.stopMoving);
      this.$refs.viewport.addEventListener('mousedown', this.startMoving);
      this.$refs.viewport.addEventListener('mousemove', this.doMoving);

      this.$refs.viewport.addEventListener('wheel', this.onScroll);
    },
    togglePanMode() {
      this.panmode = !this.panmode
    },
    zoomIn(evt) {
      //if (this.disableZoom) return;

      this.lastX = this.centerX;
      this.lastY = this.centerY
      this.zoom(15)
    },
    zoomOut(evt) {
      //if (this.disableZoom) return;

      this.lastX = this.centerX;
      this.lastY = this.centerY
      this.zoom(-15)
    },
    moveLeft() {
      this.currentLeftPosition += this.customOffset;
    },
    moveRight() {
      this.currentLeftPosition -= this.customOffset;
    },
    moveUp() {
      this.currentTopPosition += this.customOffset;
    },
    moveDown() {
      this.currentTopPosition -= this.customOffset;
    },
    resetPosition() {
      this.currentScale = 1
      this.activeImage = 1
      this.setImage(true)
    },
    setImage(cached = false) {
      this.currentLeftPosition = this.currentTopPosition = 0

      if (!cached) {
        this.currentCanvasImage = new Image()
        // this.currentCanvasImage.crossOrigin = 'anonymous'
        this.currentCanvasImage.src = this.currentImage

        this.currentCanvasImage.onload = () => {

          if (this.$refs.viewport) {
            let viewportElement = this.$refs.viewport.getBoundingClientRect()
            this.canvas.width = (this.isFullScreen) ? viewportElement.width : this.currentCanvasImage.width
            this.canvas.height = (this.isFullScreen) ? viewportElement.height : this.currentCanvasImage.height
          }
          this.trackTransforms(this.ctx)

          this.redraw()
        }

        this.currentCanvasImage.onerror = () => {
        }
      } else {
        this.currentCanvasImage = this.images[0]
        let viewportElement = this.$refs.viewport.getBoundingClientRect()
        this.canvas.width = (this.isFullScreen) ? viewportElement.width : this.currentCanvasImage.width
        this.canvas.height = (this.isFullScreen) ? viewportElement.height : this.currentCanvasImage.height
        this.trackTransforms(this.ctx)

        this.redraw()
      }

    },
    redraw() {

      try {

        let p1 = this.ctx.transformedPoint(0, 0);
        let p2 = this.ctx.transformedPoint(this.canvas.width, this.canvas.height)

        let hRatio = this.canvas.width / this.currentCanvasImage.width
        let vRatio = this.canvas.height / this.currentCanvasImage.height
        let ratio = Math.min(hRatio, vRatio);
        let centerShift_x = (this.canvas.width - this.currentCanvasImage.width * ratio) / 2
        let centerShift_y = (this.canvas.height - this.currentCanvasImage.height * ratio) / 2
        this.ctx.clearRect(p1.x, p1.y, p2.x - p1.x, p2.y - p1.y);

        this.centerX = this.currentCanvasImage.width * ratio / 2
        this.centerY = this.currentCanvasImage.height * ratio / 2

        //center image
        this.ctx.drawImage(this.currentCanvasImage, this.currentLeftPosition, this.currentTopPosition, this.currentCanvasImage.width, this.currentCanvasImage.height,
          centerShift_x, centerShift_y, this.currentCanvasImage.width * ratio, this.currentCanvasImage.height * ratio);

        this.addHotspots()

      } catch (e) {
        this.trackTransforms(this.ctx)
      }

    },
    addHotspots() {
      this.clearHotspots()

      let currentImageHotspots = this.hotspots.filter(h => h.frame == this.activeImage)

      for (let c in currentImageHotspots) {
        let hotspotElement = currentImageHotspots[c]

        let hotspotPositionX, hotspotPositionY

        if (this.canvas.width > this.$refs.viewport.clientWidth) {
          /* hotspotPositionX = hotspotElement.x * this.$refs.viewport.clientWidth * this.currentScale
          hotspotPositionY = hotspotElement.y * this.$refs.viewport.clientHeight * this.currentScale */
          hotspotPositionX = hotspotElement.x * this.$refs.viewport.clientWidth
          hotspotPositionY = hotspotElement.y * this.$refs.viewport.clientHeight
        } else {
          hotspotPositionX = hotspotElement.x * this.canvas.width
          hotspotPositionY = hotspotElement.y * this.canvas.height
        }

        let divElement = document.createElement('div')
        let spanElement = document.createElement('span')
        let imgElement = document.createElement('img')

        imgElement.className = 'hotspot-icon'
        imgElement.src = hotspotElement.icon
        spanElement.className = 'tooltiptext'
        spanElement.innerHTML = hotspotElement.text
        divElement.className = 'tooltip'
        divElement.style.left = hotspotPositionX + 'px'
        divElement.style.top = hotspotPositionY + 'px'
        divElement.appendChild(imgElement)
        divElement.appendChild(spanElement)

        imgElement.addEventListener('click', (e) => {
          e.preventDefault()
          this.selectedHotspot = hotspotElement
          this.openHotspotForm(true)
        })

        if (hotspotElement.action) {
        }

        this.$refs.viewport.appendChild(divElement)
        //console.log('draw')
        //this.ctx.drawImage(this.currentCanvasImage, hotspotElement.x*this.canvas.width, hotspotElement.y*this.canvas.height, 10, 10)
      }
    },
    clearHotspots() {
      let hotspotButtons = document.getElementById(this.identifier).querySelectorAll('.tooltip')

      if (hotspotButtons.length)
        hotspotButtons.forEach(element => element.remove())
    },
    onMove(pageX) {
      if (pageX - this.movementStart >= this.speedFactor) {
        let itemsSkippedRight = Math.floor((pageX - this.movementStart) / this.speedFactor) || 1;

        this.movementStart = pageX;

        if (this.spinReverse) {
          this.moveActiveIndexDown(itemsSkippedRight);
        } else {
          this.moveActiveIndexUp(itemsSkippedRight);
        }

        this.redraw();

      } else if (this.movementStart - pageX >= this.speedFactor) {

        let itemsSkippedLeft = Math.floor((this.movementStart - pageX) / this.speedFactor) || 1;

        this.movementStart = pageX;

        if (this.spinReverse) {
          this.moveActiveIndexUp(itemsSkippedLeft);
        } else {
          this.moveActiveIndexDown(itemsSkippedLeft);
        }

        this.redraw();
      }
    },
    startMoving(evt) {
      this.stop();
      this.movement = true
      this.movementStart = evt.pageX;
      this.$refs.viewport.classList.add('v360-grabbing');
    },
    doMoving(evt) {
      if (this.movement) {
        this.onMove(evt.clientX)
      }
    },
    onScroll(evt) {
      evt.preventDefault();

      if (this.disableZoom || this.scrollImage) {
        if (evt.deltaY < 0) {
          this.moveActiveIndexDown(1);
        } else {
          this.moveActiveIndexUp(1);
        }
        this.onMove(evt.scrollTop);
      } else {
        this.zoomImage(evt);
      }
    },
    moveActiveIndexUp(itemsSkipped) {

      if (this.stopAtEdges) {
        if (this.activeImage + itemsSkipped >= this.amount) {
          this.activeImage = this.amount;
        } else {
          this.activeImage += itemsSkipped;
        }
      } else {
        this.activeImage = (this.activeImage + itemsSkipped) % this.amount || this.amount;
      }

      this.update()
    },
    moveActiveIndexDown(itemsSkipped) {

      if (this.stopAtEdges) {
        if (this.activeImage - itemsSkipped <= 1) {
          this.activeImage = 1;
        } else {
          this.activeImage -= itemsSkipped;
        }
      } else {
        if (this.activeImage - itemsSkipped < 1) {
          this.activeImage = this.amount + (this.activeImage - itemsSkipped);
        } else {
          this.activeImage -= itemsSkipped;
        }
      }

      this.update()
    },
    update() {
      const image = this.images[this.activeImage - 1];

      this.currentCanvasImage = image

      this.redraw()
    },
    stopMoving(evt) {
      this.movement = false
      this.movementStart = 0
      this.$refs.viewport.classList.remove('v360-grabbing');
    },
    touchStart(evt) {
      this.movementStart = evt.touches[0].clientX
    },
    touchMove(evt) {
      this.onMove(evt.touches[0].clientX)
    },
    touchEnd() {
      this.movementStart = 0
    },
    startDragging(evt) {
      this.dragging = true

      document.body.style.mozUserSelect = document.body.style.webkitUserSelect = document.body.style.userSelect = 'none';

      if (this.isMobile) {
        this.lastX = evt.touches[0].offsetX || (evt.touches[0].pageX - this.canvas.offsetLeft);
        this.lastY = evt.touches[0].offsetY || (evt.touches[0].pageY - this.canvas.offsetTop);
      } else {
        this.lastX = evt.offsetX || (evt.pageX - this.canvas.offsetLeft);
        this.lastY = evt.offsetY || (evt.pageY - this.canvas.offsetTop);
      }

      this.dragStart = this.ctx.transformedPoint(this.lastX, this.lastY);
    },
    doDragging(evt) {

      if (this.isMobile) {
        this.lastX = evt.touches[0].offsetX || (evt.touches[0].pageX - this.canvas.offsetLeft);
        this.lastY = evt.touches[0].offsetY || (evt.touches[0].pageY - this.canvas.offsetTop);
      } else {
        this.lastX = evt.offsetX || (evt.pageX - this.canvas.offsetLeft);
        this.lastY = evt.offsetY || (evt.pageY - this.canvas.offsetTop);
      }

      if (this.dragStart) {
        let pt = this.ctx.transformedPoint(this.lastX, this.lastY);
        this.ctx.translate(pt.x - this.dragStart.x, pt.y - this.dragStart.y);
        //redraw();
        this.redraw();
      }
    },
    stopDragging(evt) {
      this.dragging = false
      this.dragStart = null
    },
    restrictScale() {
      let scale = this.currentScale
      if (scale < this.minScale) {
        scale = this.minScale;
      } else if (scale > this.maxScale) {
        scale = this.maxScale;
      }
      return scale;
    },
    zoom(clicks) {
      //console.log(this.lastX + ' - ' + this.lastY)
      let factor = Math.pow(1.01, clicks);
      //console.log(factor)

      if (factor > 1) {
        this.currentScale += factor
      } else {
        if (this.currentScale - factor > 1)
          this.currentScale -= factor
        else
          this.currentScale = 1
      }

      if (this.currentScale > 1) {
        let pt = this.ctx.transformedPoint(this.lastX, this.lastY);
        this.ctx.translate(pt.x, pt.y);

        //console.log(this.currentScale)
        this.ctx.scale(factor, factor);
        this.ctx.translate(-pt.x, -pt.y);
        this.redraw();
      }
    },
    zoomImage(evt) {
      if (this.disableZoom) return;

      this.lastX = evt.offsetX || (evt.pageX - this.canvas.offsetLeft);
      this.lastY = evt.offsetY || (evt.pageY - this.canvas.offsetTop);

      var delta = evt.wheelDelta ? evt.wheelDelta / 40 : evt.deltaY ? -evt.deltaY : 0;

      if (delta) this.zoom(delta);
      return evt.preventDefault() && false;

    },
    trackTransforms(ctx) {

      return new Promise(resolve => {
        var svg = document.createElementNS("http://www.w3.org/2000/svg", 'svg');
        var xform = svg.createSVGMatrix();
        this.ctx.getTransform = function () {
          return xform;
        };

        var savedTransforms = [];
        var save = ctx.save;
        this.ctx.save = () => {
          savedTransforms.push(xform.translate(0, 0));
          return save.call(this.ctx);
        };
        var restore = ctx.restore;
        this.ctx.restore = () => {
          xform = savedTransforms.pop();
          return restore.call(this.ctx);
        };

        var scale = this.ctx.scale;
        this.ctx.scale = (sx, sy) => {
          xform = xform.scaleNonUniform(sx, sy);
          return scale.call(this.ctx, sx, sy);
        };
        var rotate = this.ctx.rotate;
        this.ctx.rotate = (radians) => {
          xform = xform.rotate(radians * 180 / Math.PI);
          return rotate.call(this.ctx, radians);
        };
        var translate = this.ctx.translate;
        this.ctx.translate = (dx, dy) => {
          xform = xform.translate(dx, dy);
          return translate.call(this.ctx, dx, dy);
        };
        var transform = this.ctx.transform;
        this.ctx.transform = (a, b, c, d, e, f) => {
          var m2 = svg.createSVGMatrix();
          m2.a = a;
          m2.b = b;
          m2.c = c;
          m2.d = d;
          m2.e = e;
          m2.f = f;
          xform = xform.multiply(m2);
          return transform.call(this.ctx, a, b, c, d, e, f);
        };
        var setTransform = this.ctx.setTransform;
        this.ctx.setTransform = (a, b, c, d, e, f) => {
          xform.a = a;
          xform.b = b;
          xform.c = c;
          xform.d = d;
          xform.e = e;
          xform.f = f;
          return setTransform.call(this.ctx, a, b, c, d, e, f);
        };
        var pt = svg.createSVGPoint();
        this.ctx.transformedPoint = (x, y) => {
          pt.x = x;
          pt.y = y;
          return pt.matrixTransform(xform.inverse());
        }

        resolve(this.ctx)
      })

    },
    toggleFullScreen() {
      this.isFullScreen = !this.isFullScreen
    },

    //main image
    selectMainImage() {
      this.$emit('mainSelected', this.currentCanvasImage.src)
      this.$toasted.success('Əsas şəkil təyin olundu')
    },
    async delete360() {
      try {
        this.deleteButton = true;
        await this.$axios.$post('/announce/remove_360', {
          announcement_id: this.id
        })

        this.$emit('remove360', 'success')
        this.$toasted.success('Silindi')
      } catch (e) {
        this.$toasted.error('Silinmədə problem yarandi')
      }
    },
  }
}
</script>
<style lang="scss">
.percentage-center {
  position: absolute;
  top: 50%;
  color: #242426;
  left: 50%;
  transform: translate(-50%, -50%);
}

.mobile-version-360 {
  .percentage-center {
    color: white;
  }
}

.switch-pnlm {
  position: absolute;
  top: -40px;
  z-index: 1234;
  display: flex;
  justify-content: flex-start;
  width: 100%;
}

.main-image-container-360 {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  padding: 20px;
  display: flex;
  justify-content: space-between;
}
</style>
