export interface ImageResponseHeaders {
  "content-type"?: string;
}

export interface ImageResponse {
  data: Buffer;
  contentType?: string;
}