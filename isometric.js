
class IsometricWorld{
  constructor(e,i,m,td, es){
    this.escena     = e;
    this.sprite_img = i;
    this.sprite_map = m;
    this.tile_den   = td;
    this.mundo      = es;

    this.config = {
      "tile_W": 64,
      "tile_H": 64,

      "map_long_x": m.config.tiles_x,
      "map_long_y": m.config.tiles_y,
    };

    this.screen_x  = es.config.scale.width;
    this.screen_y  = es.config.scale.height;
    this.screen_sc = es.config.scale.app_scale;
    this.zoom      = es.config.scale.app_scale;

    this.tiles   = [];
    this.tileID  = 0;
    this.cant_t  = 0;
    this.cant_px = Math.floor(this.screen_x/(this.config.tile_W * this.zoom/2));
    this.cant_py = Math.floor(this.screen_y/(this.config.tile_H * this.zoom/4));

    this.cam_px   = 2;
    this.cam_py   = 2;
    this.cam_pz   = 0;
    this.cam_alt  = 2;

    this.camera = this.escena.cameras.main;
    this.chunk  = {
      'cache':[ [[],[],[]], [[],[],[]], [[],[],[]] ],
      'cache_ck':[ [{'x':-1,'y':-1},{'x':-1,'y':-1},{'x':-1,'y':-1}], [{'x':-1,'y':-1},{'x':-1,'y':-1},{'x':-1,'y':-1}], [{'x':-1,'y':-1},{'x':-1,'y':-1},{'x':-1,'y':-1}] ],
      'ckX':0,'ckY':0,'update':true
    };

    this.draw();
  }

  draw(){

    //se determina la cantidad de tiles que entran en la pantalla
    this.cant_py = Math.floor(this.screen_y/(this.config.tile_H * this.zoom/4));
    this.cant_px = Math.floor(this.screen_x/(this.config.tile_W * this.zoom/2));

    //se obtiene el chunk actual
    this.chunk.ckX = ( this.cam_px )/this.sprite_map.config.chunk_t;
    this.chunk.ckY = ( this.cam_py )/this.sprite_map.config.chunk_t;
    this.updateChunkCache();

    //se determina la posicion inicial "mapear"
    let px_i = Math.floor(this.cam_px);
    let py_i = Math.floor(this.cam_py);

    //Se posiciona la camara
    //let dx = this.cam_px - Math.floor(this.cam_px); let dy = this.cam_py - Math.floor(this.cam_py); // parte decimal
    //this.camera.scrollX = (px_i + dx - py_i - dy) * ((this.config.tile_W)/2) - this.screen_x*this.zoom/2;
  //  this.camera.scrollY = (px_i + dx + py_i + dy) * ((this.config.tile_H)/3.555) - this.screen_y*this.zoom/2;// - this.cam_pz*((this.config.tile_H)/2.5);
    this.camera.zoom    = this.zoom;

    px_i = px_i - this.cant_px/2 - this.cant_py/4; py_i =py_i + this.cant_px/2 - this.cant_py/4;
    let px_fin = px_i + this.cant_py+5; let py_fin = py_i + this.cant_px+5;
    //Se dibuja
    this.drawTiles(this.cant_py,px_fin,px_i,py_i,0);//"par"
    this.drawTiles(this.cant_py,px_fin,px_i+1,py_i,0);//"impar"
  }

  updateChunkCache(){
    let actualiza = false;
    //se actualiza si en la cache la posicion actual no esta en el centro
    if ( !(this.chunk.cache_ck[1][1].x == Math.floor(this.chunk.ckX) && this.chunk.cache_ck[1][1].y == Math.floor(this.chunk.ckY) ) ){
      actualiza = true;
    }

    if (actualiza){
      let ckc = this.chunk.cache_ck;
      let ckh = this.chunk.cache;
      //se limpia
      for (let c=0; c<this.tiles.length; c++){
          this.tiles[c].tileObj.destroy();
          this.tiles[c].tileObj = -1;
      }
      this.tiles=[];
      this.tileID=0;

      //se actualiza
      let x = Math.floor(this.chunk.ckX); let y = Math.floor(this.chunk.ckY);
      if ( this.chunkInMapa(x-1,y-1) ) { ckh[0][0] = this.sprite_map.getChunk( x-1 ,y-1 ); ckc[0][0] = {'x':x-1,'y':y-1}; }
      if ( this.chunkInMapa(x  ,y-1) ) { ckh[0][1] = this.sprite_map.getChunk( x   ,y-1 ); ckc[0][1] = {'x':x  ,'y':y-1}; }
      if ( this.chunkInMapa(x+1,y-1) ) { ckh[0][2] = this.sprite_map.getChunk( x+1 ,y-1 ); ckc[0][2] = {'x':x+1,'y':y-1}; }

      if ( this.chunkInMapa(x-1,y  ) ) { ckh[1][0] = this.sprite_map.getChunk( x-1 ,y );   ckc[1][0] = {'x':x-1,'y':y}; }
      if ( this.chunkInMapa(x  ,y  ) ) { ckh[1][1] = this.sprite_map.getChunk( x   ,y );   ckc[1][1] = {'x':x  ,'y':y}; }
      if ( this.chunkInMapa(x+1,y  ) ) { ckh[1][2] = this.sprite_map.getChunk( x+1 ,y );   ckc[1][2] = {'x':x+1,'y':y}; }

      if ( this.chunkInMapa(x-1,y+1) ) { ckh[2][0] = this.sprite_map.getChunk( x-1 ,y+1 ); ckc[2][0] = {'x':x-1,'y':y+1}; }
      if ( this.chunkInMapa(x  ,y+1) ) { ckh[2][1] = this.sprite_map.getChunk( x   ,y+1 ); ckc[2][1] = {'x':x  ,'y':y+1}; }
      if ( this.chunkInMapa(x+1,y+1) ) { ckh[2][2] = this.sprite_map.getChunk( x+1 ,y+1 ); ckc[2][2] = {'x':x+1,'y':y+1}; }
      actualiza = false;
    }
  }

