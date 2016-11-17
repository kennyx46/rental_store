angular.module('rentalStore', ['ngRoute', 'ngTable'])
  .config(function ($routeProvider, $locationProvider) {
    $locationProvider.html5Mode({
      enabled: true,
      requireBase: false
    });
    $routeProvider
      .when("/", {
        controller: "DashboardCtrl",
        controllerAs: "dashboard",
        templateUrl: "dashboard.html",
        resolve: {
          'currentUser': function (UserService, $q) {
            return UserService.authenticate();
          }
        }
      })

    // .otherwise("/dashboard")
    .when("/login", {
      templateUrl: "login.html",
    })
    .otherwise("/")
  })
  .run(["$rootScope", "$location", function($rootScope, $location, UserService, $q) {
    $rootScope.$on("$routeChangeError", function(evt, to, from, error) {
      $location
        .path("/login")
    });
}])
  .factory('UserService', function ($q, $http) {
    var currentUser = null;

    return {
      authenticate: function () {
        if (currentUser) {
          return $q.when(currentUser);
        }

        return $http.get('/auth/facebook/account').then(function (response) {
          var accountInfo = response.data;

          if (accountInfo.loggedOut) {
            return $q.reject();
          } else {
            currentUser = accountInfo;
            return currentUser;
          }
        })
      },
      logout: function () {
        currentUser = null;
      }
    }
  })
  .controller('DashboardCtrl', function ($http, $q, NgTableParams, currentUser, $location, UserService) {
    var vm = this;
    var filmData = [];

    vm.currentUser = currentUser || {};
    vm.generalInfo = {};
    vm.graph = {
      graphCategories: [
        { type: 'pie', label: 'Pie Chart' },
        { type: 'bar', label: 'Bar Chart' }
      ],
      graphCategory: 'pie',
      graphFields: [
        { type: 'category', label: 'Category' },
        { type: 'language', label: 'Language' }
      ],
      graphField: 'category'
    };

    // window.vm = vm;
    $q.all({
      categories: $http.get('/categories'),
      languages: $http.get('/languages')
    }).then(function (result) {
      console.log(result);
      // vm.generalInfo = result;
      vm.generalInfo.categories = result.categories.data;
      vm.generalInfo.languages = result.languages.data;
      // console.log(vm.generalInfo)
    });

    vm.logout = function () {
      $http.get('/auth/facebook/logout').then(function () {

        // console.log($location)
        UserService.logout();
        vm.currentUser = {};
        $location.path("/login")
      }, function () {
        console.log('fail');
      });
    }

    vm.updateGraph = function () {
      var graphField = vm.graph.graphField === 'category' ?
        'categories': 'languages';

      var fields = vm.generalInfo[graphField].map(function (field) {
        return field.name;
      });

      var groupedFilms = _.groupBy(vm.currentDisplayedFilms, vm.graph.graphField);

      var data = [{
        // values: [19, 26, 55],
        // labels: ['Residential', 'Non-Residential', 'Utility'],
        values: fields.map(function (field) {
          if (groupedFilms[field]) {
            return groupedFilms[field].length * 100 / vm.filmsCount
          } else {
            return 0;
          }
        }),
        labels: fields,
        type: vm.graph.graphCategory
      }];

      data[0].x = data[0].labels;
      data[0].y = fields.map(function (field) {
        if (groupedFilms[field]) {
          return groupedFilms[field].length;
        } else {
          return 0;
        }
      });

      var layout = {
        height: 400,
        width: 800
      };

      Plotly.newPlot('graphWrapper', data, layout);
    }

    vm.tableParams = new NgTableParams({
      count: 50
    }, {
      counts: 50,
      getData: function (params) {
        var filterParams = params.filter();
        var searchParams = Object.assign({
          limit: params.count(),
          offset: params.count() * (params.page() - 1),
          accessToken: vm.currentUser.accessToken
        }, filterParams);

        return $http.get('/search?' +
          Object.keys(searchParams).reduce(function (acc, searchKey) {
            var searchValue = searchParams[searchKey];

            return (['limit', 'offset', 'accessToken'].indexOf(searchKey) !== -1 || searchValue) ?
              acc + searchKey + "=" + searchValue + '&' :
              acc;

          }, '')
        ).then(function (resultFilms) {
          var films;
          params.total(resultFilms.data.totalCount); // recal. page nav controls

          films = resultFilms.data.entries;

          films.forEach(function (film) {
            film.actors = film.actors.map(function (actor) {
              return actor.firstName + " " + actor.lastName;
            }).join(", ");
          });

          vm.currentDisplayedFilms = films;
          vm.filmsCount = resultFilms.data.totalCount;

          vm.updateGraph();

          return films;
        })
      }
    });

  })