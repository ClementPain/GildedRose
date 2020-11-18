const { Shop, Item } = require('../src/gilded_rose.js');

describe("GildedRose shop manager", function () {
  let listItems;

  // set back the array
  beforeEach(function () {
    listItems = [];
  });

  // function used to pass a list of items through the updateQuality function and return the result. Then check if the result matches the expectations
  const preparationTest = (items) => {
    items.forEach( (item) => listItems.push(new Item(item.name, item.sellIn, item.quality)));

    const gildedRose = new Shop(listItems);
    const itemsUpdated = gildedRose.updateDataBase();
    return itemsUpdated;
  }

  // function used to test if the result of updateQuality matches the expectations
  const testUpdateQuality = (updatedItems, expected) => {
    expected.forEach( (testCase, i) => {
      expect(updatedItems[i].quality).toBe(testCase.quality);
      expect(updatedItems[i].sellIn).toBe(testCase.sellIn);
    });
  }

  it("Baisser de 1 la qualité et sellIn d'item normaux", () => {
    const testItems = [
      {
        name: "+5 Dexterity Vest",
        sellIn: 10,
        quality: 20
      }, {
        name: "Mana Cake",
        sellIn: 3,
        quality: 6
      }, {
        name: "large slices dill pickle",
        sellIn: 5,
        quality: 0
      }
    ];
    
    const updatedItems = preparationTest(testItems);

    const expected = [
      { sellIn: 9, quality: 19 },
      { sellIn: 2, quality: 5 },
      { sellIn: 4, quality: 0 }
    ];

    testUpdateQuality(updatedItems, expected);
  });
  
  it("Diminuer la qualité de 2 pour les produits normaux ayant dépassés la date de sellIn", () => {
    const testItems = [
      {
        name: "+5 Dexterity Vest",
        sellIn: 0,
        quality: 20
      }, {
        name: "Mana Cake",
        sellIn: -2,
        quality: 6
      }
    ]

    const updatedItems = preparationTest(testItems);
    const expected = [
      { sellIn: -1, quality: 18 },
      { sellIn: -3, quality: 4 }
    ];

    testUpdateQuality(updatedItems, expected);
  });

  it("La qualité n'est jamais supérieure à 50", () => {
    const testItems = [
      {
        name: "Mana Cake",
        sellIn: 12,
        quality: 500
      }, {
        name: "Aged Brie",
        sellIn: 12,
        quality: 50
      }, {
        name: "Backstage passes to a TAFKAL80ETC concert",
        sellIn: 12,
        quality: 50
      }, {
        name: "Backstage passes to a TAFKAL80ETC concert",
        sellIn: 10,
        quality: 49
      }, {
        name: "Backstage passes to a TAFKAL80ETC concert",
        sellIn: 4,
        quality: 48
      }
    ];

    const updatedItems = preparationTest(testItems);
    const expected = [
      { sellIn: 11, quality: 49 },  
      { sellIn: 11, quality: 50 },
      { sellIn: 11, quality: 50 },
      { sellIn: 9, quality: 50 },
      { sellIn: 3, quality: 50 }
    ];

    testUpdateQuality(updatedItems, expected);
  });

  it("La qualité est toujours positive",  () => {
    const testItems = [
      {
        name: "Mana Cake",
        sellIn: 12,
        quality: -500
      }, {
        name: "large slices dill pickle",
        sellIn: -9,
        quality: 1
      }, {
        name: "Purple pills",
        sellIn: 12,
        quality: 0
      },
    ]

    const updatedItems = preparationTest(testItems);
    const expected = [
      { sellIn: 11, quality: 0 },  
      { sellIn: -10, quality: 0 },
      { sellIn: 11, quality: 0 }
    ];

    testUpdateQuality(updatedItems, expected);
  });

  it("La qualité de Sulfuras est toujours à 80", () => {
    const testItems = [
      {
        name: 'Sulfuras, Hand of Ragnaros',
        sellIn: null,
        quality: 80
      }, {
        name: 'Sulfuras, Hand of Ragnaros',
        sellIn: 12,
        quality: 800
      }
    ];

    const updatedItems = preparationTest(testItems);
    const expected = [
      { sellIn: null, quality: 80 },
      { sellIn: null, quality: 80 }
    ];

    testUpdateQuality(updatedItems, expected);
  });

  it("Augmenter la qualité de 1 pour Aged Brie et Backstage passes", () => {
    const testItems = [
      {
        name: "Aged Brie",
        sellIn: 20,
        quality: 30
      }, {
        name: "Backstage passes to a TAFKAL80ETC concert",
        sellIn: 20,
        quality: 30
      }
    ]
    
    const updatedItems = preparationTest(testItems);

    const expected = [
      { sellIn: 19, quality: 31 },
      { sellIn: 19, quality: 31 },
    ];

   testUpdateQuality(updatedItems, expected);
  });

  it("Augmenter la qualité de 2 pour Backstage passes à 10 jours ou moins du concert", () => {
    const testItems = [
      {
        name: "Backstage passes to a TAFKAL80ETC concert",
        sellIn: 10,
        quality: 30
      }, {
        name: "Backstage passes to a TAFKAL80ETC concert",
        sellIn: 6,
        quality: 30
      }
    ];

    const updatedItems = preparationTest(testItems);

    const expected = [
      { sellIn: 9, quality: 32 },
      { sellIn: 5, quality: 32 }
    ];

    testUpdateQuality(updatedItems, expected);
  });

  it("Augmenter la qualité de 3 pour Backstage passes à 5 jours ou moins du concert", () => {
    const testItems = [
      {
        name: "Backstage passes to a TAFKAL80ETC concert",
        sellIn: 5,
        quality: 30
      }, {
        name: "Backstage passes to a TAFKAL80ETC concert",
        sellIn: 1,
        quality: 30
      }
    ];

    const updatedItems = preparationTest(testItems);

    const expected = [
      { sellIn: 4, quality: 33 },
      { sellIn: 0, quality: 33 }
    ];

    testUpdateQuality(updatedItems, expected);
  });

  it("La qualité de Backstage tombe à 0 une fois le concert passé", () => {
    const testItems = [
      {
        name: "Backstage passes to a TAFKAL80ETC concert",
        sellIn: 0,
        quality: 30
      }, {
        name: "Backstage passes to a TAFKAL80ETC concert",
        sellIn: -10,
        quality: 30
      }
    ];

    const updatedItems = preparationTest(testItems);

    const expected = [
      { sellIn: -1, quality: 0 },
      { sellIn: -11, quality: 0 }
    ];

    testUpdateQuality(updatedItems, expected);
  });

  it("Les produits Conjured se dégradent deux fois plus vite", () => {
    const testItems = [
      {
        name: "Conjured lipstick",
        sellIn: 4,
        quality: 30
      }, {
        name: "Conjured hat",
        sellIn: -12,
        quality: 30
      }, {
        name: "Conjured glasses",
        sellIn: 4,
        quality: 1
      }, {
        name: "Conjured lipstick",
        sellIn: -4,
        quality: 3
      }
    ];

    const updatedItems = preparationTest(testItems);

    const expected = [
      { sellIn: 3, quality: 28 },
      { sellIn: -13, quality: 26 },
      { sellIn: 3, quality: 0 },
      { sellIn: -5, quality: 0 }
    ];

    testUpdateQuality(updatedItems, expected);
  })
});