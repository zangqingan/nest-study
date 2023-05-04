import { Injectable } from '@nestjs/common';

interface QueryItf {
  value: number;
  name: string;
}
@Injectable()
export class PostsService {
  getHello(): string {
    return 'Hello World!';
  }
  getQuery(params: number, query: QueryItf): object {
    console.log('params', params);
    console.log('query', query);
    return { id: params, value: query.value, name: query.name };
  }
  postQuery(params: number, body: QueryItf): object {
    console.log('params', params);
    console.log('body', body);
    return { id: params, value: body.value, name: body.name };
  }
}
