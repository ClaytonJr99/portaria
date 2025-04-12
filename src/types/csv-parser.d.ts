declare module 'csv-parser' {
  import { Transform } from 'stream';

  interface CsvParserOptions {
    separator?: string;
    headers?: string[] | boolean;
    skipLines?: number;
    [key: string]: any;
  }

  function csvParser(options?: CsvParserOptions): Transform;

  export = csvParser;
}
