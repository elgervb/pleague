import angular from 'angular';
import angularMeteor from 'angular-meteor';
import { Players } from '/imports/api/players.js';
import { Teams } from '/imports/api/teams.js';

import template from './teams.html';

class TeamsCtrl {
  constructor($scope) {
    $scope.viewModel(this);
    
    // TODO: figure out which publications are needed here
    this.subscribe('players');
    this.subscribe('teams');
    this.subscribe('games');

    console.log('in teams controller');

    this.helpers({
      data() {
        return Teams.find();
      }
    });

  }
}

export default angular.module('teams', [
  angularMeteor
])
  .component('teams', {
    templateUrl: 'imports/components/teams/teams.html',
    controller: ['$scope', TeamsCtrl],
    controllerAs: 'teams'
  })
  .config(($stateProvider) => {
      $stateProvider.state('tab.teams', {
      url: '/teams',
      views: {
        'tab-teams': {
          template: '<teams></teams>'
        }
      }
    })
  });