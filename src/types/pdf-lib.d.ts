declare module 'pdf-lib' {
  export class PDFDocument {
    static create(): Promise<PDFDocument>;
    static load(bytes: Buffer | Uint8Array): Promise<PDFDocument>;

    getPageCount(): number;
    addPage(options?: any): any;
    copyPages(pdfDoc: PDFDocument, indices: number[]): Promise<any[]>;
    save(): Promise<Uint8Array>;
  }
}
