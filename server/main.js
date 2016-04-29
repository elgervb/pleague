//import '../imports/api/teams.js';
//import '../imports/api/games.js';
//import '../imports/api/tasks.js';
//import '../imports/api/players.js';
import { Games } from '../imports/api/games.js';
import { Players } from '../imports/api/players.js';
import { Teams } from '../imports/api/teams.js';
import { Tasks } from '../imports/api/tasks.js';

Meteor.publish('games.overview', (skip, limit) => {
  // provide defaults if no args given
  skip = skip || 0;
  limit = limit || 5;
  // otherwise we need to check the arguments types
  new SimpleSchema({
    skip: {type: Number},
    limit: {type: Number}
  }).validate({ skip, limit });
  // and if all works out, publish the collection
  return Games.find({},
  {sort: {createdAt: -1}, skip: skip, limit: limit},
  {
    fields: Games.publicFields
  });
});

Meteor.publish('teams', () => {
  return Teams.find({});
});
Meteor.publish('games', () => {
  return Games.find({});
});
Meteor.publish('tasks', () => {
  return Tasks.find({});
});
Meteor.publish('players', () => {
  return Players.find({});
});
