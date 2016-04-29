import { Mongo } from 'meteor/mongo';

export const Games = new Mongo.Collection('games');

Games.publicFields = {
  _id: 1,
  teamRed: 1,
  teamBlue: 1,
  teamRedScore: 1, 
  teamBlueScore: 1,
  startDate: 1,
  winner: 1,
  endDate: 1
};
 