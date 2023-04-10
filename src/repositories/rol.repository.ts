import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyThroughRepositoryFactory, HasManyRepositoryFactory} from '@loopback/repository';
import {MongodbDataSource} from '../datasources';
import {Rol, RolRelations, Menu, Rolmenu, User} from '../models';
import {RolmenuRepository} from './rolmenu.repository';
import {MenuRepository} from './menu.repository';
import {UserRepository} from './user.repository';

export class RolRepository extends DefaultCrudRepository<
  Rol,
  typeof Rol.prototype._id,
  RolRelations
> {

  public readonly menus: HasManyThroughRepositoryFactory<Menu, typeof Menu.prototype._id,
          Rolmenu,
          typeof Rol.prototype._id
        >;

  public readonly users: HasManyRepositoryFactory<User, typeof Rol.prototype._id>;

  constructor(
    @inject('datasources.mongodb') dataSource: MongodbDataSource, @repository.getter('RolmenuRepository') protected rolmenuRepositoryGetter: Getter<RolmenuRepository>, @repository.getter('MenuRepository') protected menuRepositoryGetter: Getter<MenuRepository>, @repository.getter('UserRepository') protected userRepositoryGetter: Getter<UserRepository>,
  ) {
    super(Rol, dataSource);
    this.users = this.createHasManyRepositoryFactoryFor('users', userRepositoryGetter,);
    this.registerInclusionResolver('users', this.users.inclusionResolver);
    this.menus = this.createHasManyThroughRepositoryFactoryFor('menus', menuRepositoryGetter, rolmenuRepositoryGetter,);
    this.registerInclusionResolver('menus', this.menus.inclusionResolver);
  }
}
