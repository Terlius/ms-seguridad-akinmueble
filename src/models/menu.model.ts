import {Entity, model, property, hasMany} from '@loopback/repository';
import {Rol} from './rol.model';
import {Rolmenu} from './rolmenu.model';

@model()
export class Menu extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  _id?: string;

  @property({
    type: 'string',
    required: true,
  })
  name: string;

  @property({
    type: 'string',
    required: true,
  })
  comment: string;

  @hasMany(() => Rol, {through: {model: () => Rolmenu}})
  rols: Rol[];

  constructor(data?: Partial<Menu>) {
    super(data);
  }
}

export interface MenuRelations {
  // describe navigational properties here
}

export type MenuWithRelations = Menu & MenuRelations;
