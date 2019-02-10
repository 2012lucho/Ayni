class ISOEntity{
  constructor(c){
    this.vida  = 100;
    this.items = [];

    this.x  = c.x;
    this.y  = c.y;
    this.z  = 1;
    this.px = 0;
    this.py = 0;

    this.escena     = c.escena;
    this.vel_desp_n = c.vel_desp;
    this.vel_desp_f = c.vel_desp;
    this.vel_desp   = 0;
    this.acelerat   = 0.2;
    this.mundo      = c.mundo;
    this.altura     = 1;

    this.img         = c.img;
    this.name        = c.name;
    this.description = c.description;

    this.px_dest   = this.x; this.py_dest = this.y;
    this.sprite = this.escena.add.image(this.px,this.py, this.img);
  }

  update(){
    this.corrigueLimites();
    this.calcPosition();
    this.goPosition();
  }

  aceleraTo(){
    if (this.vel_desp < this.vel_desp_f && this.vel_desp_f-this.vel_desp>this.acelerat){ this.vel_desp += this.acelerat;  }
    else { if (this.vel_desp > this.vel_desp_f && this.vel_desp-this.vel_desp_f>this.acelerat){ this.vel_desp -= this.acelerat; } }
  }

  positionPosible(x,y){
    let px  = Math.floor(this.x); let py = Math.floor(this.y);
    let p_a = this.mundo.getTileData( px,py );
    let p_p = this.mundo.getTileData( px+Math.ceil(x),py+Math.ceil(y) );

    if (p_p == -1 || p_a == -1) { return false; }
    let d_z    = p_a.z - p_p.z; d_z = Math.sign(d_z)*d_z;

    if (d_z > this.altura){ return false; } //desnivel en la base del terreno
    if (p_p.tileCont.length == 0) { return true; }

    let s  = false;
    let s2 = true;
    for (let c=0; c<p_p.tileCont.length; c++){
      if (p_p.tileCont[c].hole && p_p.tileCont[c].z >= p_a.z && p_p.tileCont[c].z<= p_a.z+this.altura) { //si hay un hueco para pasar
        s = true; }
      if (p_p.tileCont[c].z > p_a.z+this.altura){ s2 = s2 && true; } else { s2 = false; }
    }

    return s || s2;
  }

  avanzarX(c){
    if (this.positionPosible(c,0) ){
      this.x += c;
      this.mundo.update();
    }
  }

  avanzarY(c){
    if (this.positionPosible(0,c) ){
      this.y += c;
      this.mundo.update();
    }
  }

  calcPosition(){
    this.px = (this.x - this.y) * ((this.mundo.config.tile_W)/2);
    this.py = (this.x + this.y) * ((this.mundo.config.tile_H)/3.555) - this.z*((this.mundo.config.tile_H)/2.5);
  }

  getMapCoords(x,y){
    let s  = {x:0,y:0};
    let mdCX = Math.ceil( ( x*this.mundo.screen_sc - this.mundo.screen_x/2 )/(this.mundo.config.tile_W*this.mundo.screen_sc) );
    let mdCY = Math.ceil( ( y*this.mundo.screen_sc - this.mundo.screen_y/2 )/(this.mundo.config.tile_H*this.mundo.screen_sc) );
    s.x = this.x + mdCX + mdCY;
    s.y = this.y - mdCX + mdCY;
    return s;
  }

  goPosition(){
    this.sprite.x     = this.px;
    this.sprite.y     = this.py;
    this.sprite.depth = this.z*this.mundo.screen_y+this.py;
  }

  goToDest(){
    if (this.px_dest != -1 && this.py_dest != -1){
      if (this.x < this.px_dest && this.px_dest-this.x > this.vel_desp){ this.avanzarX(this.vel_desp);  this.aceleraTo(); }
      if (this.x > this.px_dest && this.x-this.px_dest > this.vel_desp){ this.avanzarX(-this.vel_desp); this.aceleraTo(); }
      if (this.y < this.py_dest && this.py_dest-this.y > this.vel_desp){ this.avanzarY(this.vel_desp);  this.aceleraTo(); }
      if (this.y > this.py_dest && this.y-this.py_dest > this.vel_desp){ this.avanzarY(-this.vel_desp); this.aceleraTo(); }
    }
  }

  corrigueLimites(){
    //bordes del mapa
    if( this.x <= 0 ){ this.x = 0; }
    if( this.y <= 0 ){ this.y = 0; }
    if( this.x > this.mundo.sprite_map.config.tiles_x ){ this.x = this.mundo.sprite_map.config.tiles_x; }
    if( this.y > this.mundo.sprite_map.config.tiles_y ){ this.y = this.mundo.sprite_map.config.tiles_y; }
  }

  destroy(){

  }
}
