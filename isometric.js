
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

    this.screen_x = 1024;
    this.screen_y = 768;
    this.zoom     = 0.5;

    this.tiles   = [];
    this.cant_t  = 0;
    this.cant_px = Math.floor(this.screen_x/(this.config.tile_W * this.zoom/2));
    this.cant_py = Math.floor(this.screen_y/(this.config.tile_H * this.zoom/4));

    this.cam_px   = -this.cant_px*0.90;
    this.cam_py   = this.cant_py/4;
    this.cam_pz   = 0;
    this.cam_alt  = 2;

    this.interriorLimit = [];

    this.ct = 0;

    this.camera = this.escena.cameras.main;
    this.draw();
  }

  draw(){

    //se determina la cantidad de tiles que entran en la pantalla
    this.cant_py = Math.floor(this.screen_y/(this.config.tile_H * this.zoom/4));
    this.cant_px = Math.floor(this.screen_x/(this.config.tile_W * this.zoom/2));

    //se determina la posicion inicial y final a "mapear"
    let px_i = Math.floor(this.cam_px); let px_fin = px_i + this.cant_py;
    let py_i = Math.floor(this.cam_py); let py_fin = py_i + this.cant_px;

    //Se posiciona la camara
    let dx = this.cam_px - Math.floor(this.cam_px); let dy = this.cam_py - Math.floor(this.cam_py); // parte decimal
    this.camera.scrollX = (px_i + dx - py_i - dy) * ((this.config.tile_W)/2) + this.cant_px*this.config.tile_W*this.zoom;
    this.camera.scrollY = (px_i + dx + py_i + dy) * ((this.config.tile_H)/3.555) - this.cam_pz*((this.config.tile_H)/2.5) + this.cant_py * this.config.tile_W*this.zoom/7;
    this.camera.zoom    = this.zoom;

    //Se dibuja
    this.drawTiles(this.cant_py,px_fin,px_i,py_i,0,this.sprite_map.data);//"par"
    this.drawTiles(this.cant_py,px_fin,px_i+1,py_i,0,this.sprite_map.data);//"impar"
  }

  drawTiles(cant_py,px_fin,px_i,py_i,z,mapa){
    //se agregan los tiles visibles
    for (let c1=0; c1<=cant_py; c1++){
      let py = py_i;
      for (let px = px_i;px<=px_fin;px++){
        py += 1;
        if ( this.enMapa(px,py) ){
          //creamos un nuevo tile en caso que no exista
          if(this.sprite_map.data[px][py].tileObj === -1){
            this.sprite_map.data[px][py].tileObj = new Tile(this.escena,px,py,z,this.sprite_map.data[px][py],this);
            this.ct++;
          }
          //si en esta posicion hay mas tiles, los recorremos
          for (let c3=0; c3< this.sprite_map.data[px][py].tileCont.length; c3++){
            if (this.sprite_map.data[px][py].tileCont[c3].tileObj === -1){
              this.sprite_map.data[px][py].tileCont[c3].tileObj = new Tile(this.escena,px,py,z,this.sprite_map.data[px][py].tileCont[c3],this);
              this.ct++;
            }
            //de acuerdo a la posicion de la camara se decide si el tile se muestra o no
            // en caso de que este dentro de una construccion
            this.sprite_map.data[px][py].tileCont[c3].tileObj.setVisible( !this.enConstruccion(this.sprite_map.data[px][py].tileCont[c3].z) );
          }

        }
      }
      px_i += 1;
      py_i -= 1;
    }
  }

  enConstruccion(zt){
    let x = Math.floor(this.cam_px+this.cant_px*0.90+1);
    let y = Math.floor(this.cam_py-this.cant_py/4+1);
    let z = Math.floor(this.cam_pz);

    if (!this.enMapa(x,y)) { return false; }
    if (this.sprite_map.data[x][y].construct == false){ return false;  }
    if (this.sprite_map.data[x][y].construct.inLimits(x,y,z) && zt > this.cam_pz+this.cam_alt){  return true;   }

    return false;
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
      this.z += this.tile.z;
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
    }

    if(this.sprite != ''){
      this.sprite.x     = this.px;
      this.sprite.y     = this.py;
      this.sprite.depth = this.z*this.p.config.sprite_img_W+this.py;
    }
  }

  setVisible(v){
    if (this.sprite != ''){
      this.sprite.visible = v;
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
