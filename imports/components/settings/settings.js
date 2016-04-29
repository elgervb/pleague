import angular from 'angular';
import angularMeteor from 'angular-meteor';
import { Players } from '../../api/players.js';

import template from './settings.html';

class SettingsCtrl {
  constructor($scope, $ionicPopup, $state, $log) {
    $scope.viewModel(this);
    this.$ionicPopup = $ionicPopup; 
    this.$state = $state;
    this.$log = $log; 
    
    // TODO: figure out which publications are needed here
    this.subscribe('players');
    this.subscribe('teams');
    this.subscribe('games');

    console.log('in settings controller');

    this.currentUser = function () {
      if (Meteor.user() == null) {
        return true;
      }
      return false;
    }

    this.helpers({
    });

  }

  doLoginAction() {
    let that = this;
    Meteor.loginWithPassword(this.credentials.username, this.credentials.password, (error) => {
      if (error) {
        // :(
        return that.handleError(error);
      }
      that.$state.go('tab.players');
    });
  }

  doLogoutAction() {
    let that = this;
    Meteor.logout(function () {
      // Redirect to login
      that.$state.go('tab.settings');
    });
  }

  handleError(err) {
    this.$log.error('Login error ', err);

    this.$ionicPopup.alert({
      title: err.reason || 'Login failed',
      template: 'Please try again or create an account',
      okType: 'button-positive button-clear'
    });
  }

}

export default angular.module('settings', [
  angularMeteor
])
  .component('settings', {
    templateUrl: 'imports/components/settings/settings.html',
    controller: ['$scope', '$ionicPopup', '$state', '$log', SettingsCtrl],
    controllerAs: 'settings'
  })
  .config(($stateProvider) => {
      $stateProvider.state('tab.settings', {
      url: '/settings',
      views: {
        'tab-settings': {
          template: '<settings></settings>'
        }
      }
    })
  });