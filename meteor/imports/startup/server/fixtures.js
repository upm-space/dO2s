/* eslint-disable object-shorthand */
import seeder from '@cleverbeagle/seeder';
import { Meteor } from 'meteor/meteor';
import Projects from '../../api/Projects/Projects';
import Missions from '../../api/Missions/Missions';

const missionsSeed = (userId, projectId) => ({
  collection: Missions,
  environments: ['development', 'staging'],
  noLimit: true,
  modelCount: 5,
  model(dataIndex) {
    return {
      owner: userId,
      project: projectId,
      name: `Mission #${dataIndex + 1}`,
      description: `This is the description of Mission #${dataIndex + 1}`,
      rpaType: 'fixed-wing',
      type: 'surface-area',
    };
  },
});

const projectsSeed = userId => ({
  collection: Projects,
  environments: ['development', 'staging'],
  noLimit: true,
  modelCount: 5,
  model(dataIndex, faker) {
    return {
      owner: userId,
      name: `Project #${dataIndex + 1}`,
      description: `This is the description of Project #${dataIndex + 1}`,
      mapLocation: {
        longitude: faker.address.longitude(),
        latitude: faker.address.latitude(),
        zoom: faker.random.number({
          min: 0,
          max: 21,
        }),
      },
      data(projectId) {
        return missionsSeed(userId, projectId);
      },
    };
  },
});

seeder(Meteor.users, {
  environments: ['development', 'staging'],
  noLimit: true,
  data: [{
    email: 'admin@admin.com',
    password: 'password',
    profile: {
      name: {
        first: 'Pili',
        last: 'Arr',
      },
    },
    roles: ['admin'],
    data(userId) {
      return projectsSeed(userId);
    },
  }],
  modelCount: 5,
  model(index, faker) {
    const userCount = index + 1;
    return {
      email: `user+${userCount}@test.com`,
      password: 'password',
      profile: {
        name: {
          first: faker.name.firstName(),
          last: faker.name.lastName(),
        },
      },
      roles: ['free-user'],
      data(userId) {
        return projectsSeed(userId);
      },
    };
  },
});

if (!Meteor.isProduction) {
  const userExists = Meteor.users.findOne({ 'emails.0.address': 'admin@admin.com' });

  if (!userExists.emails[0].verified) {
    Meteor.users.update(
            { _id: userExists._id },
            { $set: { 'emails.0.verified': true } },
        );
  }
}
