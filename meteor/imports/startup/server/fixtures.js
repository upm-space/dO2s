import seeder from '@cleverbeagle/seeder';
import { Meteor } from 'meteor/meteor';
import Projects from '../../api/Projects/Projects';
import Missions from '../../api/Missions/Missions';

import RPAs from '../../api/RPAs/RPAs';
import Payloads from '../../api/Payloads/Payloads';
import Batteries from '../../api/Batteries/Batteries';


const rpasSeed = userId => ({
  collection: RPAs,
  environments: ['development', 'staging'],
  noLimit: true,
  modelCount: 1,
  model(faker) {
    return {
      owner: userId,
      name: 'GeoDrone Conyca',
      rpaType: 'Plane',
      model: faker.commerce.productAdjective(),
      registrationNumber: faker.random.number(),
      constructionDate: faker.date.past(),
      serialNumber: faker.random.number(),
      weight: 5,
      flightParameters: {
        maxDescendSlope: faker.random.number({ min: 0, max: 100 }),
        maxAscendSlope: faker.random.number({ min: 0, max: 100 }),
        optimalLandingSlope: 7,
        optimalTakeOffSlope: faker.random.number({ min: 0, max: 100 }),
        maxLandSpeed: faker.random.number({ min: 0, max: 100 }),
      },
    };
  },
});

const payloadsSeed = userId => ({
  collection: Payloads,
  environments: ['development', 'staging'],
  noLimit: true,
  modelCount: 1,
  model(dataIndex, faker) {
    return {
      owner: userId,
      name: 'Sony',
      registrationNumber: faker.random.number(),
      model: 'Next 7',
      weight: faker.random.number({ min: 0, max: 21 }),
      payloadType: 'Camera',
      sensorParameters: {
        focalLength: 16,
        sensorWidth: 23.5,
        sensorHeight: 15.6,
        imageWidth: 6000,
        imageHeight: 4000,
      },
    };
  },
});

const batteriesSeed = userId => ({
  collection: Batteries,
  environments: ['development', 'staging'],
  noLimit: true,
  modelCount: 1,
  model(faker) {
    return {
      owner: userId,
      name: faker.commerce.productName(),
      model: faker.commerce.productAdjective(),
      registrationNumber: faker.random.number(),
      amperes: faker.random.number({ min: 0, max: 100 }),
      cellNumber: faker.random.number({ min: 0, max: 50 }),
      weight: faker.random.number({ min: 0, max: 500 }),
    };
  },
});

const missionsSeed = (userId, projectId) => ({
  collection: Missions,
  environments: ['development', 'staging'],
  noLimit: true,
  modelCount: 5,
  model(dataIndex, faker) {
    return {
      owner: userId,
      project: projectId,
      name: `Mission #${dataIndex + 1}`,
      description: `This is the description of Mission #${dataIndex + 1}`,
      rpa: '',
      payload: '',
      missionType: faker.random.arrayElement(['Surface Area', 'Linear Area']),
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
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [faker.address.longitude(), faker.address.latitude(), 0],
        },
        properties: { zoom: faker.random.number({ min: 0, max: 15 }) },
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
        first: 'Admin',
        last: 'User',
      },
    },
    roles: ['admin'],
    data(userId) {
      // return [
      //   projectsSeed(userId),
      //   rpasSeed(userId),
      //   payloadsSeed(userId),
      //   batteriesSeed(userId),
      // ];
      // ////
      // projectsSeed(userId);
      // rpasSeed(userId);
      // payloadsSeed(userId);
      // batteriesSeed(userId);
      // ////
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
        // return [
        //   projectsSeed(userId),
        //   rpasSeed(userId),
        //   payloadsSeed(userId),
        //   batteriesSeed(userId),
        // ];
        // ////
        // projectsSeed(userId);
        // rpasSeed(userId);
        // payloadsSeed(userId);
        // batteriesSeed(userId);
        // ////
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
