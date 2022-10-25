export class CameraOffset {
  x: number;
  y: number;
  zoomFactor: number;

  constructor(offset: CameraOffset | { x: number, y: number, zoomFactor: number }) {
    this.x = offset.x;
    this.y = offset.y
    this.zoomFactor = offset.zoomFactor;
  }

  lerp(to: CameraOffset, t: number): CameraOffset {
    const _x = this.x + (to.x - this.x) * t;
    const _y = this.y + (to.y - this.y) * t;
    const _zoomFactor = this.zoomFactor + (to.zoomFactor - this.zoomFactor) * t;

    return new CameraOffset({x: _x, y: _y, zoomFactor: _zoomFactor});
  };

  clone(): CameraOffset {
    return new CameraOffset(this);
  };

  copy(offset: CameraOffset): CameraOffset {
    this.x = offset.x;
    this.y = offset.y;
    this.zoomFactor = offset.zoomFactor;

    return this;
  };
}