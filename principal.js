
class Juego{
  constructor(){
    this.config = {
      type: Phaser.CANVAS,
      width: 800,
      height: 600,
      scene: ''
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