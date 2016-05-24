import angular from 'angular';
import angularMeteor from 'angular-meteor';
import { Players } from '../../api/players.js';
import { Games } from '../../api/games.js';

export class ChangestatsCtrl {
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
