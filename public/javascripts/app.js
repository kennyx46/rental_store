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
  .controller('DashboardCtrl', function ($http, NgTableParams, currentUser, $location, UserService) {
    var vm = this;
    var filmData = [];

    vm.currentUser = currentUser || {};

    window.vm = vm;

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

          // console.log(films);

          return films;
        })
      }
    });

  })