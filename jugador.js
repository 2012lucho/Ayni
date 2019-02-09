
class Jugador extends ISOEntity{
  constructor(c){
    super(c);
    this.mundo.camera.startFollow(this.sprite, true);
    this.px_dest = c.x; this.py_dest = c.y;
    this.x = c.x; this.y = c.y;
    this.sigueCam();
    this.mundo.update();
  }

  update(e){
    super.update(e);
    let IOSE = this;

    let cursors = e.input.keyboard.createCursorKeys();
    if (cursors.left.isDown) { this.px_dest -= this.vel_desp; }

    if (cursors.right.isDown){ this.px_dest += this.vel_desp; }

    if (cursors.up.isDown )  { this.py_dest -= this.vel_desp; }

    if (cursors.down.isDown ){ this.py_dest += this.vel_desp; }

    if (e.input.pointer1.isDown) {
      let c = IOSE.getMapCoords(e.input.pointer1.x, e.input.pointer1.y);
      IOSE.px_dest = c.x; IOSE.py_dest = c.y; }

    e.input.on('pointerdown', function (pointer) {
      let c = IOSE.getMapCoords(pointer.event.clientX,pointer.event.clientY);
      IOSE.px_dest = c.x; IOSE.py_dest = c.y;
    }, e);

    this.sigueCam();
    this.goToDest();
  }

  goToDest(){
    if (this.px_dest != -1 && this.py_dest != -1){
      if (this.x < this.px_dest && this.px_dest-this.x > this.vel_desp){ this.avanzarX(this.vel_desp); }
      if (this.x > this.px_dest && this.x-this.px_dest > this.vel_desp){ this.avanzarX(-this.vel_desp); }
      if (this.y < this.py_dest && this.py_dest-this.y > this.vel_desp){ this.avanzarY(this.vel_desp); }
      if (this.y > this.py_dest && this.y-this.py_dest > this.vel_desp){ this.avanzarY(-this.vel_desp); }
    }
  }

  sigueCam(){
    this.mundo.cam_px = this.x;
    this.mundo.cam_py = this.y;
  }

  destroy(){
    super.destroy();
  }

}
