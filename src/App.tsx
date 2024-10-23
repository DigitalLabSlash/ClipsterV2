import React from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import { VideoProvider } from './contexts/VideoContext';
import Layout from './components/Layout';
import VideoPlayer from './components/VideoPlayer';
import TranscriptionPanel from './components/TranscriptionPanel';
import ClipControls from './components/ClipControls';
import { Toaster } from './components/ui/Toaster';

function App() {
  return (
    <ThemeProvider>
      <VideoProvider>
        <Layout>
          <div className="flex flex-col lg:flex-row gap-4 p-4 min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="lg:w-2/3 space-y-4">
              <VideoPlayer />
              <ClipControls />
            </div>
            <div className="lg:w-1/3">
              <TranscriptionPanel />
            </div>
          </div>
          <Toaster />
        </Layout>
      </VideoProvider>
    </ThemeProvider>
  );
}

export default App;