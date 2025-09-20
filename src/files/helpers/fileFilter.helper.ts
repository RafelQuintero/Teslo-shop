//? 📝 NOTA: Caremos  funcion que  necsita un petición , el archivo y una funcion callback para delvolver un trur o un false

import { notEqual } from 'assert';

// export const fileFilter = (
//   req: Express.Request,
//   file: Express.Multer.File,
//   callback: (error: Error | null, acceptFile: boolean) => void
// ) => {
//   // Example: accept only image files
//   if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
// 	return callback(new Error('Only image files are allowed!'), false);
//   }
//   callback(null, true);
// };
export const fileFilter = (
  req: Express.Request, // ?📝 NOTA: SE expresa e esta manera para no tene que importarlo de la Requet
  file: Express.Multer.File, //? 📝 NOTA: Igualque que la explicacion de arriba.
  callback: Function, // 📝 NOTA: Este collback ed de tipo Function .
) => {
  //console.log(file); // 📝 NOTA:  Para ver en closola el archivo que estoy subiendo
  // 📝 NOTA: Evaluemos si  no viene  el archivo
  if (!file) return callback(new Error('file is empty'), false);
  const fileExptension = file.mimetype.split('/')[1]; // 📝 NOTA: La funcion mimetype me indica que tipo de aplicación es la imagen
  const validExptensions = ['jpg', 'jpeg', 'png', 'gif']; // 📝 NOTA: ESta son la extension permitida para las aplicaciones de la imagen

  if (validExptensions.includes(fileExptension)) {
    return callback(null, true);
  }

  // 📝 NOTA: Si  no viene la exptesion valida ara la imagen el callback devolverá un false.
  callback(null, false); // 📝 NOTA: llamamos la funtion callback.
};
//! 👉 IMPORTANTE: la codificacion amteriir es para aceptar un archivo
