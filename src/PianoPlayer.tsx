import React, { useState, useEffect, useCallback, useRef } from 'react';

const TRANSLATIONS = {
  "en-US": {
    "appTitle": "PianoBar",
    "songInputPlaceholder": "Request a song...",
    "parseSongButton": "Parse song",
    "processingButton": "Processing...",
    "playingPrefix": "Playing: ",
    "readyToPlayPrefix": "Ready to play: ",
    "playButton": "Play",
    "stopButton": "Stop",
    "parseErrorMessage": "Sorry, I had trouble parsing that song. Please try a different request.",
    "happyBirthday": "Happy birthday",
    "twinkleTwinkle": "Twinkle twinkle little star",
    "maryHadLamb": "Mary had a little lamb",
    "jingleBells": "Jingle bells",
    "sadMelody": "Sad melody",
    "amazingGrace": "Amazing grace",
    "silentNight": "Silent night",
    "auldLangSyne": "Auld lang syne"
  },
  "es-ES": {
    "appTitle": "PianoBar",
    "songInputPlaceholder": "Solicita una canción...",
    "parseSongButton": "Analizar canción",
    "processingButton": "Procesando...",
    "playingPrefix": "Reproduciendo: ",
    "readyToPlayPrefix": "Listo para reproducir: ",
    "playButton": "Reproducir",
    "stopButton": "Detener",
    "parseErrorMessage": "Lo siento, tuve problemas analizando esa canción. Por favor intenta con una solicitud diferente.",
    "happyBirthday": "Cumpleaños feliz",
    "twinkleTwinkle": "Estrellita dónde estás",
    "maryHadLamb": "María tenía un corderito",
    "jingleBells": "Cascabeles",
    "sadMelody": "Melodía triste",
    "amazingGrace": "Sublime gracia",
    "silentNight": "Noche de paz",
    "auldLangSyne": "Auld lang syne"
  }
};

