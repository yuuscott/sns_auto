/**
 * base64画像データをファイルとしてダウンロードする
 */
export function downloadBase64Image(
  base64Data: string,
  fileName: string,
  mimeType: string = 'image/png'
): void {
  const link = document.createElement('a');
  link.href = `data:${mimeType};base64,${base64Data}`;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * URLから画像をダウンロードする
 */
export async function downloadImageFromUrl(
  url: string,
  fileName: string
): Promise<void> {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(blobUrl);
  } catch (error) {
    console.error('画像のダウンロードに失敗しました:', error);
    throw error;
  }
}
