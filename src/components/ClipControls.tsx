import React from 'react';
import { useVideo } from '../contexts/VideoContext';
import { Scissors, Download, Trash2, Clock } from 'lucide-react';
import { useClipExport } from '../hooks/useClipExport';

interface Clip {
  id: string;
  startTime: number;
  endTime: number;
  title: string;
}

const ClipControls: React.FC = () => {
  const { currentTime, videoUrl } = useVideo();
  const { isExporting, error: exportError, exportClip } = useClipExport();
  const [clips, setClips] = React.useState<Clip[]>([]);
  const [startPoint, setStartPoint] = React.useState<number | null>(null);
  const [clipTitle, setClipTitle] = React.useState('');
  const [error, setError] = React.useState('');

  const handleStartClip = () => {
    if (!videoUrl) {
      setError('Please load a video first');
      return;
    }
    setStartPoint(currentTime);
    setError('');
  };

  const handleEndClip = () => {
    if (!videoUrl) {
      setError('Please load a video first');
      return;
    }

    if (!clipTitle.trim()) {
      setError('Please enter a title for your clip');
      return;
    }

    if (startPoint !== null && currentTime > startPoint) {
      const newClip: Clip = {
        id: Date.now().toString(),
        startTime: startPoint,
        endTime: currentTime,
        title: clipTitle.trim()
      };
      setClips([...clips, newClip]);
      setStartPoint(null);
      setClipTitle('');
      setError('');
    } else {
      setError('End time must be after start time');
    }
  };

  const handleDeleteClip = (id: string) => {
    setClips(clips.filter((clip) => clip.id !== id));
  };

  const handleExportClip = async (clip: Clip) => {
    if (!videoUrl) {
      setError('No video URL available');
      return;
    }
    await exportClip(videoUrl, clip.startTime, clip.endTime, clip.title);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const getDuration = (start: number, end: number) => {
    const duration = end - start;
    return formatTime(duration);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4">
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Clip Controls
        </h2>

        <div className="flex flex-col space-y-4">
          <input
            type="text"
            value={clipTitle}
            onChange={(e) => setClipTitle(e.target.value)}
            placeholder="Enter clip title"
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          />

          {error && (
            <p className="text-sm text-red-500 dark:text-red-400">{error}</p>
          )}

          {exportError && (
            <p className="text-sm text-red-500 dark:text-red-400">{exportError}</p>
          )}

          <div className="flex space-x-2">
            <button
              onClick={handleStartClip}
              disabled={!videoUrl}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center space-x-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Scissors className="h-4 w-4" />
              <span>Start Clip</span>
            </button>
            <button
              onClick={handleEndClip}
              disabled={!videoUrl || startPoint === null}
              className={`flex-1 px-4 py-2 rounded-lg flex items-center justify-center space-x-2 transition-colors ${
                !videoUrl || startPoint === null
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-green-600 text-white hover:bg-green-700'
              }`}
            >
              <Scissors className="h-4 w-4" />
              <span>End Clip</span>
            </button>
          </div>
        </div>

        <div className="space-y-4 mt-6">
          <h3 className="text-md font-medium text-gray-900 dark:text-white">
            Saved Clips
          </h3>
          
          {clips.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-center py-4">
              No clips created yet
            </p>
          ) : (
            <div className="space-y-3">
              {clips.map((clip) => (
                <div
                  key={clip.id}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                >
                  <div className="space-y-1">
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {clip.title}
                    </h4>
                    <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                      <Clock className="h-4 w-4" />
                      <span>
                        {formatTime(clip.startTime)} - {formatTime(clip.endTime)}
                      </span>
                      <span className="text-gray-400 dark:text-gray-500">•</span>
                      <span>{getDuration(clip.startTime, clip.endTime)}</span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleExportClip(clip)}
                      disabled={isExporting}
                      className="p-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors disabled:opacity-50"
                      title="Download clip"
                    >
                      <Download className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteClip(clip.id)}
                      className="p-2 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                      title="Delete clip"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClipControls;