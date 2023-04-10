import { /* inject, */ BindingScope, injectable} from '@loopback/core';
import {repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {UserProfile} from '@loopback/security';
import {RolmenuRepository} from '../repositories';

@injectable({scope: BindingScope.TRANSIENT})
export class AuthService {
  constructor(
    @repository(RolmenuRepository)
    private rolMenuRepository: RolmenuRepository
  ) { }


  async checkUserPermissionByRole(idRol: string, idMenu: string, action: string): Promise<UserProfile | undefined> {
    let permission = await this.rolMenuRepository.findOne({
      where: {
        rolId: idRol,
        menuId: idMenu
      }
    });
    console.log(permission);
    let keep: boolean = false;
    if (permission) {
      switch (action) {
        case "save":
          keep = permission.save;
          break;
        case "edit":
          keep = permission.edit;
          break;
        case "list":
          keep = permission.list;
          break;
        case "eliminate":
          keep = permission.eliminate;
          break;
        case "download":
          keep = permission.download;
          break;

        default:
          throw new HttpErrors[401]("The action cannot be executed because it does not exist.");
      }
      if (keep) {
        let profile: UserProfile = Object.assign({
          permitted: "OK"
        });
        return profile;
      } else {
        return undefined;
      }
    } else {
      throw new HttpErrors[401]("It is not possible to execute the action due to lack of permissions.");
    }
  }

}
