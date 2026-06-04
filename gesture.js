AFRAME.registerComponent('gesture-control', {
  schema: {
    minScale: { type: 'number', default: 0.001 },
    maxScale: { type: 'number', default: 6 },
    rotationSpeed: { type: 'number', default: 0.6 },
    pinchSpeed: { type: 'number', default: 1.0 }
  },

  init: function () {
    this.initialScale = this.el.object3D.scale.clone();
    this.currentScaleFactor = 1.0;

    this.isDragging = false;
    this.lastX = 0;
    this.lastY = 0;

    this.isPinching = false;
    this.lastPinchDistance = 0;

    this.onTouchStart = this.onTouchStart.bind(this);
    this.onTouchMove = this.onTouchMove.bind(this);
    this.onTouchEnd = this.onTouchEnd.bind(this);

    window.addEventListener('touchstart', this.onTouchStart, { passive: false });
    window.addEventListener('touchmove', this.onTouchMove, { passive: false });
    window.addEventListener('touchend', this.onTouchEnd, { passive: false });
    window.addEventListener('touchcancel', this.onTouchEnd, { passive: false });
  },

  remove: function () {
    window.removeEventListener('touchstart', this.onTouchStart);
    window.removeEventListener('touchmove', this.onTouchMove);
    window.removeEventListener('touchend', this.onTouchEnd);
    window.removeEventListener('touchcancel', this.onTouchEnd);
  },

  getTouchDistance: function (touches) {
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  },

  onTouchStart: function (event) {
    if (event.touches.length === 1) {
      this.isDragging = true;
      this.isPinching = false;
      this.lastX = event.touches[0].clientX;
      this.lastY = event.touches[0].clientY;
    }

    if (event.touches.length === 2) {
      this.isDragging = false;
      this.isPinching = true;
      this.lastPinchDistance = this.getTouchDistance(event.touches);
    }
  },

  onTouchMove: function (event) {
    event.preventDefault();

    if (event.touches.length === 1 && this.isDragging) {
      const touch = event.touches[0];
      const deltaX = touch.clientX - this.lastX;
      const deltaY = touch.clientY - this.lastY;

      this.el.object3D.rotation.y += deltaX * 0.01 * this.data.rotationSpeed;
      this.el.object3D.rotation.x += deltaY * 0.01 * this.data.rotationSpeed;

      this.lastX = touch.clientX;
      this.lastY = touch.clientY;
    }

    if (event.touches.length === 2 && this.isPinching) {
      const currentDistance = this.getTouchDistance(event.touches);

      if (this.lastPinchDistance > 0) {
        const ratio = currentDistance / this.lastPinchDistance;
        this.currentScaleFactor *= Math.pow(ratio, this.data.pinchSpeed);

        this.currentScaleFactor = Math.max(
          this.data.minScale,
          Math.min(this.data.maxScale, this.currentScaleFactor)
        );

        this.el.object3D.scale.set(
          this.initialScale.x * this.currentScaleFactor,
          this.initialScale.y * this.currentScaleFactor,
          this.initialScale.z * this.currentScaleFactor
        );
      }

      this.lastPinchDistance = currentDistance;
    }
  },

  onTouchEnd: function (event) {
    if (event.touches.length === 0) {
      this.isDragging = false;
      this.isPinching = false;
      this.lastPinchDistance = 0;
    }

    if (event.touches.length === 1) {
      this.isDragging = true;
      this.isPinching = false;
      this.lastX = event.touches[0].clientX;
      this.lastY = event.touches[0].clientY;
    }
  }
});
