var express = require('express');
var router = express.Router();

var Category = require('../models/category');
var Film = require('../models/film');
var Actor = require('../models/actor');
var Language = require('../models/language');

var SEARCH_KEYS = {
  TITLE: 'title',
  DESCRIPTION: 'description',
  CATEGORY_NAME: 'category',
  ACTOR_NAME: 'actor',
  LANGUAGE_NAME: 'language'
}

/* search route. */
router.get('/', function(req, res, next) {
  var searchKey = Object.keys(req.query)[0];

  if (!searchKey) {
    return Film.findAll().then(function (films) {
      res.json(films);
    })
  }

  switch (searchKey) {
    case SEARCH_KEYS.TITLE:
      Film.findAll({
        where: {
          title: {
            $like: '%' + req.query[searchKey] + '%'
          }
        }
      }).then(function (films) {
        res.json(films);
      })
      break;
    case SEARCH_KEYS.DESCRIPTION:
      Film.findAll({
        where: {
          description: {
            $like: '%' + req.query[searchKey] + '%'
          }
        }
      }).then(function (films) {
        res.json(films);
      })
      break;
    case SEARCH_KEYS.CATEGORY_NAME:
      Film.findAll({
        include: [
        {
          model: Category,
          where: {
            name: {
              '$like': '%' + req.query[searchKey] + '%'
            }
          },
          attributes: ['name']
        }]
      }).then(function (films) {
        res.json(films);
      })
      break;
    case SEARCH_KEYS.ACTOR_NAME:
      Film.findAll({
        include: [
        {
          model: Actor,
          where: {
            $or: {
              firstName: {
                '$like': '%' + req.query[searchKey] + '%'
              },
              lastName: {
                '$like': '%' + req.query[searchKey] + '%'
              },
            }
          },
          attributes: ['firstName', 'lastName']
        }]
      }).then(function (films) {
        res.json(films);
      })
      break;
    case SEARCH_KEYS.LANGUAGE_NAME:
    // select id from languages where language.name like %1%
    // select * from films where language id ()

      // Language.findAll({
      //   where: {
      //     name: {
      //       $like: '%' + req.query[searchKey] + '%'
      //     }
      //   }
      // }).then(function (languages) {
      //   var langIds = languages.map(function (lang) {
      //     return lang.id;
      //   })
      //   Film.findAll({
      //     where: {
      //       language_id: {
      //         $in: langIds
      //       }
      //     }
      //   }).then(function (films) {
      //     res.json(films);
      //   })
      // })
      // break;

      Film.findAll({
        include: [
        {
          model: Language,
          where: {
            name: {
              '$like': '%' + req.query[searchKey] + '%'
            }
          },
          attributes: ['name']
        }, {
          model: Category,
          attributes: ['name']
        }, {
          model: Actor,
          attributes: ['firstName', 'lastName']
        }]
      }).then(function (films) {
        res.json(films);
      });
      break;
    default:
      res.json({ noMatches: true });
  }
});

// funtion processSearching (query, searchType, searchValue) {
//   return Film.findAll(query).then(function (films) {
//     return SearchLog.create({
//       userId: 'currentUserId',
//       searchType: searchType,
//       searchValue: searchValue,
//       resultCount: films.length
//     })
//   });
// }

module.exports = router;
