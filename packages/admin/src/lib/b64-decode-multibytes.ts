const textDecoder = new TextDecoder();

export default function b64DecodeMultibytes(base64: string) {
  const bytes = Uint8Array.from(atob(base64), (m) => m.codePointAt(0) ?? 0);
  return textDecoder.decode(bytes);
}
