class Item extends ISOEntity{
  constructor(c){
    super(c);
    this.items = []; // cada item tambien puede contener un arreglo items

    this.altura = 1;
    this.stage  = c.st;
    this.text   = this.escena.add.text(0,0).setScrollFactor(1).setFontSize(30).setColor('#ffffff');
    this.text.depth = 40000;
  }

  update(){
    super.update();

    if(this.playerCollision()){
      this.text.x = this.px;
      this.text.y = this.py;
      this.text.setText([this.name, this.description]);
      this.text.visible = true;
    } else {
      this.text.visible = false;
    }
  }
}

class ItemGenerator{
  constructor(){

  }
}
