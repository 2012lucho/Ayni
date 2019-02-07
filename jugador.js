
class Jugador extends ISOEntity{
  constructor(c){
    super(c);
    this.px_dest, this.py_dest = 0;
    this.pointer_down = false;
    this.mundo.camera.startFollow(this.sprite, true);
  }

  update(e){
    super.update(e);
    let IOSE = this;

    let cursors = e.input.keyboard.createCursorKeys();
    if (cursors.left.isDown){ this.avanzarX(-this.vel_desp); }

    if (cursors.right.isDown){ this.avanzarX(this.vel_desp); }

    if (cursors.up.isDown ){ this.avanzarY(-this.vel_desp); }

    if (cursors.down.isDown ){ this.avanzarY(this.vel_desp); }

    e.input.on('pointerdown', function (pointer) {
      IOSE.px_dest      = pointer.x;
      IOSE.py_dest      = pointer.y;
      if(!IOSE.pointerdown){//console.log(IOSE.getMapCoords(IOSE.px_dest,IOSE.py_dest));
      IOSE.pointer_down = true;
      } }, e);

    e.input.on('pointerup', function (pointer) {
        IOSE.pointer_down = false;
    }, e);

    this.sigueCam();
  }

  sigueCam(){
    this.mundo.cam_px = this.x;
    this.mundo.cam_py = this.y;
  }

  destroy(){
    super.destroy();
  }

}
