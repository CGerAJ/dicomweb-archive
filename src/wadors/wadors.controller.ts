import { Controller, Get, Logger, NotFoundException, Param, Res } from '@nestjs/common';
import { WadorsService } from './wadors.service';
import { StudiesService } from '../studies/studies.service';
import { Response } from 'express';
import * as crypto from 'crypto';
import { WadoRsDto } from './dto/wadors.dto';

@Controller()
export class WadorsController {
  constructor(private readonly wadorsService: WadorsService, private readonly studiesService: StudiesService) {}

  logger = new Logger('WadorsController');

  @Get('rs/studies/:studyInstanceUid/series/:seriesInstanceUid/instances/:sopInstanceUid/frames/:frame')
  async findAll(@Res() res: Response, @Param() wadors: WadoRsDto) {
    const filePath = await this.studiesService.getFilepath(wadors.studyInstanceUid, wadors.seriesInstanceUid, wadors.sopInstanceUid);

    if (!filePath) {
      this.logger.error('File not found');
      throw new NotFoundException();
    }
    const boundary = crypto.randomBytes(16).toString('hex');
    const contentId = crypto.randomBytes(16).toString('hex');
    const contentType = `multipart/related;boundary='${boundary}'`;
    res.set('Content-Type', contentType);

    const buffer = await this.wadorsService.getPixelBufferFromFile(filePath);
    const stream = this.wadorsService.getReadableStream(buffer, boundary, contentId);
    stream.pipe(res);
  }
}
