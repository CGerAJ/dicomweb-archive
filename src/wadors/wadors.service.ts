import { Injectable } from '@nestjs/common';
import * as dicomParser from '@knopkem/dicom-parser';
import { Readable } from 'stream';
import * as fs from 'fs';

@Injectable()
export class WadorsService {

  /**
   * read file from file system and extract pixel buffer
   * @param filePath 
   * @returns 
   */
  async getPixelBufferFromFile(filePath: string): Promise<Buffer> {
    const data = await fs.promises.readFile(filePath);
    const dataset = dicomParser.parseDicom(data);
    const pixelDataElement = dataset.elements.x7fe00010;
    return Buffer.from(dataset.byteArray.buffer, pixelDataElement.dataOffset, pixelDataElement.length);
  }

  /**
   * Build readable stream from buffer
   * @param buffer 
   * @param boundary 
   * @param contentId 
   * @returns 
   */
  getReadableStream(buffer: Buffer, boundary: string, contentId: string): Readable {
    const stream = new Readable();

    const term = '\r\n';
    const endline = `${term}--${boundary}--${term}`;

    stream.push(`${term}--${boundary}${term}`);
    stream.push(`Content-Location:localhost${term}`);
    stream.push(`Content-ID:${contentId}${term}`);
    stream.push(`Content-Type:application/octet-stream${term}`);
    stream.push(term);
    stream.push(buffer);
    stream.push(endline);
    stream.push(null);
    return stream;
  }
}
