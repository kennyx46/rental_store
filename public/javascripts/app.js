angular.module('rentalStore', ['ngTable'])
  .controller('MainCtrl', function () {
    var vm = this;

    vm.user = "cool user";
  })
  .controller('DashboardCtrl', function ($http, NgTableParams) {
    var vm = this;
    var filmData = [];

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

            return searchKey === 'limit' ||  searchKey == 'offset' || searchValue ?
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