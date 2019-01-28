
class Juego{
  constructor(){
    this.config = {
      type: Phaser.AUTO,
      width: 1024,
      height: 768,
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
