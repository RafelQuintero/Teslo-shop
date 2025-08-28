import { Type } from 'class-transformer';
import { IsOptional, IsPositive, Min } from 'class-validator';

//todo. Sera exactamente igual que el dto de los products
export class PaginationDto {
  //Recuerde que estos dto no transforman la data, solo validan.
  //Para transformar la data, se debe usar un pipe de transformacion
  //Es decir si llega un string '10' lo transforme a number 10

  @IsOptional()
  @IsPositive()
  @Type(() => Number) //Transforma a number el valor que llega por query
  limit?: number;

  @IsOptional()
  @Min(0)
  @Type(() => Number) //Transforma a number el valor que llega por query
  offset?: number;
}
