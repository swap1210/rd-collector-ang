let va = process.env['FIREBASE_KEY'] ? process.env['FIREBASE_KEY'] : '';

export const environment = {
  production: true,
  version: 1.2,
  instance: 'Production',
  firebase: JSON.parse(va),
};
