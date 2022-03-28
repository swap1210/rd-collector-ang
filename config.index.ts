import { writeFile } from 'fs';

const targetPath1 = './src/environments/environment.ts';
const targetPath2 = './src/environments/environment.prod.ts';
const ky = process.env['FIREBASE_KEY'];
const envConfigFile1 = `export const environment = {
   production: false,
   instance: 'Development',
   firebase: ${ky},
    version: 1.3
};
`;
const envConfigFile2 = `export const environment = {
   production: true,
   instance: 'Production',
   firebase: {
        apiKey: '${ky}'
    },
    version: 1.3
};
`;

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
