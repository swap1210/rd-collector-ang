import { writeFile } from 'fs';

const targetPath = './src/environments/environment.prod.ts';

const envConfigFile = `export const environment = {
   production: true,
   instance: 'Production',
   firebase: {
        apiKey: '${process.env?.['FIREBASE_API_KEY']}'
    },
    version: 1.3
};
`;

writeFile(targetPath, envConfigFile, 'utf8', (err) => {
  if (err) {
    return console.log(err);
  }
});
