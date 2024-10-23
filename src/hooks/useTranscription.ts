import { useState, useCallback } from 'react';
import { ffmpeg } from '../lib/ffmpeg';
import { transcriptionService } from '../lib/transcription';

export interface TranscriptionSegment {
  id: string;
  text: string;
  startTime: number;
  endTime: number;
}

export function useTranscription() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [segments, setSegments] = useState<TranscriptionSegment[]>([]);

  const generateTranscription = useCallback(async (videoUrl: string) => {
    try {
      setIsLoading(true);
      setError(null);

      // Load FFmpeg if not loaded
      await ffmpeg.load();

      // Extract audio from video
      const audioBlob = await ffmpeg.extractAudio(videoUrl);

      // Generate transcription
      const transcription = await transcriptionService.transcribe(audioBlob);
      setSegments(transcription);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate transcription');
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isLoading,
    error,
    segments,
    generateTranscription,
  };
}