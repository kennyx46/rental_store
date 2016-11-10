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
      // controller: LoginCtrl
      templateUrl: "login.html",
      resolve: {
          'currentUser': function (UserService, $q) {
            return UserService.authenticate().then(function (currentUser) {
              if (currentUser.loggedOut) {
                return $q.when();
              } else {
                $q.reject();
              }
            })
          }
        }
    })
    .otherwise("/")
  })
  .run(["$rootScope", "$location", function($rootScope, $location, UserService, $q) {
    $rootScope.$on("$routeChangeStart", function(evt, to, from) {

        // requires authorization?
        // if (to.authorize === true) {
        //     to.resolve = to.resolve || {};
        //     if (!to.resolve.authorizationResolver) {
        //         // inject resolver
        //         to.resolve.authorizationResolver = ["authService", function(authService) {
        //             return authService.authorize();
        //         }];
        //     }
        // }
        // console.log(to)
        // console.log(UserService)
    });

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
            localStorage.isLoggedIn = false;
            return $q.reject();
          } else {
            localStorage.isLoggedIn = true;
            currentUser = accountInfo;
            return currentUser;
          }
        })
      },
      isLoggedIn: function () {
        return localStorage.isLoggedIn;
        // return currentUser;
      }
    }
  })
  .controller('DashboardCtrl', function ($http, NgTableParams, currentUser) {
    var vm = this;
    var filmData = [];

    vm.currentUser = currentUser || {};

    window.vm = vm;

    // var data = [{name: "Moroni", age: 50}, {name: "Roroni", age: 46 }];
    vm.tableParams = new NgTableParams({
      count: 50
    }, {
      counts: 50,
      getData: function(params) {
        var filterParams = params.filter();
        var searchParams = Object.assign({
          limit: params.count(),
          offset: params.count() * (params.page() - 1)
        }, filterParams);
        // console.log(params.filter());
        // var limit = vm.tableParams.count();
        // var offset = limit * (vm.tableParams.page() - 1);

        // console.log(searchParams);

        return $http.get('/search?' +
          Object.keys(searchParams).reduce(function (acc, searchKey) {
            var searchValue = searchParams[searchKey];

            return searchKey === 'limit' ||  searchKey === 'offset' || searchValue ?
              acc + searchKey + "=" + searchValue + '&' :
              acc;

            // return acc + searchKey + "=" + searchParams[searchKey] + '&'
          }, '')
        ).then(function (resultFilms) {
          // console.log(resultFilms);
          // params.total(resultFilms.data.totalCount); // recal. page nav controls
          params.total(resultFilms.data.totalCount); // recal. page nav controls

          // console.log(resultFilms.data.totalCount);
          console.log(resultFilms.data.entries.length);
          // params.total(10); // recal. page nav controls
          // vm.films = films;

          var films = resultFilms.data.entries;
          // .slice((params.page() - 1) * params.count(), params.page() * params.count())

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