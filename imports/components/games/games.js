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
    this.skip = 0;
    this.subscribe('teams');
    this.subscribe('players');

    // call with no arguments returns defaults: skip 0, limit 5
    this.subscribe('games');//.overview');
    // otherwise provide them (see /server/main.js)
    // this.subscribe('games.overview', () => {
    //   return [0, 10];
    // });
    // or with a reactive variable defined as `this.skip = 0`
    // this.subscribe('games.overview', () => {
    //   return [this.getReactively('skip'), 10];
    // });

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
        // since the 'complex' logic is done serverside data is just a simple collection here
        return Games.find(
          { endDate: { $exists: true }  }
          // { endDate: { $exists: true } }, { limit: 5 , sort: { startDate: -1} }
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

  trashGameInProgressModal() {
    if (this.inprogress) {
      let confirmPopup = this.$ionicPopup.confirm({
        title: 'Trash this game?',
        template: 'This will end this game. The scored goals will not result in any change in ELO standings.<br><b>Do you want to end this game?</b>'
      });

      confirmPopup.then((res) => {
        if (res) {
          Games.remove(this.inprogress._id);
        } else {
          return;
        }
      });
    } else {
      this.$state.go('tab.newgame');
    }
  }

  showNewGameModal() {
    this.$state.go('tab.newgame');
  }

  remove(game) {
      let confirmPopup = this.$ionicPopup.confirm({
        title: 'Delete this game?',
        template: 'You <i>can</i> delete this game but it will have no effect on the ELO standings in the leaderboard.<br>The only reason to play-and-delete a game is for cheating, which is not really fair.<br><b>Do you want to delete this game?</b>'
      });
      confirmPopup.then((res) => {
        if (res) {
          Games.remove(game._id);
        } else {
          return;
        }
      });
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