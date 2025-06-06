/**
 * Formatta la durata da millisecondi a formato mm:ss
 */
export const formatDuration = (duration: number | undefined | string): string => {
  if (!duration || isNaN(Number(duration))) {
    return "--:--";
  }
  const totalSeconds = Math.floor(Number(duration) / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

/**
 * Formatta il tempo da secondi a formato mm:ss
 */
export const formatTime = (milliseconds: number | string): string => {
  const ms = typeof milliseconds === 'string' ? parseFloat(milliseconds) : milliseconds;
  if (isNaN(ms)) return "0:00";
  
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}; 