
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
        this.newLine(c1, 1,1, 1,this.mapa.config.tiles_y ,1, 1);
        this.newLine(c1, 1,1, this.mapa.config.tiles_x,1 ,1, 1);
        this.newLine(c1, this.mapa.config.tiles_x,1, this.mapa.config.tiles_x,this.mapa.config.tiles_y ,1, 1);
        this.newLine(c1, 1,this.mapa.config.tiles_y, this.mapa.config.tiles_x,this.mapa.config.tiles_y ,1, 1);
    }
  }

  newEdificio(p){
    let c       = new Construccion(this);
    c.map       = this.mapa;
    //habitaciones
    c.addRoom( new Room(this,{h:p.h, xi:p.x,yi:p.y, xf:p.x+16,yf:p.y+6}) );
    c.addRoom( new Room(this,{h:p.h-2, xi:p.x+8,yi:p.y+7, xf:p.x+16,yf:p.y+16}) );
    c.addRoom( new Room(this,{h:p.h-2, xi:p.x,yi:p.y+7, xf:p.x+4,yf:p.y+9}) );
    c.addRoom( new Room(this,{h:p.h-2, xi:p.x+5,yi:p.y+7, xf:p.x+7,yf:p.y+9}) );
    c.addRoom( new Room(this,{h:p.h-2, xi:p.x,yi:p.y+10, xf:p.x+7,yf:p.y+16}) );
    //aberturas
    c.addHole({zi:1,zf:6, xi:p.x+11,yi:p.y+16, xf:p.x+14,yf:p.y+16}); //puertas
    c.addHole({zi:1,zf:4, xi:p.x+14,yi:p.y+6, xf:p.x+15,yf:p.y+7});
    c.addHole({zi:1,zf:4, xi:p.x+5,yi:p.y+16, xf:p.x+6,yf:p.y+16});
    c.addHole({zi:1,zf:4, xi:p.x+6,yi:p.y+6, xf:p.x+6,yf:p.y+7});
    c.addHole({zi:1,zf:4, xi:p.x+6,yi:p.y+9, xf:p.x+6,yf:p.y+10});
    c.addHole({zi:1,zf:4, xi:p.x+4,yi:p.y+8, xf:p.x+5,yf:p.y+8});
    //ventanas
    c.addHole({zi:7,zf:7, xi:p.x+16,yi:p.y+2, xf:p.x+16,yf:p.y+3});
    c.addHole({zi:6,zf:6, xi:p.x+16,yi:p.y+9, xf:p.x+16,yf:p.y+10});
    c.addHole({zi:6,zf:6, xi:p.x+16,yi:p.y+13, xf:p.x+16,yf:p.y+14});
    c.addHole({zi:2,zf:4, xi:p.x+1,yi:p.y+16, xf:p.x+3,yf:p.y+16});

    c.generate();
    this.mapa.registrarConstruc(c);
  }

  //por ahora se genera una grilla
  generarCalles(){
    let sep = 40;
    let anc = 4;
    let pz  = 0;
    for(let c =1;c<this.config.tiles_x; c+=sep){
        this.newLine(pz, c,1, c,128 ,anc,1);
        this.newLine(pz, 1,c, 128,c ,anc,1);
    }
  }

  newHoleCube(p){
    let ls = 2000; //limite superficie
    for (let x=p.xi; x<=p.xf && ls>0; x++){
      for(let y=p.yi; y<=p.yf && ls>0; y++){
        for (let z=p.zi; z<=p.zf && ls>0; z++){
          this.removeTile(x,y,z);
          ls--;
        }
      }
    }
  }

  newRect(z, x_i,y_i, x_f,y_f, t){
    let i_x = 1; let i_y = 1;
    if (x_i > x_f ) { i_x=-1; }
    if (y_i > y_f ) { i_y=-1; }
    let tc =0;

    for (let x=x_i;x != x_f  && tc<2000; x+=i_x){
        for( let y=y_i; y != y_f && tc<2000; y+=i_y){
            this.insertaBloque(x,y,z,t);
            tc++;
        }
    }
  }

  removeTile(x,y,z){
    if(!this.enMapa(z,Math.ceil(x), Math.ceil(y) )){ return false; }
    let arrT = this.mapa.data[Math.ceil(x)][Math.ceil(y)].tileCont;
    for (let c=0; c<arrT.length; c++){
      if ( arrT[c].z == z ){
        arrT[c] = new MapTileData({ 'hole':true, 'img':-1, 'z':z, 'tileObj':1, 'tileCont':[] });
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

  newLine(z,x_i,y_i,x_f,y_f,anc,t){
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
    this.newEdificio({x:10,y:10,h:10});
  }

  getMapa(){
    return this.mapa;
  }
}
