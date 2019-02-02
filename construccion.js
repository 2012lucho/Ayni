class Construccion{

  constructor(){
    this.constructLimits = [{'xi':0,'yi':0, 'xf':0,'yf':0}];
  }

  setLimits(p){
    this.constructLimits[0] = p;
  }

  inLimits(x,y,z){
    if (x > this.constructLimits[0].xi && x < this.constructLimits[0].xf &&
        y > this.constructLimits[0].yi && y < this.constructLimits[0].yf ){ return true; }
        
    return false;
  }
}
