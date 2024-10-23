import React from 'react';
import { useVideo } from '../contexts/VideoContext';
import { Search, Loader2 } from 'lucide-react';
import { useTranscription, TranscriptionSegment } from '../hooks/useTranscription';

const TranscriptionPanel: React.FC = () => {
  const { currentTime, videoUrl } = useVideo();
  const { isLoading, error, segments, generateTranscription } = useTranscription();
  const [searchQuery, setSearchQuery] = React.useState('');
  const [filteredSegments, setFilteredSegments] = React.useState<TranscriptionSegment[]>([]);

  React.useEffect(() => {
    const filtered = segments.filter((segment) =>
      segment.text.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredSegments(filtered);
  }, [searchQuery, segments]);

  const isSegmentActive = (segment: TranscriptionSegment) => {
    return currentTime >= segment.startTime && currentTime <= segment.endTime;
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleGenerateTranscription = () => {
    if (!videoUrl) {
      return;
    }
    generateTranscription(videoUrl);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 h-full">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Transcription
          </h2>
          <button
            onClick={handleGenerateTranscription}
            disabled={isLoading || !videoUrl}
            className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${
              isLoading || !videoUrl
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Generating...</span>
              </>
            ) : (
              <span>Generate Transcription</span>
            )}
          </button>
        </div>

        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg">
            {error}
          </div>
        )}

        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearch}
            placeholder="Search transcription..."
            className="w-full px-10 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        </div>

        <div className="space-y-2 max-h-[calc(100vh-16rem)] overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            </div>
          ) : filteredSegments.length > 0 ? (
            filteredSegments.map((segment) => (
              <div
                key={segment.id}
                className={`p-3 rounded-lg transition-colors ${
                  isSegmentActive(segment)
                    ? 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500'
                    : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
                }`}
              >
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  {segment.text}
                </p>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {segment.startTime}s - {segment.endTime}s
                </span>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              {!videoUrl 
                ? 'Load a video to get started'
                : segments.length === 0
                ? 'Generate transcription to get started'
                : 'No matching segments found'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TranscriptionPanel;