import angular from 'angular';
import angularMeteor from 'angular-meteor';
import { Players } from '/imports/api/players.js';

import template from './players.html';

class PlayersCtrl {
  constructor($scope, $ionicPopup, $ionicListDelegate) {
    $scope.viewModel(this);
    this.$ionicPopup = $ionicPopup;
    this.$ionicListDelegate = $ionicListDelegate;
    
    // TODO: figure out which publications are needed here
    this.subscribe('players');
    this.subscribe('teams');
    this.subscribe('games');

    console.log('in players controller');

    this.showPlayerInfo = 0;
    
    this.helpers({
      data() {
        return Players.find();
      }
    });

  }
  
  toggleInfo(player) {
    if (this.showPlayerInfo == player._id) {
      this.showPlayerInfo = 0;
    } else {
      this.showPlayerInfo = player._id;
    }
  }

  eloPenalty(player) {
    let confirmPopup = this.$ionicPopup.confirm({
      title: 'Punish ' + player.name,
      template: 'This will substract 100 ELO from the total of this player.<br><b>Do you want to punish '+player.name+'?</b>'
    });

    confirmPopup.then((res) => {
      if (res) {
        Players.update({ _id: player._id },
        {
          $inc: { elo: -100 } //decrese the elo by 100
        })
      } else {
        return;
      }
      this.$ionicListDelegate.closeOptionButtons();
    });
  }

}

export default angular.module('players', [
  angularMeteor
])
  .component('players', {
    templateUrl: 'imports/components/players/players.html',
    controller: ['$scope', '$ionicPopup', '$ionicListDelegate', PlayersCtrl],
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