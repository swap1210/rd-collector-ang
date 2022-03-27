import { pass } from '../shh/fin';

export const environment = {
  production: false,
  instance: 'Development',
  version: 1.3,
  firebase: pass.value,
};
