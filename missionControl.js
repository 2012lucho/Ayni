
class Mission{
  constructor(p){
    this.mission_items  = [];
    this.colorID        = p.colorID;
    this.enemy_gen      = p.EG;
    this.escena         = p.escena;
  }

  addMissionItem(m){ this.mission_items.push(m); }
  addMissionDay(d) { this.mission_days.push(d);  }
  getColorID()     { return this.colorID;        }
}

class MCDay{
  constructor(){

  }
}

class MissionItem{
  constructor(){

  }
}