// Predefined songs data
const SONG_DATABASE: Record<string, { title: string; notes: Array<{ note: string; duration: number; time: number }> }> = {
  "happy birthday": {
    title: "Happy Birthday",
    notes: [
      {"note": "C4", "duration": 0.5, "time": 0},
      {"note": "C4", "duration": 0.5, "time": 0.5},
      {"note": "D4", "duration": 1, "time": 1},
      {"note": "C4", "duration": 1, "time": 2},
      {"note": "F4", "duration": 1, "time": 3},
      {"note": "E4", "duration": 2, "time": 4},
      
      {"note": "C4", "duration": 0.5, "time": 6},
      {"note": "C4", "duration": 0.5, "time": 6.5},
      {"note": "D4", "duration": 1, "time": 7},
      {"note": "C4", "duration": 1, "time": 8},
      {"note": "G4", "duration": 1, "time": 9},
      {"note": "F4", "duration": 2, "time": 10},
      
      {"note": "C4", "duration": 0.5, "time": 12},
      {"note": "C4", "duration": 0.5, "time": 12.5},
      {"note": "C5", "duration": 1, "time": 13},
      {"note": "A4", "duration": 1, "time": 14},
      {"note": "F4", "duration": 1, "time": 15},
      {"note": "E4", "duration": 1, "time": 16},
      {"note": "D4", "duration": 2, "time": 17},
      
      {"note": "A#4", "duration": 0.5, "time": 19},
      {"note": "A#4", "duration": 0.5, "time": 19.5},
      {"note": "A4", "duration": 1, "time": 20},
      {"note": "F4", "duration": 1, "time": 21},
      {"note": "G4", "duration": 1, "time": 22},
      {"note": "F4", "duration": 2, "time": 23}
    ]
  },
  "twinkle twinkle little star": {
    title: "Twinkle Twinkle Little Star",
    notes: [
      {"note": "C4", "duration": 0.5, "time": 0},
      {"note": "C4", "duration": 0.5, "time": 0.5},
      {"note": "G4", "duration": 0.5, "time": 1},
      {"note": "G4", "duration": 0.5, "time": 1.5},
      {"note": "A4", "duration": 0.5, "time": 2},
      {"note": "A4", "duration": 0.5, "time": 2.5},
      {"note": "G4", "duration": 1, "time": 3},
      
      {"note": "F4", "duration": 0.5, "time": 4},
      {"note": "F4", "duration": 0.5, "time": 4.5},
      {"note": "E4", "duration": 0.5, "time": 5},
      {"note": "E4", "duration": 0.5, "time": 5.5},
      {"note": "D4", "duration": 0.5, "time": 6},
      {"note": "D4", "duration": 0.5, "time": 6.5},
      {"note": "C4", "duration": 1, "time": 7},
      
      {"note": "G4", "duration": 0.5, "time": 8},
      {"note": "G4", "duration": 0.5, "time": 8.5},
      {"note": "F4", "duration": 0.5, "time": 9},
      {"note": "F4", "duration": 0.5, "time": 9.5},
      {"note": "E4", "duration": 0.5, "time": 10},
      {"note": "E4", "duration": 0.5, "time": 10.5},
      {"note": "D4", "duration": 1, "time": 11},
      
      {"note": "G4", "duration": 0.5, "time": 12},
      {"note": "G4", "duration": 0.5, "time": 12.5},
      {"note": "F4", "duration": 0.5, "time": 13},
      {"note": "F4", "duration": 0.5, "time": 13.5},
      {"note": "E4", "duration": 0.5, "time": 14},
      {"note": "E4", "duration": 0.5, "time": 14.5},
      {"note": "D4", "duration": 1, "time": 15}
    ]
  },
  "mary had a little lamb": {
    title: "Mary Had a Little Lamb",
    notes: [
      {"note": "E4", "duration": 0.5, "time": 0},
      {"note": "D4", "duration": 0.5, "time": 0.5},
      {"note": "C4", "duration": 0.5, "time": 1},
      {"note": "D4", "duration": 0.5, "time": 1.5},
      {"note": "E4", "duration": 0.5, "time": 2},
      {"note": "E4", "duration": 0.5, "time": 2.5},
      {"note": "E4", "duration": 1, "time": 3},
      
      {"note": "D4", "duration": 0.5, "time": 4},
      {"note": "D4", "duration": 0.5, "time": 4.5},
      {"note": "D4", "duration": 1, "time": 5},
      {"note": "E4", "duration": 0.5, "time": 6},
      {"note": "G4", "duration": 0.5, "time": 6.5},
      {"note": "G4", "duration": 1, "time": 7},
      
      {"note": "E4", "duration": 0.5, "time": 8},
      {"note": "D4", "duration": 0.5, "time": 8.5},
      {"note": "C4", "duration": 0.5, "time": 9},
      {"note": "D4", "duration": 0.5, "time": 9.5},
      {"note": "E4", "duration": 0.5, "time": 10},
      {"note": "E4", "duration": 0.5, "time": 10.5},
      {"note": "E4", "duration": 0.5, "time": 11},
      {"note": "E4", "duration": 0.5, "time": 11.5},
      
      {"note": "D4", "duration": 0.5, "time": 12},
      {"note": "D4", "duration": 0.5, "time": 12.5},
      {"note": "E4", "duration": 0.5, "time": 13},
      {"note": "D4", "duration": 0.5, "time": 13.5},
      {"note": "C4", "duration": 2, "time": 14}
    ]
  }
};

const browserLocale = navigator.languages?.[0] || navigator.language || 'en-US';
const findMatchingLocale = (locale: string) => {
  if (TRANSLATIONS[locale as keyof typeof TRANSLATIONS]) return locale;
  const lang = locale.split('-')[0];
  const match = Object.keys(TRANSLATIONS).find(key => key.startsWith(lang + '-'));
  return match || 'en-US';
};
const locale = findMatchingLocale(browserLocale) as keyof typeof TRANSLATIONS;
const t = (key: string) => (TRANSLATIONS[locale] as any)?.[key] || (TRANSLATIONS['en-US'] as any)[key] || key;

