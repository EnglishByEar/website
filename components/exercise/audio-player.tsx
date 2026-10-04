import { AlertCircle, Pause, Play, RotateCcw, Volume2, VolumeX } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Slider } from "@/components/ui/slider"

interface AudioPlayerProps {
  available: boolean
  isPlaying: boolean
  muted: boolean
  progress: number
  playbackRate: number
  disabled?: boolean
  onTogglePlay: () => void
  onToggleMute: () => void
  onReset: () => void
  onPlaybackRateChange: (rate: number) => void
  unavailableMessage?: string
}

export function AudioPlayer({
  available,
  isPlaying,
  muted,
  progress,
  playbackRate,
  disabled = false,
  onTogglePlay,
  onToggleMute,
  onReset,
  onPlaybackRateChange,
  unavailableMessage = "Audio not available - read the text below after submitting",
}: AudioPlayerProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {available ? (
            <>
              <Button variant="outline" size="icon" onClick={onTogglePlay} disabled={disabled}>
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>
              <Button variant="outline" size="icon" onClick={onToggleMute} disabled={disabled}>
                {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </Button>
              <Button variant="outline" size="icon" onClick={onReset}>
                <RotateCcw className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <AlertCircle className="h-4 w-4" />
              <span>{unavailableMessage}</span>
            </div>
          )}
        </div>

        {available && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Speed:</span>
            <div className="w-32">
              <Slider
                value={[playbackRate * 100]}
                min={50}
                max={150}
                step={25}
                onValueChange={(value) => onPlaybackRateChange(value[0] / 100)}
                disabled={disabled}
              />
            </div>
            <span className="text-sm">{playbackRate}x</span>
          </div>
        )}
      </div>

      {available && <Progress value={progress} />}
    </div>
  )
}