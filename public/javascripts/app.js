angular.module('rentalStore', [])
  .controller('MainCtrl', function () {
    var vm = this;

    vm.user = "cool user";
  })
  .controller('DashboardCtrl', function ($http) {
    var vm = this;
    var filmData = [];

    vm.search = {
      category: null
      searchString: ""
    };

    $http.get('/films').then(function (films) {
      filmData = filmData.concat(films);
      vm.films = films;
    })

    vm.loadMore = function (offset) {
      if (!filmData[offset]) {
        $http.get('/films?offset=10').then(function (films) {
          filmData = filmData.concat(films);
          vm.films = films;
        })
      }
    }

    vm.search = function () {
      if (vm.search.category && vm.search.searchString) {
        $http.get('/search?' + vm.search.category + '=' vm.searchString)
          .then(function (films) {
            vm.filmData = films;
          })
      }
    }


  })