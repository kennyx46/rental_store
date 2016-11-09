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

  var queryParams = buildQueryConfig(req);

  // Film.findAll(queryParams)
  Film.findAndCountAll(queryParams)
    .then(function (films) {

      console.log(films.rows.length);
      // console.log(films.length);

      var preparedFilms = prepareData(films);

      preparedFilms.offset = +req.query.offset;
      preparedFilms.limit = +req.query.limit;

      console.log(Object.keys(preparedFilms))
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

    // recheck
    distinct: true,


    limit: +req.query.limit,
    offset: +req.query.offset,
    // required: true,
    include: [
      {
        model: Language,
        // required: true,
        attributes: ['name']
      },
      {
        model: Actor,
        // required: true,
        attributes: ['firstName', 'lastName']
      },
      {
        model: Category,
        // required: true,
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

  console.log(fetchConfig);

  return fetchConfig;
}

function prepareData (films) {
  // console.log(films);
  var mappedFilms = films.rows.map(function (film) {
  // var mappedFilms = films.map(function (film) {
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

  // return films;
  // return mappedFilms;
  return {
    totalCount: films.count,
    entries: mappedFilms
  }
}

module.exports = router;
