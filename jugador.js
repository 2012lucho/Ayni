
class Jugador extends ISOEntity{
  constructor(c){
    super(c);
    this.sigueCam();
  }

  update(e){
    super.update(e);

    let cursors = e.input.keyboard.createCursorKeys();
    if (cursors.left.isDown){ this.avanzarX(-this.vel_desp); }

    if (cursors.right.isDown){ this.avanzarX(this.vel_desp); }

    if (cursors.up.isDown ){ this.avanzarY(-this.vel_desp); }

    if (cursors.down.isDown ){ this.avanzarY(this.vel_desp); }

    this.sigueCam();
  }

  sigueCam(){
    this.mundo.cam_px = this.x-this.mundo.cant_px*0.9;
    this.mundo.cam_py = this.y+this.mundo.cant_py/4;
  }

  destroy(){
    super.destroy();
  }

}
