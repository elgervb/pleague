import angular from 'angular';
import angularMeteor from 'angular-meteor';
import { Players } from '../../api/players.js';
import { Games } from '../../api/games.js';

import dashBoardTemplate from './dashBoard.html';
import changeStatsTemplate from './changeStats.html';

class DashboardCtrl {
  constructor($scope, $state) {
    $scope.viewModel(this);
    this.$state = $state;

    console.log('in dashBoard controller');

    this.helpers({
      playersList() {
        return Players.find();
      },
      inprogress() {
        return Games.findOne(
          { endDate: { $exists: false } }
        );
      },
      lastGame() {
        return Games.findOne(
          { endDate: { $exists: true } }, { limit: 1 , sort: { startDate: -1} }
        );
      }
    });
  }

  showNewGameModal() {
    this.$state.go('tab.newgame');
  }
}

class ChangestatsCtrl {
  constructor($scope, $state) {
    $scope.viewModel(this);
    this.$state = $state;

    console.log('in changeStats controller');

    this.helpers({
      playersList() {
        return Players.find();
      }
    });
  }
}

export default angular.module('dashBoard', [
  angularMeteor
])
  .component('dashBoard', {
    templateUrl: 'imports/components/dashBoard/dashBoard.html',
    controller: ['$scope', '$state', DashboardCtrl]
  })
  .component('changeStats', {
    templateUrl: 'imports/components/dashBoard/changeStats.html',
    controller: ['$scope', '$state', ChangestatsCtrl]
  })
  .config(($stateProvider) => {
      $stateProvider.state('tab.dashboard', {
      url: '/dashboard',
      views: {
        'tab-dashboard': {
          template: '<dash-board></dash-board>'
        }
      }
    })
  });
