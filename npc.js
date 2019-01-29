class NPC{
  constructor(c){
    this.vida  = 100;
    this.items = [];

    this.x  = 0;
    this.y  = 0;
    this.z  = 0;
    this.px = 0;
    this.py = 0;

    this.escena   = c.escena;
    this.vel_desp = c.vel_desp;
    this.mundo    = c.mundo;

    this.sprite = this.escena.add.image(this.px,this.py, 'point');
  }

  update(){
    this.corrigueLimites();
    this.calcPosition();
    this.goPosition();
  }

  calcPosition(){
    this.px = (this.x - this.y) * ((128)/2);
    this.py = (this.x + this.y) * ((128)/3.555) - this.z*((128)/2.5);
  }

  goPosition(){
    this.sprite.x     = this.px;
    this.sprite.y     = this.py;
    this.sprite.depth = this.py+this.py*this.z;
  }

  corrigueLimites(){
    if( this.x <= 0 ){ this.x = 0; }
    if( this.y <= 0 ){ this.y = 0; }
    if( this.x > this.mundo.sprite_map.config.tiles_x ){ this.x = this.mundo.sprite_map.config.tiles_x; }
    if( this.y > this.mundo.sprite_map.config.tiles_y ){ this.y = this.mundo.sprite_map.config.tiles_y; }
  }

  destroy(){

  }
}
