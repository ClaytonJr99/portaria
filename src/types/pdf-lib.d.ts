declare module 'pdf-lib' {
  export class PDFDocument {
    static create(): Promise<PDFDocument>;
    static load(bytes: Buffer | Uint8Array): Promise<PDFDocument>;

    getPageCount(): number;
    addPage(options?: any): any;
    copyPages(pdfDoc: PDFDocument, indices: number[]): Promise<any[]>;
    save(): Promise<Uint8Array>;
    embedFont(standardFont: any): Promise<any>;
  }

  export const StandardFonts: {
    Helvetica: string;
    [key: string]: string;
  };

  export function rgb(r: number, g: number, b: number): any;
}
