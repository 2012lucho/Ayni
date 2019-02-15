class Mapa {
  constructor(cfg){
    this.config         = cfg;
    this.data           = [];
    this.construcciones = [];
    this.zonas          = [];
    this.chunks = { 'cantX':cfg.tiles_x/cfg.chunk_t, 'cantY':cfg.tiles_y/cfg.chunk_t };
  }

  registerZone(z){ this.zonas.push(z); }

  registrarConstruc(c){
    this.construcciones.push(c);

    for (let i=0; i <c.constructLimits.length; i++){
      for (let x=c.constructLimits[i].xi; x<c.constructLimits[i].xf; x++){
        for (let y=c.constructLimits[i].yi; y<c.constructLimits[i].yf; y++){
          this.data[x][y].construct = c;
        }
      }
    }
  }

  getChunk(x,y){
    //se recorta una porcion del mapa del tamaño del chunk del mapa principal
    let chunk = [];
    let px_i = x*this.config.chunk_t;
    let py_i = y*this.config.chunk_t;

    for (let px=0;px<this.config.chunk_t && (px+px_i) < this.config.tiles_x; px++ ){
      chunk.push([]);
      for (let py=0; py < this.config.chunk_t && (py+py_i) < this.config.tiles_y;py++ ){
        chunk[px].push([]);
        chunk[px][py] = this.data[px+px_i][py+py_i];
      }
    }
    return chunk;
  }

  update(){
    for (let c=0; c<this.zonas.length; c++){
      this.zonas[c].update();
    }
  }
}

class MapTileData {
  constructor(p){
    this.img       = p.img;
    this.z         = p.z;
    this.tileObj   = p.tileObj;
    this.tileCont  = p.tileCont;
    this.construct = false;
    this.hole      = false;
    this.tint      = p.tint;
    this.h         = 1;
    this.Zone   = p.Zone;
    if(p.hole){ this.hole = true; }
  }
}
