import { mkdir, writeFile } from 'fs';

const targetPath1 = './src/environments/environment.ts';
const targetPath2 = './src/environments/environment.prod.ts';
let x = process.env['APIKEY'];
x = x ? x : '';
const envConfigFile1 = `export const environment = {
   production: false,
   instance: 'Development',
   firebase: {
                "apiKey": '${x}',
                "authDomain": 'poorti-21857.firebaseapp.com',
                "projectId": 'poorti-21857',
              },
    version: 1.3
};
`;
const envConfigFile2 = `export const environment = {
   production: true,
   instance: 'Production',
   firebase: {
              "apiKey": '${x}',
              "authDomain": 'poorti-21857.firebaseapp.com',
              "projectId": 'poorti-21857',
            },
    version: 1.3
};
`;
mkdir('./src/environments/', (err) => {
  if (err) {
    return console.log(err);
  }
});
writeFile(targetPath1, envConfigFile1, 'utf8', (err) => {
  if (err) {
    return console.log(err);
  }
});
writeFile(targetPath2, envConfigFile2, 'utf8', (err) => {
  if (err) {
    return console.log(err);
  }
});
