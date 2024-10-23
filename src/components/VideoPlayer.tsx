import React, { useRef } from 'react';
import ReactPlayer from 'react-player';
import { useVideo } from '../contexts/VideoContext';
import { Play, Pause, Volume2, VolumeX, Link } from 'lucide-react';

const VideoPlayer: React.FC = () => {
  const playerRef = useRef<ReactPlayer>(null);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [isMuted, setIsMuted] = React.useState(false);
  const [inputUrl, setInputUrl] = React.useState('');
  const { videoUrl, currentTime, duration, setCurrentTime, setDuration, setVideoUrl } = useVideo();

  const validateAndSetUrl = (input: string) => {
    setInputUrl(input);
    if (ReactPlayer.canPlay(input)) {
      setVideoUrl(input);
    }
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    validateAndSetUrl(e.target.value);
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleProgress = (state: { played: number; playedSeconds: number }) => {
    setCurrentTime(state.playedSeconds);
  };

  const handleDuration = (duration: number) => {
    setDuration(duration);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    playerRef.current?.seekTo(time);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2 bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
        <Link className="h-5 w-5 text-gray-500 dark:text-gray-400" />
        <input
          type="text"
          value={inputUrl}
          onChange={handleUrlChange}
          placeholder="Enter YouTube URL"
          className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
        />
      </div>

      <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
        {videoUrl ? (
          <ReactPlayer
            ref={playerRef}
            url={videoUrl}
            width="100%"
            height="100%"
            playing={isPlaying}
            muted={isMuted}
            onProgress={handleProgress}
            onDuration={handleDuration}
            controls={false}
            style={{ position: 'absolute', top: 0, left: 0 }}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-white">
            Enter a valid YouTube URL to start
          </div>
        )}

        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={togglePlay}
              className="text-white hover:text-gray-200 disabled:opacity-50"
              disabled={!videoUrl}
            >
              {isPlaying ? (
                <Pause className="h-6 w-6" />
              ) : (
                <Play className="h-6 w-6" />
              )}
            </button>

            <button
              onClick={toggleMute}
              className="text-white hover:text-gray-200 disabled:opacity-50"
              disabled={!videoUrl}
            >
              {isMuted ? (
                <VolumeX className="h-6 w-6" />
              ) : (
                <Volume2 className="h-6 w-6" />
              )}
            </button>

            <div className="flex-1">
              <input
                type="range"
                min={0}
                max={duration}
                value={currentTime}
                onChange={handleSeek}
                disabled={!videoUrl}
                className="w-full accent-blue-500"
              />
            </div>

            <span className="text-white text-sm">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;