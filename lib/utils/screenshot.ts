/**
 * Screenshot utility functions for capturing 3D scenes
 */

export interface ScreenshotOptions {
  width?: number;
  height?: number;
  format?: 'png' | 'jpeg' | 'webp';
  quality?: number;
}

export function captureScreenshot(
  canvas: HTMLCanvasElement,
  options: ScreenshotOptions = {}
): string | null {
  const {
    width = canvas.width,
    height = canvas.height,
    format = 'png',
    quality = 0.95,
  } = options;

  try {
    // Create a temporary canvas for resizing if needed
    const tempCanvas = document.createElement('canvas');
    const ctx = tempCanvas.getContext('2d');

    if (!ctx) {
      console.error('Could not get 2D context for screenshot');
      return null;
    }

    tempCanvas.width = width;
    tempCanvas.height = height;

    // Draw the original canvas onto the temp canvas
    ctx.drawImage(canvas, 0, 0, width, height);

    // Convert to data URL
    const mimeType = `image/${format}`;
    return tempCanvas.toDataURL(mimeType, quality);
  } catch (error) {
    console.error('Error capturing screenshot:', error);
    return null;
  }
}

export function downloadScreenshot(
  dataUrl: string,
  filename: string = `screenshot-${Date.now()}.png`
): void {
  try {
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error('Error downloading screenshot:', error);
  }
}

export function copyScreenshotToClipboard(dataUrl: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (!navigator.clipboard) {
      reject(new Error('Clipboard API not supported'));
      return;
    }

    // Convert data URL to blob
    fetch(dataUrl)
      .then(res => res.blob())
      .then(blob => {
        return navigator.clipboard.write([
          new ClipboardItem({ 'image/png': blob })
        ]);
      })
      .then(() => resolve())
      .catch(reject);
  });
}
