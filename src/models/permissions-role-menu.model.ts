import {Model, model, property} from '@loopback/repository';

@model()
export class PermissionsRoleMenu extends Model {
  @property({
    type: 'string',
    required: true,
  })
  token: string;

  @property({
    type: 'string',
    required: true,
  })
  idMenu: string;

  @property({
    type: 'string',
    required: true,
  })
  action: string;


  constructor(data?: Partial<PermissionsRoleMenu>) {
    super(data);
  }
}

export interface PermissionsRoleMenuRelations {
  // describe navigational properties here
}

export type PermissionsRoleMenuWithRelations = PermissionsRoleMenu & PermissionsRoleMenuRelations;
