
class Jugador extends ISOEntity{
  constructor(c){
    super(c);
    this.mundo.camera.startFollow(this.sprite, true);

    this.sigueCam();
    this.mundo.update();
    this.action_key = false;
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

    //se apreta el mouse
    if (e.input.pointer1.isDown) {
      let c = IOSE.getMapCoords(e.input.pointer1.x, e.input.pointer1.y);
      IOSE.px_dest = c.x; IOSE.py_dest = c.y; }

    e.input.on('pointerdown', function (pointer) {
      let c = IOSE.getMapCoords(pointer.event.clientX,pointer.event.clientY);
      IOSE.px_dest = c.x; IOSE.py_dest = c.y;
    }, e);

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
