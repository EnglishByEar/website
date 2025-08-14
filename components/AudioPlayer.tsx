"use client"

import React, { useState, useRef, useEffect } from "react";
import { useToast } from "./ui/use-toast";
import { Progress } from "@radix-ui/react-progress";
import { CardContent } from "./ui/card";
import { Slider } from "./ui/slider";
import { Button } from "./ui/button";
import { Pause, Play, VolumeX, Volume2, RotateCcw, AlertCircle } from "lucide-react";

interface Exercise {
  audio_url?: string;
}

interface AudioPlayerProps {
  exercise: Exercise | null;
}

// Default fallback audio
const DEFAULT_AUDIO_URL = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3";

const AudioPlayer: React.FC<AudioPlayerProps> = ({ exercise }) => {
  const { toast } = useToast();
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(80);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [progress, setProgress] = useState(0);
  const [muted, setMuted] = useState(false);
  const [audioAvailable, setAudioAvailable] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Load audio whenever exercise changes
  useEffect(() => {
    const audioUrl = exercise?.audio_url || DEFAULT_AUDIO_URL;

    const audio = new Audio(audioUrl);
    audioRef.current = audio;

    audio.oncanplaythrough = () => {
      setAudioAvailable(true);
    };

    audio.onerror = () => {
      console.error("Failed to load audio:", audioUrl);
      setAudioAvailable(false);
      toast({
        title: "Audio Error",
        description: "Unable to load this audio file.",
        variant: "destructive",
      });
    };

    const updateProgress = () => {
      if (audio.duration) {
        setProgress((audio.currentTime / audio.duration) * 100);
      }
    };

    audio.addEventListener("timeupdate", updateProgress);
    audio.addEventListener("ended", () => {
      setIsPlaying(false);
      setProgress(0);
    });

    // Cleanup on unmount or exercise change
    return () => {
      audio.pause();
      audio.removeEventListener("timeupdate", updateProgress);
      audio.oncanplaythrough = null;
      audio.onerror = null;
    };
  }, [exercise, toast]);

  // Volume and mute
  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume / 100;
  }, [volume]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.muted = muted;
  }, [muted]);

  // Playback rate
  useEffect(() => {
    if (audioRef.current) audioRef.current.playbackRate = playbackRate;
  }, [playbackRate]);

  const togglePlay = () => {
    if (!audioAvailable || !audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(() => {
        toast({
          title: "Audio Error",
          description: "Unable to play this audio file.",
          variant: "destructive",
        });
      });
    }
    setIsPlaying(!isPlaying);
  };

  const resetAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlaying(false);
    setProgress(0);
  };

  return (
    <div>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {audioAvailable ? (
                <>
                  <Button variant="outline" size="icon" onClick={togglePlay}>
                    {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </Button>
                  <Button variant="outline" size="icon" onClick={() => setMuted(!muted)}>
                    {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                  </Button>
                  <Button variant="outline" size="icon" onClick={resetAudio}>
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                </>
              ) : (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <AlertCircle className="h-4 w-4" />
                  <span>Audio not available</span>
                </div>
              )}
            </div>

            {audioAvailable && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Speed:</span>
                <div className="w-32">
                  <Slider
                    value={[playbackRate * 100]}
                    min={50}
                    max={150}
                    step={25}
                    onValueChange={(value) => setPlaybackRate(value[0] / 100)}
                  />
                </div>
                <span className="text-sm">{playbackRate}x</span>
              </div>
            )}
          </div>

          {audioAvailable && <Progress value={progress} />}
        </div>
      </CardContent>
    </div>
  );
};

export default AudioPlayer;
