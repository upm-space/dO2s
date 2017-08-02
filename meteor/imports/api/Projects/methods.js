
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import Documents from './Documents';
import rateLimit from '../../modules/rate-limit';

Meteor.methods({
    /* Insert your methods here. */
});

rateLimit({
    methods: [
        /* Add your methods here. */
    ],
    limit: 5,
    timeRange: 1000,
});
