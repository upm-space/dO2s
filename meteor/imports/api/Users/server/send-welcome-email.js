import { Meteor } from 'meteor/meteor';
import sendEmail from '../../../modules/server/send-email';
import getOAuthProfile from '../../../modules/get-oauth-profile';

export default (options, user) => {
  const OAuthProfile = getOAuthProfile(options, user);

  const applicationName = 'Ipsilum';
  const firstName = OAuthProfile ? OAuthProfile.name.first : options.profile.name.first;
  const emailAddress = OAuthProfile ? OAuthProfile.email : options.email;

  return sendEmail({
    to: emailAddress,
    from: `${applicationName} <info@srmconsulting.es>`,
    subject: `[${applicationName}] Welcome, ${firstName}!`,
    template: 'welcome',
    templateVars: {
      applicationName,
      firstName,
      welcomeUrl: Meteor.absoluteUrl('projects'), // e.g., returns http://localhost:3000/projects
    },
  })
    .catch((error) => {
      throw new Meteor.Error('500', `${error}`);
    });
};