  getTileData(x,y){
    x = Math.floor(x); y = Math.floor(y);
    if (!this.enMapa(x,y) ){ return -1;  }
    let ckc = this.chunk.cache_ck;

    for (let c=0; c<ckc.length; c++){
      for (let j=0; j<ckc[c].length; j++){
        let x_i = ckc[c][j].x * this.sprite_map.config.chunk_t;
        let y_i = ckc[c][j].y * this.sprite_map.config.chunk_t;
        let x_l = x_i + this.sprite_map.config.chunk_t;
        let y_l = y_i + this.sprite_map.config.chunk_t;

        if (this.chunk.cache[c][j].length != 0 && x>=x_i && y>=y_i && x<=x_l && y<=y_l){
          let px  = (x-1)%this.sprite_map.config.chunk_t;
          let py  = (y-1)%this.sprite_map.config.chunk_t;
          if (this.chunk.cache[c][j][px] == undefined) { return -1; }
          if (this.chunk.cache[c][j][px][py] == undefined) { return -1; }
          return this.chunk.cache[c][j][px][py];
        }
      }
    }

    return -1;
  }

  chunkInMapa(x,y){
    if ( x < 0 || y < 0 || x > this.sprite_map.chunks.cantX || y > this.sprite_map.chunks.cantY ){ return false; } return true;
  }

  drawTiles(cant_py,px_fin,px_i,py_i,z){
    //se agregan los tiles visibles
    for (let c1=0; c1<=cant_py; c1++){
      let py = py_i;
      for (let px = px_i;px<=px_fin;px++){
        py += 1;
        let td = this.getTileData(px,py);
        if ( td != -1 ){
          //creamos un nuevo tile en caso que no exista
          if(td.tileObj === -1 && !td.hole){
            td.tileObj = new Tile(this.escena,px,py,z,td,this);
            this.tiles[this.tileID] = td;
            this.tileID ++;
          }
          //si en esta posicion hay mas tiles, los recorremos
          for (let c3=0; c3< td.tileCont.length; c3++){
            if (td.tileCont[c3].tileObj === -1 && !td.tileCont[c3].hole){
              td.tileCont[c3].tileObj = new Tile(this.escena,px,py,z,td.tileCont[c3],this);
              this.tiles[this.tileID] = td.tileCont[c3];
              this.tileID ++;
            }
            //de acuerdo a la posicion de la camara se decide si el tile se muestra o no
            // en caso de que este dentro de una construccion
            if(!td.tileCont[c3].hole) { td.tileCont[c3].tileObj.setVisible( !this.enConstruccion(td.tileCont[c3].z) ); }
          }
          //obtenemos los datos de la zona en la que se esta parado
          if ( Math.floor(px)==Math.floor(this.cam_px) && Math.floor(py)==Math.floor(this.cam_py)){
            this.mundo.setMissionInfo(td.mission);
          }
        }
      }
      px_i += 1;
      py_i -= 1;
    }
  }

  enConstruccion(zt){
    let x = Math.floor(this.cam_px+1);
    let y = Math.floor(this.cam_py+1);
    let z = Math.floor(this.cam_pz);

    let td = this.getTileData(x,y);
    if (td == -1) { return false; }

    if (td.construct == false){ return false;  }
    if (td.construct.inLimits(x,y,z) && zt > this.cam_pz+this.cam_alt){  return true;   }

    return false;
  }

  enMapa(px,py){
    if (px>0 && px<this.sprite_map.config.tiles_x && py>0 && py<this.sprite_map.config.tiles_y){
      return true;
    }
    return false;
  }

  update(){
    this.draw();
  }

  reemplazeTile(){

  }
}

class Tile{
  constructor(e,x,y,z,tile,c){
    this.escena = e;
    this.x      = x;
    this.y      = y;
    this.z      = z;
    this.tile   = tile;
    this.p      = c;

    this.px     = 0; //coordenas en pantalla
    this.py     = 0;
    this.sprite = '';

    if (this.tile.length != 0){
      this.z = this.tile.z;
    }
    this.p.cant_t ++;
    this.draw();
  }

  draw(){
    this.calcPosition();

    this.pintar();
  }

  calcPosition(){
    this.px = (this.x - this.y) * ((this.p.config.tile_W)/2);
    this.py = (this.x + this.y) * ((this.p.config.tile_H)/3.555) - this.z*((this.p.config.tile_H)/2.5);
  }

  pintar(){
    //pintamos si hay datos
    if (this.tile.length == 0){
      return false;
    }

    if (this.sprite == ''){
      this.sprite = this.escena.add.image(this.px,this.py, this.p.tile_den[this.tile.img].den);
      if (this.tile.tint != -1){ this.sprite.setTint(this.tile.tint); }
    }

    if(this.sprite != ''){
      this.sprite.x     = this.px;
      this.sprite.y     = this.py;
      this.sprite.depth = this.z*this.p.screen_y+this.py;
    }
  }

  setVisible(v){
    if (this.sprite){
      this.sprite.visible = v;
    }
  }

  destroy(){
    if (this.sprite){
      this.sprite.destroy();
      this.sprite = undefined;
      this.p.cant_t --;
    }
  }
}
