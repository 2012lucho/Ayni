
class IsometricWorld{
  constructor(e,i,m,td){
    this.escena     = e;
    this.sprite_img = i;
    this.sprite_map = m;
    this.tile_den   = td;

    this.config = {
      "sprite_img_H": 1024,
      "sprite_img_W": 772,
      "tile_W": 128,
      "tile_H": 128,

      "map_long_x": m.config.tiles_x,
      "map_long_y": m.config.tiles_y,
    };

    this.cam_px   = 64;
    this.cam_py   = 64;
    this.cam_pz   = 0;
    this.zoom     = 0.5;
    this.max_dist = 15;

    this.screen_x = 1024;
    this.screen_y = 768;

    this.tiles  = [];
    this.cant_t = 0;

    this.camera = this.escena.cameras.main;
    this.draw();
  }

  draw(){
    //se comprueba quecam_px y cam_py no se vayan muy lejos del mape
    if(this.cam_px>this.config.map_long_x+this.max_dist){ this.cam_px = this.config.map_long_x+this.max_dist; }
    if(this.cam_py>this.config.map_long_y+this.max_dist){ this.cam_py = this.config.map_long_y+this.max_dist; }
    if(this.cam_px<-this.max_dist){ this.cam_px = -this.max_dist; }
    if(this.cam_py<-this.max_dist){ this.cam_py = -this.max_dist; }

    //se determina la cantidad de tiles que entran en la pantalla
    let cant_py = Math.floor(this.screen_y/(this.config.tile_H/4));
    let cant_px = Math.floor(this.screen_x/(this.config.tile_W/2));

    //se determina la posicion inicial y final a "mapear"
    let px_i = Math.floor(this.cam_px); let px_fin = px_i + cant_py;
    let py_i = Math.floor(this.cam_py); let py_fin = py_i + cant_px;

    //Se posiciona la camara
    let dx = this.cam_px - Math.floor(this.cam_px); let dy = this.cam_py - Math.floor(this.cam_py); // parte decimal
    this.camera.scrollX = (px_i + dx - py_i - dy) * ((this.config.tile_W)/2);
    this.camera.scrollY = (px_i + dx + py_i + dy) * ((this.config.tile_H)/3.555) - this.cam_pz*((this.config.tile_H)/2.5);
    this.camera.zoom    = this.zoom;

    //Se dibujan todas las capas, empezando de la de mas abajo
    for(let c=0;c<this.sprite_map.data.length; c++){
      this.drawTiles(cant_py,px_fin,px_i,py_i,c,this.sprite_map.data[c]);//"par"
      this.drawTiles(cant_py,px_fin,px_i+1,py_i,c,this.sprite_map.data[c]);//"impar"
    }
  }

  drawTiles(cant_py,px_fin,px_i,py_i,z,mapa){
    //se agregan los tiles visibles
    for (let c1=0; c1<=cant_py; c1++){
      let py = py_i;
      for (let px = px_i;px<=px_fin;px++){
        py += 1;
        if ( this.enMapa(px,py) ){
          //creamos un nuevo tile en caso que no exista
          if(this.sprite_map.data[z][px][py][2] === -1){
            this.sprite_map.data[z][px][py][2] = new Tile(this.escena,px,py,z,mapa[px][py],this);
          }
        }
      }
      px_i += 1;
      py_i -= 1;
    }
  }

  enMapa(px,py){
    if (px>0 && px<this.config.map_long_x && py>0 && py<this.config.map_long_y){
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
      this.z += this.tile[1];
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
      this.sprite = this.escena.add.image(this.px,this.py, this.p.tile_den[this.tile[0]].den);
      this.sprite.depth = this.py;
    }

    if(this.sprite != ''){
      this.sprite.x     = this.px;
      this.sprite.y     = this.py;
      this.sprite.depth = this.py+this.py*this.z;
    }
  }

  destroy(){
    if (this.sprite != ''){
      this.sprite.destroy();
      this.sprite = undefined;
      this.p.cant_t --;
    }
  }
}
