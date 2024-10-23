import { useState, useCallback } from 'react';
import { ffmpeg } from '../lib/ffmpeg';

export function useClipExport() {
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const exportClip = useCallback(async (
    videoUrl: string,
    startTime: number,
    endTime: number,
    filename: string
  ) => {
    try {
      setIsExporting(true);
      setError(null);

      // Load FFmpeg if not loaded
      await ffmpeg.load();

      // Create clip
      const clipBlob = await ffmpeg.createClip(videoUrl, startTime, endTime);

      // Create download link
      const url = URL.createObjectURL(clipBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${filename}.mp4`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to export clip');
    } finally {
      setIsExporting(false);
    }
  }, []);

  return {
    isExporting,
    error,
    exportClip,
  };
}