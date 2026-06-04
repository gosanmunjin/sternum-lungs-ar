/* One finger: rotate model. Two fingers: pinch zoom.
   This component modifies only the entity that has gesture-control. */
AFRAME.registerComponent('gesture-control', {
  schema: {
    minScale: { default: 0.02 },
    maxScale: { default: 8 }
  },
  init: function () {
    this.lastX = 0;
    this.lastY = 0;
    this.startDistance = 0;
    this.startScale = null;
    this.currentScale = this.el.object3D.scale.clone();

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
  touchDistance: function (touches) {
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  },
  clamp: function (v, min, max) {
    return Math.max(min, Math.min(max, v));
  },
  onTouchStart: function (event) {
    if (!event.touches || event.touches.length === 0) return;
    event.preventDefault();

    if (event.touches.length === 1) {
      this.lastX = event.touches[0].clientX;
      this.lastY = event.touches[0].clientY;
    }

    if (event.touches.length >= 2) {
      this.startDistance = this.touchDistance(event.touches);
      this.startScale = this.el.object3D.scale.clone();
    }
  },
  onTouchMove: function (event) {
    if (!event.touches || event.touches.length === 0) return;
    event.preventDefault();

    const obj = this.el.object3D;

    if (event.touches.length === 1) {
      const x = event.touches[0].clientX;
      const y = event.touches[0].clientY;
      const dx = x - this.lastX;
      const dy = y - this.lastY;
      this.lastX = x;
      this.lastY = y;

      obj.rotation.y += dx * 0.012;
      obj.rotation.x += dy * 0.008;
    }

    if (event.touches.length >= 2 && this.startDistance > 0 && this.startScale) {
      const newDistance = this.touchDistance(event.touches);
      const ratio = newDistance / this.startDistance;
      const nextX = this.clamp(this.startScale.x * ratio, this.data.minScale, this.data.maxScale);
      const factor = nextX / this.startScale.x;
      obj.scale.set(
        this.startScale.x * factor,
        this.startScale.y * factor,
        this.startScale.z * factor
      );
    }
  },
  onTouchEnd: function () {
    this.startDistance = 0;
    this.startScale = null;
  }
});
