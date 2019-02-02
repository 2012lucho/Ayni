
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
        this.mapa.data[px][py] = new MapTileData({ 'img':0, 'z':0, 'tileObj':-1, 'tileCont':[] });
      }
    }
  }

  //se generan paredes alrededor del Mapa
  generarLimites(){
    let alto = 5;
    for (let c1=1; c1<alto; c1++){
        this.newLinea(c1, 1,1, 1,this.mapa.config.tiles_y ,1, 1);
        this.newLinea(c1, 1,1, this.mapa.config.tiles_x,1 ,1, 1);
        this.newLinea(c1, this.mapa.config.tiles_x,1, this.mapa.config.tiles_x,this.mapa.config.tiles_y ,1, 1);
        this.newLinea(c1, 1,this.mapa.config.tiles_y, this.mapa.config.tiles_x,this.mapa.config.tiles_y ,1, 1);
    }
  }

  //por ahora se genera una grilla
  generarCalles(){
    let sep = 40;
    let anc = 4;
    let pz  = 0;
    for(let c =1;c<this.config.tiles_x; c+=sep){
        this.newLinea(pz, c,1, c,128 ,anc,1);
        this.newLinea(pz, 1,c, 128,c ,anc,1);
    }
  }

  //generar fabrica
  generarFabrica(x,y){
    let c = new Construccion();
    c.setLimits({'xi':x,'yi':y, 'xf':x+17,'yf':y+14});
    this.mapa.registrarConstruc(c);

    //techo
    this.newRectangulo(0, x,y ,x+17,y+14, 10);
    //piso
    this.newRectangulo(6, x,y ,x+17,y+14, 11);

    //pared sobre aperturas
    this.newLinea(5, x+1,y+13, x+16,y+13 ,1 ,8);
    this.newLinea(4, x+1,y+13, x+6,y+13 ,1 ,8);
    for (let c=4;c<6;c++){
      this.newLinea(c, x+1,y+6, x+16,y+6 ,1 ,3);

    }
    //paredes
    for (let c=1;c<6;c++){
      //eje X
      this.newLinea(c, x,y, x,y ,1 ,4);

      this.newLinea(c, x+1,y, x+16,y ,1 ,3);this.newLinea(c, x+16,y, x+16,y ,1 ,5);

      this.newLinea(c, x+6,y+6, x+6,y+6 ,1 ,3);
      this.newLinea(c, x+8,y+6, x+13,y+6 ,1 ,3);

      this.newLinea(c, x+1,y+9, x+6,y+9 ,1 ,3);this.newLinea(c, x+8,y+9, x+8,y+9 ,1 ,3);
      this.newLinea(c, x+1,y+6, x+6,y+6 ,1 ,3);

      this.newLinea(c, x+1,y+13, x+3,y+13 ,1 ,8);
      this.newLinea(c, x+5,y+13, x+11,y+13 ,1 ,8);

      this.newLinea(c, x+15,y+13, x+15,y+13 ,1 ,8);
      //Eje Y
      this.newLinea(c, x,y+1, x,y+13 ,1 ,2);
      this.newLinea(c, x+16,y+1, x+16,y+13 ,1 ,6);
      this.newLinea(c, x+9,y+7, x+9,y+13 ,1 ,2);

      this.newLinea(c, x+16,y+13, x+16,y+13 ,1 ,7);
      this.newLinea(c, x,y+13, x,y+13 ,1 ,9);

      this.newLinea(c, x,y+6, x,y+6 ,1 ,4);
      this.newLinea(c, x,y+9, x,y+9 ,1 ,4);
      this.newLinea(c, x+9,y+6, x+9,y+6 ,1 ,4);
      this.newLinea(c, x+16,y+6, x+16,y+6 ,1 ,5);
      this.newLinea(c, x+5,y+6, x+5,y+6 ,1 ,5);
      this.newLinea(c, x+5,y+8, x+5,y+8 ,1 ,7);
      this.newLinea(c, x+9,y+13, x+9,y+13 ,1 ,9);
    }


  }

  newRectangulo(z, x_i,y_i, x_f,y_f, t){

    for (let x=x_i;x<x_f; x++){
        for( let y=y_i; y<y_f; y++){
            this.insertaBloque(x,y,z,t);
        }
    }
  }

  insertaBloque(x,y,z,t){
    if (this.enMapa(z,Math.ceil(x), Math.ceil(y) )){
      if (z==0){
        let dCT = this.mapa.data[Math.ceil(x)][Math.ceil(y)].construct;
        if(this.mapa.data[Math.ceil(x)][Math.ceil(y)].tileObj != -1){
          this.mapa.data[Math.ceil(x)][Math.ceil(y)].tileObj.destroy();
        }
        this.mapa.data[Math.ceil(x)][Math.ceil(y)] = new MapTileData({ 'img':t, 'z':z, 'tileObj':-1, 'tileCont':[] });
        this.mapa.data[Math.ceil(x)][Math.ceil(y)].construct = dCT; //que no se pierdan los datos del tile
      } else {
        //si hay algunn bloque en la misma posicion z, lo reemplazamos
        let encontrado = false;
        for (let c=0; c<this.mapa.data[Math.ceil(x)][Math.ceil(y)].tileObj.length; c++){
          if ( this.mapa.data[Math.ceil(x)][Math.ceil(y)].tileObj[c].z == z ){
            if(this.mapa.data[Math.ceil(x)][Math.ceil(y)].tileObj[c].tileObj != -1){
              this.mapa.data[Math.ceil(x)][Math.ceil(y)].tileObj[c].tileObj.destroy();
              this.mapa.data[Math.ceil(x)][Math.ceil(y)].tileObj[c] = new MapTileData({ 'img':t, 'z':z, 'tileObj':-1, 'tileCont':[] });
            }
          }
        }
        if (!encontrado) { this.mapa.data[Math.ceil(x)][Math.ceil(y)].tileCont.push( new MapTileData({ 'img':t, 'z':z, 'tileObj':-1, 'tileCont':[] }) ); }
      }
    }
  }

  newLinea(z,x_i,y_i,x_f,y_f,anc,t){
    let a_x,a_y = false;
    let x = x_i;
    let y = y_i;
    while ( !(a_x && a_y) ){

      for (let c=0; c<anc;c++){
        if (this.enMapa(z,Math.ceil(x+c), Math.ceil(y-c) )){
          this.insertaBloque(x,y,z,t);
        }
      }
      if ( x < x_f  ) { x++; }
      if ( x == x_f ) { a_x=true; }
      if ( x > x_f  ) { x--; }
      if ( y < y_f  ) { y++; }
      if ( y == y_f ) { a_y=true; }
      if ( y > y_f  ) { y--; }
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
    this.generarFabrica(4,4);
  }

  getMapa(){
    return this.mapa;
  }
}
