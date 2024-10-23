import React, { createContext, useContext, useState } from 'react';

interface VideoContextType {
  currentTime: number;
  duration: number;
  videoUrl: string;
  setCurrentTime: (time: number) => void;
  setDuration: (duration: number) => void;
  setVideoUrl: (url: string) => void;
}

const VideoContext = createContext<VideoContextType>({
  currentTime: 0,
  duration: 0,
  videoUrl: '',
  setCurrentTime: () => {},
  setDuration: () => {},
  setVideoUrl: () => {},
});

export const useVideo = () => useContext(VideoContext);

export const VideoProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [videoUrl, setVideoUrl] = useState('');

  return (
    <VideoContext.Provider
      value={{
        currentTime,
        duration,
        videoUrl,
        setCurrentTime,
        setDuration,
        setVideoUrl,
      }}
    >
      {children}
    </VideoContext.Provider>
  );
};