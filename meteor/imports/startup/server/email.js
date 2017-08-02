import { Meteor } from 'meteor/meteor';

if (Meteor.isDevelopment) process.env.MAIL_URL = Meteor.settings.private.env.MAIL_URL;
