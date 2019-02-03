class Construccion{

  constructor(){
    this.constructLimits = [];
    this.roomList        = [];
  }

  setLimits(p){
  }

  inLimits(x,y,z){
    if (x > this.constructLimits[0].xi && x < this.constructLimits[0].xf &&
        y > this.constructLimits[0].yi && y < this.constructLimits[0].yf ){ return true; }

    return false;
  }

  generate(){
    //se generan todas las habitaciones
    for (let c=0; c<this.roomList.length; c++){ this.roomList[c].generate(); this.constructLimits.push(this.roomList[c].getLimits());  }
    //se generan todas las aberturas
    for (let c=0; c<this.roomList.length; c++){ this.roomList[c].generateHoles(); }
  }

  addRoom(r){ this.roomList.push(r); }
}

class Room{
  constructor(g,p){
      this.generator = g;
      this.holesList = [];
      this.p         = p;
  }

  generate(){
    let p = this.p;
    //piso y techo
    this.generator.newRect(0,   p.xi,p.yi, p.xf,p.yf, 10);
    this.generator.newRect(p.h, p.xi,p.yi, p.xf,p.yf, 11);
    for (let c=1;c<p.h+1;c++){
      //paredes
      this.generator.newLine(c, p.xi,p.yi, p.xf,p.yi ,1 ,3); this.generator.newLine(c, p.xi,p.yf, p.xf,p.yf ,1 ,8);
      this.generator.newLine(c, p.xi,p.yi, p.xi,p.yf ,1 ,2); this.generator.newLine(c, p.xf,p.yi, p.xf,p.yf ,1 ,6);
      //esquineros
      this.generator.newLine(c, p.xi,p.yi, p.xi,p.yi ,1 ,4); this.generator.newLine(c, p.xf,p.yi, p.xf,p.yi ,1 ,5);
      this.generator.newLine(c, p.xi,p.yf, p.xi,p.yf ,1 ,9); this.generator.newLine(c, p.xf,p.yf, p.xf,p.yf ,1 ,7);
    }
  }

  getLimits(){
    return {'xi':this.p.xi,'yi':this.p.yi, 'xf':this.p.xf,'yf':this.p.yf};
  }

  generateHoles(){
    for(let c=0; c<this.holesList.length; c++) { this.generator.newHoleCube(this.holesList[c]); }
  }

  addHole(h){ this.holesList.push(h); }
}
