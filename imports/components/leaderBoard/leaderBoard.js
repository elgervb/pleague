import angular from 'angular';
import angularMeteor from 'angular-meteor';
import { Players } from '../../api/players.js';

import boardTemplate from './leaderBoard.html';
import listTemplate from './leaderBoardList.html';

class LeaderboardCtrl {
  constructor($scope) {
    $scope.viewModel(this);

    console.log('in leaderBoard controller');

    this.helpers({
      playersList() {
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
  })
  .component('leaderBoardList', {
    templateUrl: 'imports/components/leaderBoard/leaderBoardList.html',
    controller: ['$scope', LeaderboardCtrl],
    bindings: {
      max: '<'
    }
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
