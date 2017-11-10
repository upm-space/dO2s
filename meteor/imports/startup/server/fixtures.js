import seeder from '@cleverbeagle/seeder';
import { Meteor } from 'meteor/meteor';
import faker from 'faker';
import Projects from '../../api/Projects/Projects';
import Missions from '../../api/Missions/Missions';

import RPAs from '../../api/RPAs/RPAs';
import Payloads from '../../api/Payloads/Payloads';
import Batteries from '../../api/Batteries/Batteries';

const GeoDroneRPA = (userId) => {
  const RPAsVector = [];
  for (let i = 0; i < 5; i += 1) {
    if (i === 0) {
      RPAsVector.push({
        owner: userId,
        name: 'GeoDrone Conyca',
        rpaType: 'Plane',
        model: 1,
        registrationNumber: 12345,
        constructionDate: (new Date()).toISOString(),
        serialNumber: 12345,
        weight: 5,
        flightParameters: {
          maxDescendSlope: 0,
          maxAscendSlope: 0,
          optimalLandingSlope: 7,
          optimalTakeOffSlope: 0,
          maxLandSpeed: 0,
        },
      });
    }
    RPAsVector.push({
      owner: userId,
      name: faker.commerce.productName(),
      rpaType: faker.random.arrayElement(['Plane', 'MultiCopter']),
      model: faker.commerce.productAdjective(),
      registrationNumber: faker.random.number(),
      constructionDate: faker.date.past().toISOString(),
      serialNumber: faker.random.number(),
      weight: faker.random.number({ min: 0, max: 1000 }),
      flightParameters: {
        maxDescendSlope: faker.random.number({ min: 0, max: 100 }),
        maxAscendSlope: faker.random.number({ min: 0, max: 100 }),
        optimalLandingSlope: faker.random.number({ min: 0, max: 100 }),
        optimalTakeOffSlope: faker.random.number({ min: 0, max: 100 }),
        maxLandSpeed: faker.random.number({ min: 0, max: 100 }),
      },
    });
  }
  return RPAsVector;
};


const CamerasVector = (userId) => {
  const camerasVector = [];
  for (let i = 0; i < 5; i += 1) {
    if (i === 0) {
      camerasVector.push({
        owner: userId,
        name: 'Sony',
        registrationNumber: 12343,
        model: 'Next 7',
        weight: 500,
        payloadType: 'Camera',
        sensorParameters: {
          focalLength: 16,
          sensorWidth: 23.5,
          sensorHeight: 15.6,
          imageWidth: 6000,
          imageHeight: 4000,
        },
      });
    }
    camerasVector.push({
      owner: userId,
      name: faker.commerce.productName(),
      registrationNumber: faker.random.number(),
      model: faker.commerce.productAdjective(),
      weight: faker.random.number({ min: 0, max: 100 }),
      payloadType: 'Camera',
      sensorParameters: {
        focalLength: faker.random.number({ min: 0, max: 50 }),
        sensorWidth: faker.random.number({ min: 0, max: 50 }),
        sensorHeight: faker.random.number({ min: 0, max: 50 }),
        imageWidth: faker.random.number({ min: 400, max: 10000 }),
        imageHeight: faker.random.number({ min: 600, max: 10000 }),
      },
    });
  }
  return camerasVector;
};

const batteriesSeed = (userId) => {
  const batteriesVector = [];
  for (let i = 0; i < 5; i += 1) {
    batteriesVector.push({
      owner: userId,
      name: faker.commerce.productName(),
      model: faker.commerce.productAdjective(),
      registrationNumber: faker.random.number(),
      amperes: faker.random.number({ min: 0, max: 100 }),
      cellNumber: faker.random.number({ min: 0, max: 50 }),
      weight: faker.random.number({ min: 0, max: 500 }),
    });
  }
  return batteriesVector;
};

const missionsSeed = (userId, projectId, rpasPayloadsIDS) => ({
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
      rpa: faker.random.arrayElement(rpasPayloadsIDS.rpasIds),
      payload: faker.random.arrayElement(rpasPayloadsIDS.payloadIds),
      missionType: faker.random.arrayElement(['Surface Area', 'Linear Area']),
    };
  },
});


const projectsSeed = (userId, rpasPayloadsIDS) => ({
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
          coordinates: [faker.address.longitude(), faker.address.latitude()],
        },
        properties: { zoom: faker.random.number({ min: 0, max: 15 }) },
      },
      data(projectId) {
        return missionsSeed(userId, projectId, rpasPayloadsIDS);
      },
    };
  },
});

const insertOtherData = (userId) => {
  const userRPASPayloads = {
    rpasIds: [],
    payloadIds: [],
  };
  GeoDroneRPA(userId).forEach((rpa) => {
    const rpaID = RPAs.insert(rpa);
    userRPASPayloads.rpasIds.push(rpaID);
  });
  CamerasVector(userId).forEach((camera) => {
    const payloadID = Payloads.insert(camera);
    userRPASPayloads.payloadIds.push(payloadID);
  });
  batteriesSeed(userId).forEach((battery) => {
    Batteries.insert(battery);
  });
  return userRPASPayloads;
};

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
      const userItemIDS = insertOtherData(userId);
      return projectsSeed(userId, userItemIDS);
    },
  }],
  // modelCount: 5,
  // model(index, faker) {
  //   const userCount = index + 1;
  //   return {
  //     email: `user+${userCount}@test.com`,
  //     password: 'password',
  //     profile: {
  //       name: {
  //         first: faker.name.firstName(),
  //         last: faker.name.lastName(),
  //       },
  //     },
  //     roles: ['free-user'],
  //     data(userId) {
  //       const userItemIDS = insertOtherData(userId);
  //       return projectsSeed(userId, userItemIDS);
  //     },
  //   };
  // },
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
