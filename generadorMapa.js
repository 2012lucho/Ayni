
class GeneradorMapa {

  constructor(cfg){
    this.config = cfg;
    this.mapa   = new Mapa(this.config);
  }

  generarPlanicie(){
    for (let px=0;px<this.config.tiles_x;px++){
      this.mapa.data.push([]);
      for (let py=0;py<this.config.tiles_y;py++){
        this.mapa.data[px].push([]);
        this.mapa.data[px][py] = [0,0,-1,[ ]];
      }
    }
  }

  //se generan paredes alrededor del Mapa
  generarLimites(){
    let alto = 5;
    for (let c1=1; c1<alto; c1++){
        this.newLinea(c1, 1,1, 1,128 ,1, 16, 12);
        this.newLinea(c1, 1,1, 128,1 ,1, 16, 12);
        this.newLinea(c1, 127,1, 127,127 ,1, 16, 12);
        this.newLinea(c1, 1,127, 127,127 ,1, 16, 12);
    }
  }

  //por ahora se genera una grilla
  generarCalles(){
    let sep = 40;
    let anc = 4;
    let pz  = 0;
    for(let c =1;c<this.config.tiles_x; c+=sep){
        this.newLinea(pz, c,1, c,128 ,anc,16, 12);
        this.newLinea(pz, 1,c, 128,c ,anc,16, 12);
    }
  }

  newLinea(z,x_i,y_i,x_f,y_f,anc,t,r){
    let largo = Math.sqrt( x_f - x_i + y_f - y_i );
    let inc_x = (x_f - x_i)/largo/r;
    let inc_y = (y_f - y_i)/largo/r;
    let x = x_f;
    let y = y_f;

    while (x >= 0 && y >= 0){

      for (let c=0; c<anc;c++){
        if (this.enMapa(z,Math.ceil(x+c), Math.ceil(y-c) )){
          if (z==0){
            this.mapa.data[Math.ceil(x+c)][Math.ceil(y-c)] = [t,0,-1,[]];
          } else {
            this.mapa.data[Math.ceil(x+c)][Math.ceil(y-c)][3].push([t,z,-1]);
          }
        }
      }
      x -= inc_x; y -= inc_y;
    }
  }

  enMapa(pz,px,py){
    if (px<0 || py<0 || px>=this.config.tiles_x || py>=this.config.tiles_y){
      return false;
    }
    return true;
  }

  generarTerreno(){
    this.generarPlanicie();
    this.generarCalles();
    this.generarLimites();
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
