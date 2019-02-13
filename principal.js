
class Juego{
  constructor(){
    this.vp = {'w':960,'h':540,'sc':1}; // window.innerWidth
    this.config = {
      type: Phaser.AUTO,
      scale: {
        mode: Phaser.Scale.FIT,
        parent: 'phaser-example',
        autoCenter: 1,
        width: this.vp.w*this.vp.sc,
        height: this.vp.h*this.vp.sc,
        app_scale:this.vp.sc
      },
      scene: '',
      pixelArt: true,
    }

    this.escenas = [
      new Menu(this.config),
      new Mundo(this.config)
    ];

    this.start();
  }

  start(){
    this.escenas[1].start();
  }
}

let juego = new Juego();
