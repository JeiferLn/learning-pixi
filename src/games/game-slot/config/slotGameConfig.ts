/**
 * Configuración lógica del slot.
 * Reglas de juego, tiempos, velocidades.
 */
export const SLOT_GAME_CONFIG = {
  /** Filas visibles en la ventana de juego */
  visibleRows: 3,
  /** Número de carretes (columnas) */
  totalReels: 5,
  /** Delay entre arranques de cada carrete (segundos) */
  startDelay: 0.3,
  /** Delay entre paradas de cada carrete (segundos) */
  stopDelay: 0.3,
  /** Velocidad de giro (px/segundo) */
  spinSpeed: 3000,
} as const;
