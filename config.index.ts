import { mkdir, writeFile } from 'fs';
const { version, author } = require('./package.json');

const targetPath1 = './src/environments/environment.ts';
const targetPath2 = './src/environments/environment.prod.ts';
let apiKey = process.env['APIKEY'];
apiKey = apiKey ? apiKey : '';
const appName = 'RD कलेक्टर';
const envConfigFile1 = `export const environment = {
   production: false,
   instance: 'Development',
   firebase: {
                "apiKey": '${apiKey}',
                "authDomain": 'poorti-21857.firebaseapp.com',
                "projectId": 'poorti-21857',
              },
    version: '${version}-dev',
    appName: '${appName}',
    author: '${author.name}',
    url: '${author.url}',
    email: '${author.email}'
};
`;
const envConfigFile2 = `export const environment = {
   production: true,
   instance: 'Production',
   firebase: {
              "apiKey": '${apiKey}',
              "authDomain": 'poorti-21857.firebaseapp.com',
              "projectId": 'poorti-21857',
            },
    version: '${version}',
    appName: '${appName}',
    author: '${author.name}',
    url: '${author.url}',
    email: '${author.email}'
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
