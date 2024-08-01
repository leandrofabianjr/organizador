import { Injectable } from '@nestjs/common';
import { isUUID } from 'class-validator';

import { PaginatedResponse } from 'src/commons/interfaces/paginated-response';
import { PaginatedServiceFilters } from 'src/commons/interfaces/paginated-service-filters';
import { DeepPartial, FindOptionsWhere, Raw, Repository } from 'typeorm';
import { ViewException } from '../exceptions/view.exception';
import { RepositoryBaseEntity } from './repository-base.entity';

@Injectable()
export abstract class BaseService<
  T extends RepositoryBaseEntity,
  TDto extends Object,
> {
  constructor(protected repository: Repository<T>) {}

  private buildOptionsToFilter(
    options?: PaginatedServiceFilters<T>,
  ): PaginatedServiceFilters<T> {
    if (options?.searchFields?.length && options?.search?.length) {
      options.where = {};
      options.searchFields.forEach((field) => {
        options.where[field] = Raw((v) => `LOWER(${v}) Like LOWER(:value)`, {
          value: `%${options.search}%`,
        });
      });
      delete options.search;
    }
    console.log(options);
    return options;
  }

  abstract buildPartial(dto: TDto): Promise<DeepPartial<T>>;

  async validateBeforeCreate(dto: TDto): Promise<string> {
    return null;
  }

  async validateBeforeEdit(id: string, dto: TDto): Promise<string> {
    return null;
  }

  get(id: string): Promise<T> {
    if (!isUUID(id)) {
      return new Promise((resolve) => resolve(null));
    }

    return this.repository.findOne({
      // Typecast needed due to a bug (https://github.com/typeorm/typeorm/issues/8939)
      where: { id } as unknown as FindOptionsWhere<T>,
    });
  }

  filter(options?: PaginatedServiceFilters<T>): Promise<T[]> {
    console.log(options);
    options = this.buildOptionsToFilter(options);
    console.log(options);
    return this.repository.find(options);
  }

  async filterPaginated(
    options?: PaginatedServiceFilters<T>,
  ): Promise<PaginatedResponse<T>> {
    options = this.buildOptionsToFilter(options);
    const [data, total] = await this.repository.findAndCount(options);
    const res: PaginatedResponse<T> = {
      data,
      total,
      limit: options?.take,
      offset: options?.skip,
    };
    return res;
  }

  save(model: T): Promise<T> {
    return this.repository.save(model);
  }

  async create(dto: TDto): Promise<T> {
    const message = await this.validateBeforeCreate(dto);
    if (message) {
      throw new ViewException({ message });
    }

    const model = await this.buildPartial(dto);

    const entity = this.repository.create(model);
    return this.repository.save(entity);
  }

  async edit(id: string, dto: TDto) {
    const customer = await this.get(id);

    if (!customer) {
      const message =
        'O registro não existe. Ao invés de editar, crie um novo.';
      throw new ViewException({ message });
    }

    const message = await this.validateBeforeEdit(id, dto);
    if (message) {
      throw new ViewException({ message });
    }

    const model = await this.buildPartial(dto);

    const entity = this.repository.create({ id, ...model });
    return this.repository.save(entity);
  }

  async remove(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
