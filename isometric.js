
class IsometricWorld{
  constructor(e,i, es){
    this.escena     = e;
    this.sprite_img = i;
    this.sprite_map = -1;
    this.mundo      = es;

    this.config = {
      "tile_W": 64, "tile_H": 64,

      "map_long_x": 0, "map_long_y": 0,
    };

    this.screen_x  = es.config.scale.width;
    this.screen_y  = es.config.scale.height;
    this.screen_sc = es.config.scale.app_scale;
    this.zoom      = 1;//es.config.scale.app_scale;

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
    this.frames = this.escena.textures.get('isoblocks').getFrameNames();
  }

  setMap(m){
    this.sprite_map = m;
    this.config.map_long_x = m.config.tiles_x; this.config.map_long_y = m.config.tiles_y;
    this.draw();
  }

  draw(){

    //se determina la cantidad de tiles que entran en la pantalla
    this.cant_py = Math.floor(this.screen_y/(this.config.tile_H * this.zoom/4));
    this.cant_px = Math.floor(this.screen_x/(this.config.tile_W * this.zoom/2));

    //se determina la posicion inicial "mapear"
    let px_i = Math.floor(this.cam_px);
    let py_i = Math.floor(this.cam_py);

    this.camera.zoom    = this.zoom;

    px_i = px_i - this.cant_px/2 - this.cant_py/4; py_i =py_i + this.cant_px/2 - this.cant_py/4;
    let px_fin = px_i + this.cant_py+5; let py_fin = py_i + this.cant_px+5;
    //Se dibuja
    this.drawTiles(this.cant_py,px_fin,px_i,py_i,0);//"par"
    this.drawTiles(this.cant_py,px_fin,px_i+1,py_i,0);//"impar"
  }

  getTileData(x,y){
    x = Math.floor(x); y = Math.floor(y);
    if (!this.enMapa(x,y) ){ return -1;  }

    return this.sprite_map.data[x][y];
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
            //this.mundo.setZoneInfo(td.Zone);
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
    if (px>0 && px<this.sprite_map.config.tiles_x && py>0 && py<this.sprite_map.config.tiles_y){ return true; }
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
      this.sprite = this.escena.add.image(this.px,this.py, 'isoblocks',this.tile.img);
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
