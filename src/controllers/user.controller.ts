import {authenticate} from '@loopback/authentication/dist/decorators';
import {service} from '@loopback/core';
import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where
} from '@loopback/repository';
import {
  del, get,
  getModelSchemaRef, HttpErrors, param, patch, post, put, requestBody,
  response
} from '@loopback/rest';
import {UserProfile} from '@loopback/security';
import {securityConfig} from '../config/config.security';
import {AuthenticationFactorByCode, Credentials, Login, PermissionsRoleMenu, User} from '../models';
import {LoginRepository, UserRepository} from '../repositories';
import {securityService} from '../services';
import {AuthService} from '../services/auth.service';

export class UserController {
  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository,
    @service(securityService)
    public securityService: securityService,
    @repository(LoginRepository)
    public loginRepository: LoginRepository,
    @service(AuthService)
    private serviceAuth: AuthService
  ) { }

  @authenticate({
    strategy: "auth",
    options: [securityConfig.menuUserId, securityConfig.saveAction]
  })
  @post('/user')
  @response(200, {
    description: 'User model instance',
    content: {'application/json': {schema: getModelSchemaRef(User)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(User, {
            title: 'NewUser',
            exclude: ['_id'],
          }),
        },
      },
    })
    user: Omit<User, '_id'>,
  ): Promise<User> {
    let password = this.securityService.createRandomText(10);
    let encrypPassword = this.securityService.encryptText(password);
    user.password = encrypPassword
    //eviar correo electronico de notificacion

    return this.userRepository.create(user);
  }

  @authenticate({
    strategy: "auth",
    options: [securityConfig.menuUserId, securityConfig.listAction]
  })
  @get('/user/count')
  @response(200, {
    description: 'User model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(User) where?: Where<User>,
  ): Promise<Count> {
    return this.userRepository.count(where);
  }

  @authenticate({
    strategy: "auth",
    options: [securityConfig.menuUserId, securityConfig.listAction]
  })
  @get('/user')
  @response(200, {
    description: 'Array of User model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(User, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(User) filter?: Filter<User>,
  ): Promise<User[]> {
    return this.userRepository.find(filter);
  }

  @authenticate({
    strategy: "auth",
    options: [securityConfig.menuUserId, securityConfig.editAction]
  })
  @patch('/user')
  @response(200, {
    description: 'User PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(User, {partial: true}),
        },
      },
    })
    user: User,
    @param.where(User) where?: Where<User>,
  ): Promise<Count> {
    return this.userRepository.updateAll(user, where);
  }

  @authenticate({
    strategy: "auth",
    options: [securityConfig.menuUserId, securityConfig.listAction]
  })
  @get('/user/{id}')
  @response(200, {
    description: 'User model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(User, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(User, {exclude: 'where'}) filter?: FilterExcludingWhere<User>
  ): Promise<User> {
    return this.userRepository.findById(id, filter);
  }


  @authenticate({
    strategy: "auth",
    options: [securityConfig.menuUserId, securityConfig.editAction]
  })
  @patch('/user/{id}')
  @response(204, {
    description: 'User PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(User, {partial: true}),
        },
      },
    })
    user: User,
  ): Promise<void> {
    await this.userRepository.updateById(id, user);
  }

  @authenticate({
    strategy: "auth",
    options: [securityConfig.menuUserId, securityConfig.editAction]
  })
  @put('/user/{id}')
  @response(204, {
    description: 'User PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() user: User,
  ): Promise<void> {
    await this.userRepository.replaceById(id, user);
  }

  @authenticate({
    strategy: "auth",
    options: [securityConfig.menuUserId, securityConfig.eliminateAction]
  })
  @del('/user/{id}')
  @response(204, {
    description: 'User DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.userRepository.deleteById(id);
  }
  /**
    * Metodos personalizados para la API
    */

  @post('/identify-user')
  @response(200, {
    description: "Identify user by email and password",
    content: {'application/json': {schema: getModelSchemaRef(User)}}
  })
  async identifyUser(
    @requestBody(
      {
        content: {
          'application/json': {
            schema: getModelSchemaRef(Credentials)
          }
        }
      }
    )
    credentials: Credentials
  ): Promise<object> {
    let user = await this.securityService.identifyUser(credentials);
    if (user) {
      let codigo2fa = this.securityService.createRandomText(5);
      //console.log(codigo2fa);
      let login: Login = new Login();
      login.userId = user._id!;
      login.code2FA = codigo2fa;
      login.statusCode2FA = false;
      login.token = "";
      login.statusToken = false;
      this.loginRepository.create(login);
      user.password = "";
      //notificar al usuario via correo o msg
      return user;
    }
    return new HttpErrors[401]("incorrect credentials")
  }



  @post('/validate-permissions')
  @response(200, {
    description: "validation of user permissions for business logic",
    content: {'application/json': {schema: getModelSchemaRef(PermissionsRoleMenu)}}
  })
  async ValidateUserPermissions(
    @requestBody(
      {
        content: {
          'application/json': {
            schema: getModelSchemaRef(PermissionsRoleMenu)
          }
        }
      }
    )
    datos: PermissionsRoleMenu
  ): Promise<UserProfile | undefined> {
    let idRol = this.securityService.getRoleFromToken(datos.token);
    return this.serviceAuth.checkUserPermissionByRole(idRol, datos.idMenu, datos.action);

  }



  @post('/validate-2fa')
  @response(200, {
    description: "validate a 2fa code"
  })
  async verifyCode2FA(
    @requestBody(
      {
        content: {
          'application/json': {
            schema: getModelSchemaRef(AuthenticationFactorByCode)
          }
        }
      }
    )
    credentials: AuthenticationFactorByCode
  ): Promise<object> {
    let user = await this.securityService.validateCode2fa(credentials);
    if (user) {
      let token = this.securityService.createToken(user)
      if (user) {
        user.password = "";
        try {
          this.userRepository.logins(user._id).patch({
            statusCode2FA: true,
            token: token
          }, {
            statusCode2FA: false
          });
        } catch {
          console.log("Token state change not stored in database")
        }
        return {
          user: user,
          token: token
        };
      }
    }

    return new HttpErrors[401]("Invalid 2fa code for user defined")
  }

}
