import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
  response,
} from '@loopback/rest';
import {Rolmenu} from '../models';
import {RolmenuRepository} from '../repositories';

export class PermissionsController {
  constructor(
    @repository(RolmenuRepository)
    public rolmenuRepository : RolmenuRepository,
  ) {}

  @post('/permissions')
  @response(200, {
    description: 'Rolmenu model instance',
    content: {'application/json': {schema: getModelSchemaRef(Rolmenu)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Rolmenu, {
            title: 'NewRolmenu',
            exclude: ['_id'],
          }),
        },
      },
    })
    rolmenu: Omit<Rolmenu, '_id'>,
  ): Promise<Rolmenu> {
    return this.rolmenuRepository.create(rolmenu);
  }

  @get('/permissions/count')
  @response(200, {
    description: 'Rolmenu model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Rolmenu) where?: Where<Rolmenu>,
  ): Promise<Count> {
    return this.rolmenuRepository.count(where);
  }

  @get('/permissions')
  @response(200, {
    description: 'Array of Rolmenu model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Rolmenu, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Rolmenu) filter?: Filter<Rolmenu>,
  ): Promise<Rolmenu[]> {
    return this.rolmenuRepository.find(filter);
  }

  @patch('/permissions')
  @response(200, {
    description: 'Rolmenu PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Rolmenu, {partial: true}),
        },
      },
    })
    rolmenu: Rolmenu,
    @param.where(Rolmenu) where?: Where<Rolmenu>,
  ): Promise<Count> {
    return this.rolmenuRepository.updateAll(rolmenu, where);
  }

  @get('/permissions/{id}')
  @response(200, {
    description: 'Rolmenu model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Rolmenu, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Rolmenu, {exclude: 'where'}) filter?: FilterExcludingWhere<Rolmenu>
  ): Promise<Rolmenu> {
    return this.rolmenuRepository.findById(id, filter);
  }

  @patch('/permissions/{id}')
  @response(204, {
    description: 'Rolmenu PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Rolmenu, {partial: true}),
        },
      },
    })
    rolmenu: Rolmenu,
  ): Promise<void> {
    await this.rolmenuRepository.updateById(id, rolmenu);
  }

  @put('/permissions/{id}')
  @response(204, {
    description: 'Rolmenu PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() rolmenu: Rolmenu,
  ): Promise<void> {
    await this.rolmenuRepository.replaceById(id, rolmenu);
  }

  @del('/permissions/{id}')
  @response(204, {
    description: 'Rolmenu DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.rolmenuRepository.deleteById(id);
  }
}
