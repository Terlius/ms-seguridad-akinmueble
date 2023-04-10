import {Entity, model, property, hasMany} from '@loopback/repository';
import {Menu} from './menu.model';
import {Rolmenu} from './rolmenu.model';
import {User} from './user.model';

@model()
export class Rol extends Entity {
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

  @hasMany(() => Menu, {through: {model: () => Rolmenu}})
  menus: Menu[];

  @hasMany(() => User)
  users: User[];

  constructor(data?: Partial<Rol>) {
    super(data);
  }
}

export interface RolRelations {
  // describe navigational properties here
}

export type RolWithRelations = Rol & RolRelations;
