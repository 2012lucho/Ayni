class Item extends ISOEntity{
  constructor(c){
    super(c);
    this.items = []; // cada item tambien puede contener un arreglo items
    this.x = 0;
    this.y = 0;
    this.z = 0;

    this.altura = 1;

  }
}
