import angular from 'angular';
import angularMeteor from 'angular-meteor';
import { Players } from '/imports/api/players.js';
import { Teams } from '/imports/api/teams.js';

import template from '/imports/components/games/new-game.html';

class NewGameCtrl {
  constructor($scope, $state, $ionicPopup, $ionicHistory) {
    $scope.viewModel(this);
    this.$state = $state;
    this.$ionicPopup = $ionicPopup;
    this.$ionicHistory = $ionicHistory;
    this.subscribe('players');

    console.log('in new-game controller');

    this.enabled = true;
    this.init();

    this.helpers({
      players: () => {
        return Players.find({ _id: { $nin: this.getReactively('selectedPlayers') } }, { sort: { name: 1 } });
      }
    });
  }

  selectPlayer(id) {
    console.log("selected: " + id);
    this.selectedPlayers = this.selectedPlayers.concat([id]);
    // TODO: the following code relies heavily on the sequential nature of the team select and should be replaced with a selectstate
    if (this.selectTeam == 'red') {
      if (this.selectWhatPlayer == 'defense') {
        this.teamRed.defender = id;
        this.teamRed.players.push(id);
        this.selectWhatPlayer = 'offence';
      } else {
        this.teamRed.attacker = id;
        this.teamRed.players.push(id);
        this.selectWhatPlayer = 'defense';
        this.selectTeam = 'blue';
      }
    } else {
      if (this.selectWhatPlayer == 'defense') {
        this.teamBlue.defender = id;
        this.teamBlue.players.push(id);
        this.selectWhatPlayer = 'offence';
      } else {
        this.teamBlue.attacker = id;
        this.teamBlue.players.push(id);
      }
    }
    if (this.selectedPlayers.length == 4) {
      this.newGame();
    }
  }

  init() {
    this.selectedPlayers = [];
    this.selectTeam = 'red';
    this.selectWhatPlayer = 'defense';
    this.teamRed = {
      players: []
    };
    this.teamBlue = {
      players: []
    };
  }

  goBack() {
    this.$state.go('tab.games');
  }

  newGame() {
    let that = this;

    let teamRedStub = this.newTeam(this.teamRed.players);
    let teamBlueStub = this.newTeam(this.teamBlue.players);

    try {
      Meteor.call('newGame', { teamRed: teamRedStub, teamBlue: teamBlueStub }, (error) => {
        if (error) {
          var alertPopup = that.$ionicPopup.alert({
            title: 'Error adding Game',
            template: error.reason
          });

          alertPopup.then((res) => {
            console.log('Thank you for not eating my delicious ice cream cone');
          });
        } else {
          this.$state.go('tab.games');
        }
      });
    } catch (e) {
      console.log('Hjalp!!');
      console.log(e);
    }
  }

  newTeam(players) {
    let teamStub = Meteor.apply('newTeam',
      [{ players }],
      { returnStubValue: true }
    );
    if (teamStub)
      console.log(teamStub);
    return teamStub;
  }

}

export default angular.module('newgame', [
  angularMeteor
])
  .component('newgame', {
    templateUrl: 'imports/components/games/new-game.html',
    controller: ['$scope', '$state', '$ionicPopup', '$ionicHistory', NewGameCtrl],
    controllerAs: 'newgame'
  })
  .config(($stateProvider) => {
    $stateProvider.state('tab.newgame', {
      url: '/games/new',
      views: {
        'tab-games': {
          template: '<newgame></newgame>'
        }
      }
    })
  });