const PianoPlayer = () => {
  const [activeKeys, setActiveKeys] = useState(new Set());
  const [keyAnimations, setKeyAnimations] = useState(new Map());
  const [songInput, setSongInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentSong, setCurrentSong] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed] = useState(1.25);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const sequenceRef = useRef<number[] | null>(null);

  // Note frequencies (Web Audio API)
  const noteFrequencies: Record<string, number> = {
    'C4': 261.63, 'C#4': 277.18, 'D4': 293.66, 'D#4': 311.13, 'E4': 329.63,
    'F4': 349.23, 'F#4': 369.99, 'G4': 392.00, 'G#4': 415.30, 'A4': 440.00,
    'A#4': 466.16, 'B4': 493.88, 'C5': 523.25, 'C#5': 554.37, 'D5': 587.33,
    'D#5': 622.25, 'E5': 659.25, 'F5': 698.46, 'F#5': 739.99, 'G5': 783.99
  };

  // Piano key mappings - computer keyboard to notes
  const keyMappings: Record<string, string> = {
    'a': 'C4', 'w': 'C#4', 's': 'D4', 'e': 'D#4', 'd': 'E4',
    'f': 'F4', 't': 'F#4', 'g': 'G4', 'y': 'G#4', 'h': 'A4', 
    'u': 'A#4', 'j': 'B4', 'k': 'C5', 'o': 'C#5', 'l': 'D5',
    'p': 'D#5', ';': 'E5', "'": 'F5'
  };

  // All piano keys for display
  const pianoKeys = [
    { note: 'C4', type: 'white', key: 'a' },
    { note: 'C#4', type: 'black', key: 'w' },
    { note: 'D4', type: 'white', key: 's' },
    { note: 'D#4', type: 'black', key: 'e' },
    { note: 'E4', type: 'white', key: 'd' },
    { note: 'F4', type: 'white', key: 'f' },
    { note: 'F#4', type: 'black', key: 't' },
    { note: 'G4', type: 'white', key: 'g' },
    { note: 'G#4', type: 'black', key: 'y' },
    { note: 'A4', type: 'white', key: 'h' },
    { note: 'A#4', type: 'black', key: 'u' },
    { note: 'B4', type: 'white', key: 'j' },
    { note: 'C5', type: 'white', key: 'k' },
    { note: 'C#5', type: 'black', key: 'o' },
    { note: 'D5', type: 'white', key: 'l' },
    { note: 'D#5', type: 'black', key: 'p' },
    { note: 'E5', type: 'white', key: ';' },
    { note: 'F5', type: 'white', key: "'" }
  ];

  // Initialize Web Audio API
  useEffect(() => {
    const initAudio = () => {
      try {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        console.log("Web Audio API initialized successfully");
      } catch (error) {
        console.error('Failed to initialize Web Audio API:', error);
      }
    };

    // Initialize on first user interaction
    const handleFirstInteraction = () => {
      initAudio();
      if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
        audioContextRef.current.resume();
      }
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('keydown', handleFirstInteraction);
    };

    document.addEventListener('click', handleFirstInteraction);
    document.addEventListener('keydown', handleFirstInteraction);

    return () => {
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('keydown', handleFirstInteraction);
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  // Play tone using Web Audio API
  const playTone = (frequency: number, duration = 0.5) => {
    if (!audioContextRef.current) return;

    const context = audioContextRef.current;
    const oscillator = context.createOscillator();
    const gainNode = context.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(context.destination);

    oscillator.frequency.setValueAtTime(frequency, context.currentTime);
    oscillator.type = 'triangle';

    gainNode.gain.setValueAtTime(0, context.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.3, context.currentTime + 0.02);
    gainNode.gain.linearRampToValueAtTime(0.2, context.currentTime + duration * 0.1);
    gainNode.gain.linearRampToValueAtTime(0.15, context.currentTime + duration * 0.8);
    gainNode.gain.exponentialRampToValueAtTime(0.001, context.currentTime + duration);

    oscillator.start(context.currentTime);
    oscillator.stop(context.currentTime + duration);
  };

  // Play note
  const playNote = useCallback((note: string) => {
    const frequency = noteFrequencies[note];
    if (frequency) {
      playTone(frequency, 0.8);
      
      const noteKey = `${note}-${Date.now()}`;
      setActiveKeys(prev => new Set([...prev, noteKey]));
      
      setKeyAnimations(prev => new Map(prev.set(note, Date.now())));
      
      setTimeout(() => {
        setActiveKeys(prev => {
          const newSet = new Set(prev);
          newSet.delete(noteKey);
          return newSet;
        });
      }, 300);
    }
  }, []);

  // Keyboard event handlers
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isInputFocused) return;
      
      const note = keyMappings[e.key.toLowerCase()];
      if (note && !activeKeys.has(note)) {
        playNote(note);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [playNote, activeKeys, isInputFocused]);

  // Parse song (using predefined songs instead of API)
  const parseSong = async (songText: string) => {
    setIsProcessing(true);
    try {
      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const normalizedInput = songText.toLowerCase().trim();
      const songData = SONG_DATABASE[normalizedInput];
      
      if (!songData) {
        throw new Error('Song not found');
      }
      
      console.log(`Parsed song: ${songData.title} with ${songData.notes.length} notes`);
      setCurrentSong(songData);
      
      // Auto-play the song after parsing
      setTimeout(() => {
        if (audioContextRef.current) {
          playParsedSong(songData);
        }
      }, 100);
      
      return songData;
    } catch (error) {
      console.error('Error parsing song:', error);
      alert(t('parseErrorMessage'));
      return null;
    } finally {
      setIsProcessing(false);
    }
  };

  // Play a specific song
  const playParsedSong = (songData: any) => {
    if (!songData || !audioContextRef.current) return;

    setIsPlaying(true);
    
    if (sequenceRef.current) {
      sequenceRef.current.forEach(clearTimeout);
    }

    const adjustedNotes = songData.notes.map((note: any) => ({
      ...note,
      time: note.time / playbackSpeed,
      duration: note.duration / playbackSpeed
    }));

    console.log("Playing song with notes:", adjustedNotes.length);

    let noteTimeouts: number[] = [];
    
    adjustedNotes.forEach((note: any, index: number) => {
      const timeout = setTimeout(() => {
        console.log(`Playing note ${index + 1}/${adjustedNotes.length}: ${note.note} at ${note.time}s`);
        const frequency = noteFrequencies[note.note];
        if (frequency) {
          playTone(frequency, note.duration);
        }
        
        const noteKey = `${note.note}-${index}-${Date.now()}`;
        setActiveKeys(prev => new Set([...prev, noteKey]));
        
        setKeyAnimations(prev => new Map(prev.set(note.note, Date.now())));
        
        setTimeout(() => {
          setActiveKeys(prev => {
            const newSet = new Set(prev);
            newSet.delete(noteKey);
            return newSet;
          });
        }, note.duration * 1000);
      }, note.time * 1000);
      
      noteTimeouts.push(timeout);
    });

    sequenceRef.current = noteTimeouts;

    const totalDuration = Math.max(...adjustedNotes.map((n: any) => n.time + n.duration));
    console.log(`Song should complete in ${totalDuration} seconds`);
    
    const completionTimeout = setTimeout(() => {
      console.log("Song playback completed");
      setIsPlaying(false);
      setActiveKeys(new Set());
    }, (totalDuration + 0.5) * 1000);
    
    noteTimeouts.push(completionTimeout);
  };

  const playSong = () => {
    if (!currentSong) return;
    playParsedSong(currentSong);
  };

  const stopSong = () => {
    setIsPlaying(false);
    if (sequenceRef.current) {
      sequenceRef.current.forEach(clearTimeout);
    }
    setActiveKeys(new Set());
  };

  const handleSongSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!songInput.trim()) return;
    
    const songData = await parseSong(songInput);
    if (songData) {
      setSongInput('');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 text-center mb-8 mt-12">{t('appTitle')}</h1>
        
        {/* Song Input Section */}
        <div className="flex justify-center px-8 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-4" style={{width: '736px'}}>
            <div className="flex gap-3 items-center">
              <input
                type="text"
                value={songInput}
                onChange={(e) => setSongInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSongSubmit(e as any)}
                onFocus={() => setIsInputFocused(true)}
                onBlur={() => setIsInputFocused(false)}
                placeholder={t('songInputPlaceholder')}
                className="flex-1 px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-gray-400 focus:border-transparent outline-none text-gray-700"
                disabled={isProcessing}
              />
              <button
                onClick={handleSongSubmit}
                disabled={isProcessing || !songInput.trim()}
                className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
              >
                {isProcessing ? t('processingButton') : t('parseSongButton')}
              </button>
            </div>

            {/* Song Controls */}
            {currentSong && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-700">
                    {isPlaying ? `${t('playingPrefix')}${currentSong.title}` : `${t('readyToPlayPrefix')}${currentSong.title}`}
                  </h3>
                  <div className="flex gap-2">
                    {!isPlaying ? (
                      <button
                        onClick={playSong}
                        className="px-3 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors flex items-center gap-1"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M8 5v14l11-7z"/>
                        </svg>
                        {t('playButton')}
                      </button>
                    ) : (
                      <button
                        onClick={stopSong}
                        className="px-3 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors flex items-center gap-1"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                          <rect x="6" y="4" width="4" height="16"/>
                          <rect x="14" y="4" width="4" height="16"/>
                        </svg>
                        {t('stopButton')}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Piano Keyboard */}
        <div className="flex justify-center px-8 mb-8">
          <div className="relative bg-gray-200 p-4 rounded-2xl shadow-sm" style={{width: '736px'}}>
            <div className="relative">
              {/* White keys */}
              <div className="flex">
                {pianoKeys.filter(key => key.type === 'white').map((key) => {
                  const isActive = Array.from(activeKeys).some((activeKey: any) => activeKey.startsWith(key.note));
                  const animationKey = keyAnimations.get(key.note) || 0;
                  
                  return (
                    <button
                      key={key.note}
                      onMouseDown={() => playNote(key.note)}
                      className={`
                        w-16 h-64 border border-gray-300 rounded-b-xl
                        hover:bg-gray-50 active:bg-gray-100
                        transition-all duration-300 flex flex-col justify-end items-center pb-4
                        ${isActive ? 'bg-blue-200 border-blue-400 animate-pulse' : 'bg-white'}
                      `}
                      style={{
                        animationDuration: '0.6s',
                        animationIterationCount: '1',
                        animationKey: animationKey as any
                      }}
                    >
                      <span className="text-sm text-gray-800 font-bold mb-1">
                        {key.key?.toUpperCase()}
                      </span>
                      <span className="text-xs text-gray-600 opacity-80">{key.note}</span>
                    </button>
                  );
                })}
              </div>

              {/* Black keys */}
              <div className="absolute top-0 left-0 flex">
                {pianoKeys.filter(key => key.type === 'black').map((key) => {
                  const whiteKeyIndex = pianoKeys.filter(k => k.type === 'white' && 
                    pianoKeys.indexOf(k) < pianoKeys.indexOf(key)).length;
                  
                  let leftOffset = (whiteKeyIndex * 64) - 24;
                  
                  const isActive = Array.from(activeKeys).some((activeKey: any) => activeKey.startsWith(key.note));
                  const animationKey = keyAnimations.get(key.note) || 0;
                  
                  return (
                    <button
                      key={key.note}
                      onMouseDown={() => playNote(key.note)}
                      style={{ left: `${leftOffset + 4}px`, animationKey: animationKey as any }}
                      className={`
                        absolute w-12 h-40 bg-black border border-gray-800 rounded-b-lg shadow-2xl text-white
                        hover:bg-gray-800 active:bg-gray-700
                        transition-all duration-300 flex flex-col justify-end items-center pb-4 z-10
                        ${isActive ? 'bg-blue-600 border-blue-500 animate-pulse' : ''}
                      `}
                    >
                      <span className="text-xs font-bold bg-black bg-opacity-50 px-1 py-0.5 rounded text-white mb-1">
                        {key.key?.toUpperCase()}
                      </span>
                      <span className="text-xs opacity-75">{key.note}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Song Suggestions */}
        <div className="flex justify-center px-8">
          <div style={{width: '736px'}}>
            <div className="flex flex-wrap gap-2 justify-center">
              {[
                { key: 'happyBirthday', value: 'Happy birthday' },
                { key: 'twinkleTwinkle', value: 'Twinkle twinkle little star' },
                { key: 'maryHadLamb', value: 'Mary had a little lamb' }
              ].map((suggestion) => (
                <button
                  key={suggestion.key}
                  onClick={async () => {
                    setCurrentSong(null);
                    setIsPlaying(false);
                    if (sequenceRef.current) {
                      sequenceRef.current.forEach(clearTimeout);
                    }
                    setActiveKeys(new Set());
                    
                    setSongInput(suggestion.value);
                    await parseSong(suggestion.value);
                  }}
                  disabled={isProcessing}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {t(suggestion.key)}
                </button>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default PianoPlayer;