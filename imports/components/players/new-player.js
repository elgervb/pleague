import angular from 'angular';
import angularMeteor from 'angular-meteor';

import template from '/imports/components/players/new-player.html';

class NewPlayerCtrl {
  constructor($scope, $state, $ionicPopup, $ionicHistory) {
    $scope.viewModel(this);
    this.$state = $state;
    this.$ionicPopup = $ionicPopup;
    this.$ionicHistory = $ionicHistory;

    // TODO: figure out which publications are needed here
    this.subscribe('players');
    this.subscribe('teams');
    this.subscribe('games');

    console.log('in new-player controller');
    
    this.helpers({
        //   find all other users
        // users() {
        //   return Meteor.users.find({ _id: { $ne: Meteor.userId() } });
        // }
    });
  }

  goBack() {
    this.$ionicHistory.goBack();
  }
  
  newPlayer() {
    let that = this;
    try {
        Meteor.call('newPlayer', {name: this.name, claim: this.claim}, (error) => {
            if (error) {
                var alertPopup = that.$ionicPopup.alert({
                    title: 'Error adding player',
                    template: error.reason
                });

                alertPopup.then((res) => {
                    console.log('Thank you for not eating my delicious ice cream cone');
                });
            } else {
                that.$ionicHistory.goBack();
            }
        });
    } catch (e) {
        console.log('Hjalp!!');
        console.log(e);
    }
  }  
}

export default angular.module('newplayer', [
  angularMeteor
])
  .component('newplayer', {
    templateUrl: 'imports/components/players/new-player.html',
    controller: ['$scope', '$state', '$ionicPopup', '$ionicHistory', NewPlayerCtrl],
    controllerAs: 'newplayer'
  })
  .config(($stateProvider) => {
      $stateProvider.state('tab.newplayer', {
      url: '/players/new',
      views: {
        'tab-players': {
          template: '<newplayer></newplayer>'
        }
      }
    })
  });
