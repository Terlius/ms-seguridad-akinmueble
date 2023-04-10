import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MongodbDataSource} from '../datasources';
import {Rolmenu, RolmenuRelations} from '../models';

export class RolmenuRepository extends DefaultCrudRepository<
  Rolmenu,
  typeof Rolmenu.prototype._id,
  RolmenuRelations
> {
  constructor(
    @inject('datasources.mongodb') dataSource: MongodbDataSource,
  ) {
    super(Rolmenu, dataSource);
  }
}
