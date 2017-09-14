const parseGoogleData = service => ({
  email: service.email,
  name: {
    first: service.given_name,
    last: service.family_name,
  },
});

const parseFacebookData = service => ({
  email: service.email,
  name: {
    first: service.first_name,
    last: service.last_name,
  },
});

const getDataForService = (profile, services) => {
  if (services.facebook) return parseFacebookData(services.facebook);
  if (services.google) return parseGoogleData(services.google);
};

export default (options, user) => {
  const isOAuth = !options.password;
  const serviceData = isOAuth ? getDataForService(options.profile, user.services) : null;
  return isOAuth ? serviceData : null;
};
