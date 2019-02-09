
class Mundo{
    constructor(config){
      this.name     = 'Mundo';
      this.config   = config;
      this.escena   = new Phaser.Scene(this.name);
      config.scene  = this.escena;
      this.mapa     = [];
      this.tile_den = [];
      this.items    = [];
      this.texts    = {'t':'', 'd':''};
      this.mission  = -1;
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
      misiones.push(new Mission({
        colorID:0x008080, t:'Secretaría de salud', 'd': 'Derrotar los brotes virales'
      }));
      misiones.push(new Mission({
        colorID:0x668000, t:'La privada', 'd':'Objetivo: Defender la universidad'
      }));
      misiones.push(new Mission({
        colorID:0xCCFF00, t:'Verde', 'd':'Objetivo: Derrotar el narcotráfico'
      }));
      misiones.push(new Mission({
        colorID:0x1A1A1A, t:'Camino a la oscuridad', 'd':'Objetivo: Derrotar los tarifazos a la Luz'
      }));
      misiones.push(new Mission({
        colorID:0x0044AA, t:'Industricidio', 'd':'Objetivo: Proteger la industria'
      }));
      misiones.push(new Mission({
        colorID:0x9b9692, t:'Dale gas', 'd':'Objetivo: Derrotar los tarifazos al Gas'
      }));
      misiones.push(new Mission({
        colorID:0x00a457, t:'FMI - World', 'd':'Objetivo: Recuperar los dólares de las garras de los buitres'
      }));
      misiones.push(new Mission({
        colorID:0xffb100, t:'Globo City', 'd':'Objetivo: Pinchar todos los globos de Durán Barba'
      }));

      this.escena.create = function(){
        o.texts.t = this.add.text(-225, -150).setScrollFactor(0).setFontSize(30).setColor('#ffffff');
        o.texts.t.depth = 40000;
        o.texts.t.fontWeight = 'bold';
        o.texts.d = this.add.text(-225, -120).setScrollFactor(0).setFontSize(25).setColor('#ddddff');
        o.texts.d.depth = 40000;

        this.input.setDefaultCursor('url(./img/point.png), pointer');
        this.input.addPointer(1);

        let mapConfig  = {
          "tiles_x":480,
          "tiles_y":480,
          "tiles_z":1,
          "chunk_t":64
        };
        let GM         = new GeneradorMapa(mapConfig);
        GM.generarTerreno(misiones);
        this.isometric = new IsometricWorld(e,'tiles', GM.getMapa(), o.tile_den, o);

        this.prota = new Jugador({ 'escena':e, 'vel_desp':1.275, 'mundo':this.isometric, 'x':mapConfig.tiles_x/2, 'y':mapConfig.tiles_y/2 });
        this.prota.z = 1;

        this.items = new Item({ 'escena':e, 'mundo':this.isometric });
      }

      this.escena.update = function(){
        if (o.mission != -1){
          o.texts.t.setText([o.mission.name]);
          o.texts.d.setText([o.mission.description]);
        }

        this.prota.update(this);
      }

      this.game = new Phaser.Game(this.config);
    }

    setMissionInfo(m){
      this.mission = m;
    }
}
