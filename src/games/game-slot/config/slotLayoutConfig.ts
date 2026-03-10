/**
 * Configuración visual y de layout del slot.
 * Posiciones, tamaños, áreas de renderizado.
 */
export const SLOT_LAYOUT_CONFIG = {
  /** Tamaño en px de cada símbolo */
  symbolSize: 205,
  /** Espacio entre carretes */
  reelSpacing: 36,
  /** Área visible: posición Y superior y altura del mask */
  visibleArea: {
    top: 405,
    height: 630,
  },
  /** Offset para centrar símbolos al detenerse */
  snapOffset: 20,
  /** Padding horizontal del símbolo dentro del carrete */
  symbolPaddingX: 30,
  /** Margen extra del ancho del mask respecto al símbolo */
  maskWidthPadding: 60,
  /** Pivot del SlotMachine para alineación con el background */
  slotMachinePivot: { x: 615, y: 740 },
  /** Posición del botón SPIN (relativo al centro y al borde inferior) */
  spinButton: {
    radius: 103,
    offsetX: 28,
    offsetYFromBottom: 215,
  },
  /**
   * Zona Y donde se inyectan los símbolos para que "rueden" hacia la vista.
   * Centros entre 307.5 y 410 = justo encima del área visible.
   */
  injectionZoneTop: 307.5,
  injectionZoneBottom: 410,
  /** Animación: impulso inicial al arrancar (velocidad px/s hacia arriba, negativos) */
  spinStartKick: -600,
  /** Animación: duración del impulso arranque (segundos) */
  spinStartKickDuration: 0.5,
  /** Animación: overshoot al parar (px) */
  spinStopOvershoot: 200,
  /** Animación: duración del bounce al parar (segundos) */
  spinStopBounceDuration: 0.5,
} as const;
