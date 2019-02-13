
class Mission{
  constructor(p){
    this.mission_items  = [];
    this.colorID        = p.colorID;
    this.name           = p.t;
    this.description    = p.d;
    this.enemy_gen      = p.EG;
    this.escena         = p.escena;
    this.items_gen      = p.itemGen;
    this.items          = [];
    this.limits_xy      = {};

    this.mapa       = p.mapa;
    this.map_config = p.map_config;
    this.mapa_gen   = p.mapa_gen;
  }

  getMap(){
    this.mapa_gen.generarTerreno(this.map_config);
    this.limits_xy = {x_i:3, y_i:3, x_f:this.map_config.tiles_x-3, y_f:this.map_config.tiles_y-3};
    this.generateItems();
    this.mapa = this.mapa_gen.getMapa();
    return this.mapa;
  }

  addMissionItem(m){ this.mission_items.push(m); }
  addMissionDay(d) { this.mission_days.push(d);  }
  getColorID()     { return this.colorID;        }

  update(){
    for(let c=0; c<this.items.length; c++){ this.items[c].update(); }
  }

  generateItems(){
    for(let c=0;c < this.items_gen.length; c++){
      for(let j=0; j<this.items_gen[c].cant; j++){
        this.items_gen[c].item.x = Phaser.Math.Between(this.limits_xy.x_i, this.limits_xy.x_f);
        this.items_gen[c].item.y = Phaser.Math.Between(this.limits_xy.y_i, this.limits_xy.y_f);
        this.addItem(new Item(this.items_gen[c].item) );
      }
    }
  }

  addItem(i){ this.items.push(i); }
}
