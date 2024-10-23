import { FFmpeg } from '@ffmpeg/ffmpeg';
import { toBlobURL, fetchFile } from '@ffmpeg/util';

class FFmpegService {
  private ffmpeg: FFmpeg | null = null;
  private loaded = false;

  async load() {
    if (this.loaded) return;

    this.ffmpeg = new FFmpeg();
    
    // Load FFmpeg core
    await this.ffmpeg.load({
      coreURL: await toBlobURL(`/node_modules/@ffmpeg/core/dist/ffmpeg-core.js`, 'text/javascript'),
      wasmURL: await toBlobURL(`/node_modules/@ffmpeg/core/dist/ffmpeg-core.wasm`, 'application/wasm'),
    });
    
    this.loaded = true;
  }

  async extractAudio(videoUrl: string): Promise<Blob> {
    if (!this.ffmpeg) throw new Error('FFmpeg not loaded');

    const inputData = await fetchFile(videoUrl);
    await this.ffmpeg.writeFile('input.mp4', inputData);
    
    // Extract audio in WAV format
    await this.ffmpeg.exec([
      '-i', 'input.mp4',
      '-vn',
      '-acodec', 'pcm_s16le',
      '-ar', '16000',
      '-ac', '1',
      'output.wav'
    ]);

    const data = await this.ffmpeg.readFile('output.wav');
    return new Blob([data], { type: 'audio/wav' });
  }

  async createClip(videoUrl: string, start: number, end: number): Promise<Blob> {
    if (!this.ffmpeg) throw new Error('FFmpeg not loaded');

    const inputData = await fetchFile(videoUrl);
    await this.ffmpeg.writeFile('input.mp4', inputData);

    await this.ffmpeg.exec([
      '-ss', start.toString(),
      '-i', 'input.mp4',
      '-t', (end - start).toString(),
      '-c', 'copy',
      'output.mp4'
    ]);

    const data = await this.ffmpeg.readFile('output.mp4');
    return new Blob([data], { type: 'video/mp4' });
  }
}

export const ffmpeg = new FFmpegService();