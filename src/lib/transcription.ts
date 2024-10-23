import { pipeline } from '@xenova/transformers';

class TranscriptionService {
  private pipeline: any = null;
  private loaded = false;

  async load() {
    if (this.loaded) return;

    this.pipeline = await pipeline(
      'automatic-speech-recognition',
      'Xenova/whisper-small',
      {
        chunk_length_s: 30,
        stride_length_s: 5,
        return_timestamps: true,
      }
    );

    this.loaded = true;
  }

  async transcribe(audioBlob: Blob) {
    if (!this.loaded) await this.load();

    const result = await this.pipeline(audioBlob, {
      task: 'transcribe',
      return_timestamps: true,
    });

    return result.chunks.map((chunk: any, index: number) => ({
      id: index.toString(),
      text: chunk.text,
      startTime: chunk.timestamp[0],
      endTime: chunk.timestamp[1],
    }));
  }
}

export const transcriptionService = new TranscriptionService();