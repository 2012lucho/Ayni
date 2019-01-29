
class Jugador extends NPC{
  constructor(c){
    super(c);
  }

  update(e){
    super.update(e);

    let cursors = e.input.keyboard.createCursorKeys();
    if (cursors.left.isDown){
      this.x -= this.vel_desp;
      this.mundo.update();
    }

    if (cursors.right.isDown){
      this.x += this.vel_desp;
      this.mundo.update();
    }

    if (cursors.up.isDown ){
      this.y -= this.vel_desp;
      this.mundo.update();
    }

    if (cursors.down.isDown ){
      this.y += this.vel_desp;
      this.mundo.update();
    }

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
