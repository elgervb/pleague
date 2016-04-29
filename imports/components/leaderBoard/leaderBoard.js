import angular from 'angular';
import angularMeteor from 'angular-meteor';
import { Players } from '../../api/players.js';

import template from './leaderBoard.html';

class LeaderboardCtrl {
  constructor($scope) {
    $scope.viewModel(this);
    
    this.subscribe('players');

    console.log('in leaderBoard controller');

    this.helpers({
      data() {
        return Players.find();
      }
    });
  }
}

export default angular.module('leaderBoard', [
  angularMeteor
])
  .component('leaderBoard', {
    templateUrl: 'imports/components/leaderBoard/leaderBoard.html',
    controller: ['$scope', LeaderboardCtrl],
    controllerAs: 'leaderboard'
  })
  .config(($stateProvider) => {
      $stateProvider.state('tab.leaderboard', {
      url: '/leaderboard',
      views: {
        'tab-leaderboard': {
          template: '<leader-board></leader-board>'
        }
      }
    })
  });