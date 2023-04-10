import {AuthenticationBindings, AuthenticationMetadata, AuthenticationStrategy} from '@loopback/authentication';
import {inject, service} from '@loopback/core';
import {repository} from '@loopback/repository';
import {HttpErrors, Request} from '@loopback/rest';
import {UserProfile} from '@loopback/security';
import parseBearerToken from 'parse-bearer-token';
import {RolmenuRepository} from '../repositories';
import {securityService} from '../services';
import {AuthService} from '../services/auth.service';

export class BasicAuthenticationStrategy implements AuthenticationStrategy {
  name: string = 'auth';

  constructor(
    @service(securityService)
    private securityService: securityService,
    @inject(AuthenticationBindings.METADATA)
    private metadata: AuthenticationMetadata[],
    @repository(RolmenuRepository)
    private rolMenuRepository: RolmenuRepository,
    @service(AuthService)
    private authService: AuthService
  ) {

  }

  /**
   * Autenticación de un usuario frente a una acción en la base de datos
   * @param request la solicitud con el token
   * @returns el perfil de usuario, undefined cuando no tiene permiso o un httpError
   */
  async authenticate(request: Request): Promise<UserProfile | undefined> {
    let token = parseBearerToken(request);
    if (token) {
      let idRol = this.securityService.getRoleFromToken(token);
      let idMenu: string = this.metadata[0].options![0];
      let action: string = this.metadata[0].options![1];
      console.log(this.metadata);
      try {
        let res = await this.authService.checkUserPermissionByRole(idRol, idMenu, action);
        return res;
      } catch (e) {
        throw e;
      }
    }
    throw new HttpErrors[401]("It's not possible to execute the action due to lack of a token.");
  }
}

