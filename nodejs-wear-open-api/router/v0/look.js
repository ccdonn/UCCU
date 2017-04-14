var config = require('./../../../config');
var knexData = require('knex')({
  client: 'mysql',
  connection: {
    host: config.sqlHost,
    port: config.sqlPort,
    user: config.sqlUser,
    password: config.sqlPass,
    database: 'rcloset'
  }
});

exports.index = function(req, res) {
  knexData.select('cm.Combination_Master_ID as id', 'cm.Name as combineName'
    ,'cm.Description as combineDescription', 'cm.Provider as combineProvider'
    ,'cm.Update_Time as updateTime', 'cm.Picture as combinePic'
    ,'ci.Item_ID as itemId', 'ci.Name as itemName'
    ,'ci.Description as itemDescription', 'ci.Picture as itemPicture'
    ,'ci.Link as link'
    ,'ccategory.Category_ID as categoryId', 'ccategory.Name as categoryName'
    ,'ccategory.Parent as categoryParent', 'ccategory.Picture as categoryPicture'
    ,'ccolor.Color_ID as colorId', 'ccolor.Name as colorName'
    ,'ccolor.Picture as colorPicture'

    // ,'cpattern.Pattern_ID as patternId', 'cpattern.Name as patternName')
  )
  .from('Combination_Master as cm')
  .join('Combination_Detail as cd', function() {
    this.on('cm.Combination_Master_ID', 'cd.Combination_Master_ID')
  })
  .join('Cloth_Item as ci', function() {
    this.on('cd.Item_ID', 'ci.Item_ID')
  })
  .join('Cloth_Category as ccategory', function(){
    this.on('ci.Category_ID', 'ccategory.Category_ID');
  })
  .join('Cloth_Color as ccolor', function(){
    this.on('ci.Color_ID', 'ccolor.Color_ID')
  })
  // .join('Cloth_Pattern as cpattern', function() {
  //   this.on('ci.Pattern_ID', 'cpattern.Pattern_ID')
  // })
  .where('cm.Status_ID', 1)
  .andWhere('cd.Status_ID', 1)
  .then(function(result){
    var map = {};
    result.forEach(function(item, index) {
      if (map[item.id]) {
      } else {
        map[item.id] = [];
      }

      map[item.id].push(item);
    });

    // console.info(map);

    var list = Object.keys(map).map(function(key){
      var combineItem = {};
      map[key].forEach(function(entry){
        if (combineItem.id) {
        } else {
          combineItem.lookId = entry.id;
        }

        if (combineItem.name) {
        } else {
          combineItem.name = entry.combineName;
        }

        if (combineItem.description) {
        } else {
          combineItem.description = entry.combineDescription;
        }

        if (combineItem.provider) {
        } else {
          combineItem.provider = entry.combineProvider;
        }

        if (combineItem.pic) {
        } else {
          combineItem.picture = config.lookImagePath+entry.combinePic;
        }

        if (combineItem.updateTime) {
        } else {
          combineItem.updateTime = new Date(entry.updateTime).getTime();
        }

        if (combineItem.detail) {
        } else {
          combineItem.detail = [];
        }
        if (combineItem.filter) {
        } else {
          combineItem.filter = [];
        }
        // if (combineItem.eigen) {
        // } else {
        //   combineItem.eigen = [];
        // }


        var item = {
          itemId: entry.itemId,
          name: entry.itemName,
          description: entry.itemDescription,
          picture: config.itemImagePath+entry.itemPicture,
          category: {
            categoryId: entry.categoryId,
            name: entry.categoryName,
            picture: config.categoryIconPath+entry.categoryPicture
          },
          color: {
            colorId: entry.colorId,
            name: entry.colorName,
            picture: config.colorIconPath+entry.colorPicture
          }
          // ,pattern: {
          //   id: entry.patternId,
          //   name: entry.patternName
          // }
        };

        combineItem.detail.push(item);

        var filter = {
          scope: entry.categoryParent
          , categoryKey: entry.categoryId
          // patternKey: entry.patternId,
          , colorKey: entry.colorId
          // , compositeKey: entry.categoryId+'.'+entry.colorId
        }
        combineItem.filter.push(filter);
      //
      //   var eigenItem = entry.categoryId+'.'+entry.colorId;
      //   combineItem.eigen.push(eigenItem);
      });
      return combineItem;
    });

    // console.info(list);

    res.send({
      status: "_OK",
      time: new Date().getTime(),
      data: list
    });
  })
  .catch(function(err){
    console.error(err);
    res.send({
      status: "_Failure",
      time: new Date().getTime()
    });
  });
};

exports.show = function(req, res) {
  res.send({
    status: "_OK",
    time: new Date().getTime()
  })
};
