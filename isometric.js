
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

      "map_long_x": 16,
      "map_long_y": 16,
    };

    this.cam_px   = 0.5;
    this.cam_py   = 0.5;
    this.zoom     = 1;
    this.max_dist = 15;

    this.screen_x = 800;
    this.screen_y = 600;

    this.tiles    = [];
    this.cant_t = 0;
    this.draw();
  }

  draw(){
    //eliminamos todos los tiles para no sobrecargar
    for(let c=0;c<this.tiles.length;c++){
      if(this.tiles[c]){
        this.tiles[c].destroy();
        this.tiles[c] = null;
      }
    }
    this.cant_t=0;

    //se comprueba quecam_px y cam_py no se vayan muy lejos del mape
    if(this.cam_px>this.config.map_long_x+this.max_dist){ this.cam_px = this.config.map_long_x+this.max_dist; }
    if(this.cam_py>this.config.map_long_y+this.max_dist){ this.cam_py = this.config.map_long_y+this.max_dist; }
    if(this.cam_px<-this.max_dist){ this.cam_px = -this.max_dist; }
    if(this.cam_py<-this.max_dist){ this.cam_py = -this.max_dist; }

    //se determina la cantidad de tiles que entran en la pantalla
    let cant_py = Math.floor(this.screen_y/(this.config.tile_H * this.zoom/4));
    let cant_px = Math.floor(this.screen_x/(this.config.tile_W * this.zoom/2));

    //se determina la posicion inicial y final a "mapear"
    let px_i = this.cam_px; let px_fin = px_i + cant_py;
    let py_i = this.cam_py; let py_fin = py_i + cant_px;

    //Se dibujan todas las capas, empezando de la de mas abajo
    for(let c=0;c<this.sprite_map.length; c++){
      this.drawTiles(cant_px,px_fin,px_i,py_i,c,this.sprite_map[c]);//"par"
      this.drawTiles(cant_px,px_fin,px_i+1,py_i,c,this.sprite_map[c]);//"impar"
    }
  }

  drawTiles(cant_px,px_fin,px_i,py_i,z,mapa){
    for (let c1=0; c1<cant_px; c1++){
      let py = py_i;
      for (let px = px_i;px<px_fin;px++){
        py += 1;
        if (px>0 && px<this.config.map_long_x && py>0 && py<this.config.map_long_y){
          this.tiles[this.cant_t] = new Tile(this.escena,px,py,z,mapa[Math.floor(px)][Math.floor(py)],this);
          this.cant_t++;
        }
      }
      px_i += 1;
      py_i -= 1;
    }
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
    this.x      = x-c.cam_px + Math.floor(c.cam_px)-c.cam_px; //a las coordenadas reales les restmos las de la esquina que estamos viendo
    this.y      = y-c.cam_py + Math.floor(c.cam_py)-c.cam_py; // y le agregamos la parte decimal para un movimiento fluido
    this.z      = z;
    this.tile   = tile;
    this.p      = c;

    this.px     = 0; //coordenas en pantalla
    this.py     = 0;
    this.sprite = '';

    if (this.tile.length != 0){
      this.z += this.tile[1];
    }

    this.draw();
  }

  draw(){
    this.calcPosition();

    this.pintar();
  }

  calcPosition(){
    this.px = (this.x - this.y) * ((this.p.config.tile_W * this.p.zoom)/2);
    this.py = (this.x + this.y) * ((this.p.config.tile_H * this.p.zoom)/3.5) - this.z*((this.p.config.tile_H * this.p.zoom)/2.5);
  }

  pintar(){
    //pintamos si hay datos
    if (this.tile.length == 0){
      return false;
    }

    if (this.sprite == ''){
      this.sprite = this.escena.add.image(this.px,this.py, this.p.tile_den[this.tile[0]]);
      this.sprite.depth = this.py;
      this.sprite.setScale(this.p.zoom);
    }

    if(this.sprite != ''){
      this.sprite.visible = this.visible();
      this.sprite.x     = this.px;
      this.sprite.y     = this.py;
      this.sprite.depth = this.py+this.py*this.z;
      this.sprite.setScale(this.p.zoom);
    }
  }

  visible(){
    //evaluamos si el tile sera o no visible
    if (this.px > this.p.screen_x + this.p.config.tile_W * this.p.zoom ||
        this.py > this.p.screen_y + this.p.config.tile_H * this.p.zoom ||
        this.px < -this.p.config.tile_W * this.p.zoom ||
        this.py < -this.p.config.tile_H * this.p.zoom){
      return false;
    }

    return true;
  }

  destroy(){
    if (this.sprite != ''){
      this.sprite.destroy();
      this.sprite.visible = false;
      this.sprite = undefined;
    }
  }
}
