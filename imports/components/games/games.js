import angular from 'angular';
import angularMeteor from 'angular-meteor';
import { Players } from '/imports/api/players.js';
import { Games } from '/imports/api/games.js';

import template from './games.html';

class GamesCtrl {
  constructor($scope, $state, $ionicPopup, gameScoreService) {
    $scope.viewModel(this);
    this.$state = $state;
    this.$ionicPopup = $ionicPopup;
    this.gameScoreService = gameScoreService;

    console.log('in games controller');

    this.helpers({
      isAdmin() {
        let user = Meteor.users.findOne({ _id: Meteor.userId() }, { fields: { profile: 1 } });
        if (user) {
          this.role = user.profile.role;
          if (this.role === 'admin') {
            return true;
          }
        }
        return false;
      },
      data() {
        return Games.find(
          { endDate: { $exists: true } }
        );
      },
      inprogress() {
        return Games.findOne(
          { endDate: { $exists: false } }
        );
      }
    });

  }

  scored(team) {
    this.gameScoreService.scored(team, this.inprogress);
  }

  showNewGameModal() {
    if (this.inprogress) {
      let confirmPopup = this.$ionicPopup.confirm({
        title: 'Unable to create game',
        template: 'Cannot add game while a game is in progress.<br><b>Do you want to end this game?</b>'
      });

      confirmPopup.then((res) => {
        if (res) {
          console.log('You are sure');
        } else {
          console.log('You are not sure');
          return;
        }
      });
    } else {
      this.$state.go('tab.newgame');
    }
  }

  remove(game) {
    Games.remove(game._id);
  }

}

export default angular.module('games', [
  angularMeteor
])
  .component('games', {
    templateUrl: 'imports/components/games/games.html',
    controller: ['$scope', '$state', '$ionicPopup', 'gameScoreService', GamesCtrl],
    controllerAs: 'games'
  })
  .config(($stateProvider) => {
      $stateProvider.state('tab.games', {
      url: '/games',
      views: {
        'tab-games': {
          template: '<games></games>'
        }
      }
    })
  });