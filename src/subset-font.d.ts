declare module 'subset-font' {
  interface SubsetOptions {
    targetFormat?: 'woff2' | 'woff' | 'sfnt' | 'truetype'
    variationAxes?: Record<string, number>
  }
  export default function subsetFont(
    font: Uint8Array,
    text: string,
    options?: SubsetOptions,
  ): Promise<Buffer>
}
