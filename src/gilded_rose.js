class Item {
  constructor(name, sellIn, quality){
    this.name = name;
    this.sellIn = sellIn;
    this.quality = quality;
  }
}

class Shop {
  constructor(items=[]){
    this.items = items;
    this.specialItems = {
      'Aged Brie': (item) => this.updateAgedBrie(item),
      'Backstage passes to a TAFKAL80ETC concert': (item) => this.updateBackstagePasses(item),
      'Sulfuras, Hand of Ragnaros': (item) => item
    }
  } 

  updateDataBase() {
    this.items.forEach( (item) => {
      this.initializeItems(item);

      if (Object.keys(this.specialItems).includes(item.name)) {
        this.specialItems[item.name](item);
      } else {
        let conjured = 1;
        if (item.name.split('').filter( (letter, i) => i <= 7).join('') === 'Conjured') conjured += 1;
        this.updateNormalItems(item, conjured);
      }
    })
    return this.items;
  }

  initializeItems(item) {
    if (item.name === 'Sulfuras, Hand of Ragnaros') {
      item.quality = 80;
      item.sellIn = null;
    } else {
      if (item.quality > 50) item.quality = 50;
      if (item.quality < 0) item.quality = 0;
      item.sellIn--;
    }
  };

  updateNormalItems(item, conjured = 1) {
    if (item.quality > 0) {
      if (item.quality < conjured) {
        item.quality = 0;
      } else if (item.quality >= conjured) {
        if (item.sellIn >= 0) {
          item.quality -= conjured;
        } else {
          item.quality >= 2 * conjured ? item.quality -= 2 * conjured : item.quality = 0;
        }
      }
    };
  };

  updateAgedBrie(item) {
    if (item.quality < 50) item.quality ++
  };

  updateBackstagePasses(item) {
    if (item.sellIn < 0) {
      item.quality = 0;
    } else if (item.quality < 50) {
      item.quality ++;
      if (item.sellIn < 10 && item.quality < 50) item.quality ++;
      if (item.sellIn < 5 && item.quality < 50) item.quality ++;
    }
  };
}

module.exports = {
  Item,
  Shop
}
