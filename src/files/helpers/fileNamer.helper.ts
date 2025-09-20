//? 📝 NOTA: Caremos  funcion que  necsita un petición , el archivo y una funcion callback para delvolver un trur o un false

import { v4 as uuid } from 'uuid';

export const fileNamer = (
  req: Express.Request, // ?📝 NOTA:  Se recibe y se  expresa e esta manera para no tene que importarlo de la Requet
  file: Express.Multer.File, //? 📝 NOTA: Igualque que la explicacion de arriba.
  callback: Function, // 📝 NOTA: Este collback ed de tipo Function .
) => {
  //console.log(file); // 📝 NOTA:  Para ver en closola el archivo que estoy subiendo
  // 📝 NOTA: Evaluemos si  no viene  el archivo
  if (!file) return callback(new Error('file is empty'), false);

  const fileExtension = file.mimetype.split('/')[1];

  //creamo un nuevo noobre para el archivo
  const fileName = `${uuid()}.${fileExtension}`;

  // 📝 NOTA: Si  viene la extesion valida para la imagen el callback devolverá un el nuevo nombre de la imagem.
  callback(null, fileName); // 📝 NOTA: llamamos la funtion callback.
};
//! 👉 IMPORTANTE: la codificacion amteriir es para aceptar un archivo
