import { existsSync } from 'fs';
import { join } from 'path';
import { BadRequestException, Injectable } from '@nestjs/common';

@Injectable()
export class FilesService {
  getStaticProductImage(imageName: string) {
    //path fisico donde debe estar la inagen
    const path = join(__dirname, '../../static/products', imageName);

    //verifiquemos si el patch existe, utilizando el método existsSync()?

    if (!existsSync(path)) {
      throw new BadRequestException(`No product found with image ${imageName}`);
    }
    //retornamo el path ya que existe
    // 📝 NOTA: Colocomeos un console.log para mostrar el path
    console.log({ direccion: path });
    return path;
  }
}
