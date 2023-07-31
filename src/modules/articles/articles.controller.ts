import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  Res,
} from '@nestjs/common';
import { Request, Response } from 'express';
@Controller('articles')
export class ArticlesController {
  @Get()
  findAll() {
    return '文章接口123';
  }
  //query
  @Get('/getquery')
  getQue(@Req() req: Request, @Res() res: Response) {
    res.send({ query: req.query });
  }
  @Get('/getparams/:id')
  getPar(@Req() req: Request, @Res() res: Response) {
    res.send({ params: req.params });
  }
  @Get('/getQueryAndParam/:id')
  getQueryAndParam(@Req() req: Request, @Res() res: Response) {
    res.send({ query: req.query, params: req.params });
  }
  @Post('/getbody')
  getBody(@Req() req: Request, @Res() res: Response) {
    res.send({ body: req.body });
  }

  @Get('/query')
  getQ(@Query() query, @Res() res: Response) {
    res.send({ query });
  }
  @Get('/params/:id')
  getP(@Param() params, @Res() res: Response) {
    res.send({ params });
  }
  @Get('/queryAndParam/:id')
  getQAndP(@Query() query, @Param() params, @Res() res: Response) {
    res.send({ query, params });
  }
  @Post('/body')
  getBo(@Body() body, @Res() res: Response) {
    res.send({ body });
  }
}
