import angular from 'angular';
import angularMeteor from 'angular-meteor';
import { Players } from '/imports/api/players.js';

import template from './players.html';

class PlayersCtrl {
  constructor($scope) {
    $scope.viewModel(this);
    
    // TODO: figure out which publications are needed here
    this.subscribe('players');
    this.subscribe('teams');
    this.subscribe('games');

    console.log('in players controller');

    this.helpers({
      data() {
        return Players.find();
      }
    });

  }

}

export default angular.module('players', [
  angularMeteor
])
  .component('players', {
    templateUrl: 'imports/components/players/players.html',
    controller: ['$scope', PlayersCtrl],
    controllerAs: 'players'
  })
  .config(($stateProvider) => {
      $stateProvider.state('tab.players', {
      url: '/players',
      views: {
        'tab-players': {
          template: '<players></players>'
        }
      }
    })
  });