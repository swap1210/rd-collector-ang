import { writeFile } from 'fs';

const targetPath1 = './src/environments/environment.ts';
const targetPath2 = './src/environments/environment.prod.ts';
let x = process.env['FIREBASE_KEY'];
x = x ? x : '';
console.log("*x*",x);
let temp = JSON.parse(x);
// for (let i = 1; i < x.length - 1; i++) {
//   if (x.charAt(i) === ':') {
//     temp += '"' + x.charAt(i) + '"';
//   } else if (x.charAt(i) === ',') {
//     temp += '"' + x.charAt(i) + '"';
//   } else {
//     temp += x.charAt(i);
//   }
// }
//temp = '{"' + temp.substring(0, temp.length - 2) + '}';
const envConfigFile1 = `export const environment = {
   production: false,
   instance: 'Development',
   firebase: ${temp}
    ,
    version: 1.3
};
`;
const envConfigFile2 = `export const environment = {
   production: true,
   instance: 'Production',
   firebase: ${temp},
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
