
class Mundo{
    constructor(config){
      this.name     = 'Mundo';
      this.config   = config;
      this.escena   = new Phaser.Scene(this.name);
      config.scene  = this.escena;
      this.mapa     = [];
      this.tile_den = [];
      this.items    = [];
      this.preload();
    }

    preload(){
      let o = this;
      this.escena.preload = function() {
        for(let c=0;c<19;c++){
          this.load.image('tile'+(c+1),'./img/tile'+(c+1)+'.png');
          o.tile_den[c] = { 'den':'tile'+(c+1) };
        }
        this.load.image('point','./img/point.png');
      }
    }

    start(){
      let e = this.escena;
      let o = this;

      let misiones = [];
      misiones.push(new Mission({ colorID:0xFF4E00 }));
      misiones.push(new Mission({ colorID:0x008080 }));
      misiones.push(new Mission({ colorID:0x668000 }));
      misiones.push(new Mission({ colorID:0xCCFF00 }));
      misiones.push(new Mission({ colorID:0x1A1A1A }));
      misiones.push(new Mission({ colorID:0x0044AA }));
      misiones.push(new Mission({ colorID:0x9b9692 }));
      misiones.push(new Mission({ colorID:0x00a457 }));
      misiones.push(new Mission({ colorID:0xffb100 }));

      this.escena.create = function(){
        this.input.setDefaultCursor('url(./img/point.png), pointer');

        let mapConfig  = {
          "tiles_x":480,
          "tiles_y":480,
          "tiles_z":1,
          "chunk_t":64
        };
        let GM         = new GeneradorMapa(mapConfig);
        GM.generarTerreno(misiones);
        this.isometric = new IsometricWorld(e,'tiles', GM.getMapa(), o.tile_den, o);

        this.prota = new Jugador({ 'escena':e, 'vel_desp':1.275, 'mundo':this.isometric });
        this.prota.z = 1;
        this.prota.x = 2;
        this.prota.y = 2;

        this.items = new Item({ 'escena':e, 'mundo':this.isometric });
      }

      this.escena.update = function(){
        this.prota.update(this);
      }

      this.game = new Phaser.Game(this.config);
    }
}
