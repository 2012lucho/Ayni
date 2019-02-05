class Mapa {
  constructor(cfg){
    this.config         = cfg;
    this.data           = [];
    this.construcciones = [];
    this.chunks = { 'cantX':cfg.tiles_x/cfg.chunk_t, 'cantY':cfg.tiles_y/cfg.chunk_t };
  }

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

    for (let px=0;px<this.config.chunk_t; px++ ){
      chunk.push([]);
      for (let py=0; py < this.config.chunk_t;py++ ){
        chunk[px].push([]);
        chunk[px][py] = this.data[px+px_i][py+py_i];
      }
    }
    return chunk;
  }
}

class MapTileData {
  constructor(p){
    this.img       = p.img;
    this.z         = p.z;
    this.tileObj   = p.tileObj;
    this.tileCont  = p.tileCont;
    this.construct = false;
    this.mission   = false;
    this.hole      = false;
    this.tint      = p.tint;
    this.h         = 1;
    if(p.hole){ this.hole = true; }
  }
}
