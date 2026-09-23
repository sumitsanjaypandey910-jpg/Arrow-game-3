import React from 'react';
import { X, HelpCircle, Volume2, VolumeX } from 'lucide-react';
import { sound } from '../utils/sound';

interface HeaderBarProps {
  onBack?: () => void;
  onOpenHelp?: () => void;
  isSoundMuted: boolean;
  onToggleSound: () => void;
  showBack?: boolean;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({
  onBack,
  onOpenHelp,
  isSoundMuted,
  onToggleSound,
  showBack = true,
}) => {
  return (
    <header className="w-full flex items-center justify-between px-5 pt-4 pb-2 z-20">
      {/* Left button: Close / Back */}
      <div className="flex items-center">
        {showBack && onBack ? (
          <button
            onClick={() => {
              sound.playTap();
              onBack();
            }}
            aria-label="Back or Exit"
            className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/15 active:scale-95 transition flex items-center justify-center text-white/90 backdrop-blur-md border border-white/10 shadow-sm cursor-pointer"
          >
            <X className="w-5 h-5" strokeWidth={2.5} />
          </button>
        ) : (
          <div className="w-10 h-10" />
        )}
      </div>

      {/* Right buttons: Sound toggle & Help */}
      <div className="flex items-center gap-2.5">
        <button
          onClick={() => {
            onToggleSound();
          }}
          aria-label={isSoundMuted ? 'Unmute sound' : 'Mute sound'}
          title={isSoundMuted ? 'Unmute' : 'Mute'}
          className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/15 active:scale-95 transition flex items-center justify-center text-white/80 hover:text-white backdrop-blur-md border border-white/10 shadow-sm cursor-pointer"
        >
          {isSoundMuted ? (
            <VolumeX className="w-4 h-4 text-rose-300" strokeWidth={2.2} />
          ) : (
            <Volume2 className="w-4 h-4 text-cyan-300" strokeWidth={2.2} />
          )}
        </button>

        {onOpenHelp && (
          <button
            onClick={() => {
              sound.playTap();
              onOpenHelp();
            }}
            aria-label="How to play guide"
            title="How to play"
            className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/15 active:scale-95 transition flex items-center justify-center text-white/90 backdrop-blur-md border border-white/10 shadow-sm cursor-pointer"
          >
            <HelpCircle className="w-5 h-5" strokeWidth={2.4} />
          </button>
        )}
      </div>
    </header>
  );
};
