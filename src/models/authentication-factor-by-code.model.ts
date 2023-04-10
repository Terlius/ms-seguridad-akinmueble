import {Model, model, property} from '@loopback/repository';

@model()
export class AuthenticationFactorByCode extends Model {
  @property({
    type: 'string',
    required: true,
  })
  userId: string;

  @property({
    type: 'string',
    required: true,
  })
  code2FA: string;


  constructor(data?: Partial<AuthenticationFactorByCode>) {
    super(data);
  }
}

export interface AuthenticationFactorByCodeRelations {
  // describe navigational properties here
}

export type AuthenticationFactorByCodeWithRelations = AuthenticationFactorByCode & AuthenticationFactorByCodeRelations;
