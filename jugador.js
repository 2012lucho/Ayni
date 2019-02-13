
class Jugador extends ISOEntity{
  constructor(c){
    super(c);
    this.mundo.camera.startFollow(this.sprite, true);

    this.sigueCam();
    this.mundo.update();
    this.action_key = false;
    this.sprite.scale = 0.3;
  }

  update(e){
    super.update(e);
    let IOSE = this;

    //se mueve con los cursores
    let cursors = e.input.keyboard.createCursorKeys();
    if (cursors.left.isDown) { this.px_dest -= this.vel_desp; }

    if (cursors.right.isDown){ this.px_dest += this.vel_desp; }

    if (cursors.up.isDown )  { this.py_dest -= this.vel_desp; }

    if (cursors.down.isDown ){ this.py_dest += this.vel_desp; }

    e.input.keyboard.on('keydown-SHIFT', function (event) { IOSE.vel_desp_f = IOSE.vel_desp_n*3;  });
    e.input.keyboard.on('keyup-SHIFT',   function (event) { IOSE.vel_desp_f = IOSE.vel_desp_n;  });

    //tecla de acción
    e.input.keyboard.on('keydown-E', function (event) {  if (!this.action_key){ this.actionKey(); this.action_key = true; }  });

    this.sigueCam();
    this.goToDest();
  }

  sigueCam(){
    this.mundo.cam_px = this.x;
    this.mundo.cam_py = this.y;
  }

  actionKey(){

  }

  destroy(){
    super.destroy();
  }

}
