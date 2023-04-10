import { /* inject, */ BindingScope, injectable} from '@loopback/core';
import {repository} from '@loopback/repository';
import {securityConfig} from '../config/config.security';
import {AuthenticationFactorByCode, Credentials, User} from '../models';
import {LoginRepository, UserRepository} from '../repositories';
const generator = require('generate-password');
const MD5 = require('crypto-js/md5');
const jwt = require('jsonwebtoken');

@injectable({scope: BindingScope.TRANSIENT})
export class securityService {
  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository,
    @repository(LoginRepository)
    public loginRepository: LoginRepository
  ) { }

  /**
   * create random password
   * @returns  10 character random string
   */
  createRandomText(n: number): string {
    let password = generator.generate({
      lenght: 10,
      numbers: true
    });
    return password
  }

  /**
   * Encrypt string with md5 method
   * @param text text to encrypt
   * @returns string encrypted with md5
   */
  encryptText(text: string): string {
    let encryptText = MD5(text).toString();
    return encryptText
  }

  /**
   * Search for a user by their access credentials
   * @param credenciales  user credentials
   * @returns user found or null
   */
  async identifyUser(credentials: Credentials): Promise<User | null> {
    let user = await this.userRepository.findOne({
      where: {
        email: credentials.email,
        password: credentials.password
      }
    });
    return user as User;
  }

  /**
   * Validate a 2fa code for a User
   * @param credentials2FA user credentials with the 2fa code
   * @returns el registro de login o null
   */

  async validateCode2fa(credentials2FA: AuthenticationFactorByCode): Promise<User | null> {
    let login = await this.loginRepository.findOne({
      where: {
        userId: credentials2FA.userId,
        code2FA: credentials2FA.code2FA,
        statusCode2FA: false
      }
    });
    if (login) {
      let usuario = await this.userRepository.findById(credentials2FA.userId);
      return usuario;
    }
    return null;
  }

  /**
   * generate JWT
   * @param usuario User info
   * @returns token
   */
  createToken(user: User): string {
    let datos = {
      name: `${user.firstName} ${user.middleName} ${user.firstSurname} ${user.secondSurname}`,
      role: user.rolId,
      email: user.email
    };
    let token = jwt.sign(datos, securityConfig.keyJWT)
    return token;
  }

  /**
   * validates and gets the role of a token
   * @param tk The token
   * @returns Id role
   */

  getRoleFromToken(tk: string): string {
    let obj = jwt.verify(tk, securityConfig.keyJWT);
    return obj.role;
  }

}
