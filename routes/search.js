var express = require('express');
var router = express.Router();

var ensureAuthenticated = require('../middlewares/auth').ensureAuthenticated;
var ensureHasToken = require('../middlewares/auth').ensureHasToken;

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
router.get('/', ensureAuthenticated, ensureHasToken, function(req, res, next) {

  var queryParams = buildQueryConfig(req);

  Film.findAndCountAll(queryParams)
    .then(function (films) {
      var preparedFilms = prepareData(films);

      preparedFilms.offset = +req.query.offset;
      preparedFilms.limit = +req.query.limit;

    // return SearchLog.create({
    //   userId: 'currentUserId',
    //   searchType: searchType,
    //   searchValue: searchValue,
    //   resultCount: films.length
    // });
      res.json(preparedFilms);
    })

});

function buildQueryConfig (req) {
  var fetchConfig = {
    distinct: true,
    limit: +req.query.limit,
    offset: +req.query.offset,
    include: [
      {
        model: Language,
        attributes: ['name']
      },
      {
        model: Actor,
        attributes: ['firstName', 'lastName']
      },
      {
        model: Category,
        attributes: ['name']
      }
    ]
  };

  if (req.query[SEARCH_KEYS.TITLE]) {
    fetchConfig['where'] = {
      title: {
        $like: '%' + req.query[SEARCH_KEYS.TITLE] + '%'
      }
    }
  }

  if (req.query[SEARCH_KEYS.DESCRIPTION]) {
    fetchConfig['where'] = {
      description: {
        $like: '%' + req.query[SEARCH_KEYS.DESCRIPTION] + '%'
      }
    }
  }

  if (req.query[SEARCH_KEYS.CATEGORY_NAME]) {
    fetchConfig.include[2]['where'] = {
      name: {
        '$like': '%' + req.query[SEARCH_KEYS.CATEGORY_NAME] + '%'
      }
    }
  }

  if (req.query[SEARCH_KEYS.LANGUAGE_NAME]) {
    fetchConfig.include[0]['where'] = {
      name: {
        '$like': '%' + req.query[SEARCH_KEYS.LANGUAGE_NAME] + '%'
      }
    }
  }

  if (req.query[SEARCH_KEYS.ACTOR_NAME]) {
    fetchConfig.include[1]['where'] = {
      $or: {
        firstName: {
          '$like': '%' + req.query[SEARCH_KEYS.ACTOR_NAME] + '%'
        },
        lastName: {
          '$like': '%' + req.query[SEARCH_KEYS.ACTOR_NAME] + '%'
        }
      }
    }
  }

  return fetchConfig;
}

function prepareData (films) {
  var mappedFilms = films.rows.map(function (film) {
    return {
      id: film.id,
      title: film.title,
      description: film.description,
      length: film.length,
      releaseYear: film.releaseYear,
      language: film.language.name,
      category: film.categories[0].name,
      rating: film.rating,
      actors: film.actors.map(function (actor) {
        return {
          firstName: actor.firstName,
          lastName: actor.lastName
        };
      })
    }
  })

  return {
    totalCount: films.count,
    entries: mappedFilms
  }
}

module.exports = router;
