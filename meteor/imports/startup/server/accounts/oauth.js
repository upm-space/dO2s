import { Meteor } from 'meteor/meteor';
import { ServiceConfiguration } from 'meteor/service-configuration';


let OAuthSettings = {
  facebook: { appId: '', secret: '', loginStyle: 'popup' },
  google: { clientId: '', secret: '', loginStyle: 'popup' },
};


if (Meteor.settings && Meteor.settings.private && Meteor.settings.private.OAuth) {
  OAuthSettings = Meteor.settings.private.OAuth;
}

if (OAuthSettings) {
  Object.keys(OAuthSettings).forEach((service) => {
    ServiceConfiguration.configurations.upsert(
      { service },
      { $set: OAuthSettings[service] },
    );
  });
}
