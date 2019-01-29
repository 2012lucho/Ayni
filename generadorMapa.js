
class GeneradorMapa {

  constructor(cfg){
    this.config = cfg;
    this.mapa   = new Mapa(this.config);
  }

  generarPlanicie(){
    let pz = 0;
    this.mapa.data.push([]);
    for (let px=0;px<this.config.tiles_x;px++){
      this.mapa.data[pz].push([]);
      for (let py=0;py<this.config.tiles_y;py++){
        this.mapa.data[pz][px].push([]);
        this.mapa.data[pz][px][py] = [0,0,-1];
      }
    }
  }

  generarCalles(){

  }

  generarTerreno(){
    this.generarPlanicie();
  }

  getMapa(){
    return this.mapa;
  }

  getSubMapa(x,y,t_x,t_y){
    return this.mapa;
  }
}

class Mapa {
  constructor(cfg){
    this.config = cfg;
    this.data   = [];
  }
}
