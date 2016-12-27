export function initialize(application) {
  application.inject('controller', 'configService', 'service:config-service');
  application.inject('route', 'configService', 'service:config-service');
}

export default {
  name: 'app-config-initializer',
  initialize
};
