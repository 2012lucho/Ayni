
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
      this.escena.create = function(){
        let mapConfig  = {
          "tiles_x":480,
          "tiles_y":480,
          "tiles_z":1,
          "chunk_t":64
        };
        let GM         = new GeneradorMapa(mapConfig);
        GM.generarTerreno();
        this.isometric = new IsometricWorld(e,'tiles', GM.getMapa(), o.tile_den);

        this.prota = new Jugador({ 'escena':e, 'vel_desp':1.5678987654, 'mundo':this.isometric });
        this.prota.z = 1;
        this.prota.x = 30;
        this.prota.y = 30;

        this.items = new Item({ 'escena':e, 'mundo':this.isometric });
      }

      this.escena.update = function(){
        this.prota.update(this);
      }

      this.game = new Phaser.Game(this.config);
    }
}
