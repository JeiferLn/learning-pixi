/**
 * Configuración centralizada de la máquina tragamonedas.
 * Ajustar estos valores según el diseño del juego.
 */
export const SLOT_CONFIG = {
  /** Filas visibles en la ventana de juego */
  visibleRows: 3,
  /** Número de carretes (columnas) */
  totalReels: 5,
  /** Tamaño en px de cada símbolo */
  symbolSize: 205,
  /** Espacio entre carretes */
  reelSpacing: 36,
  /** Área visible: posición Y superior y altura del mask */
  visibleArea: {
    top: 410,
    height: 630,
  },
  /** Offset para centrar símbolos al detenerse */
  snapOffset: 20,
  /** Padding horizontal del símbolo dentro del carrete */
  symbolPaddingX: 20,
  /** Margen extra del ancho del mask respecto al símbolo */
  maskWidthPadding: 40,
  /** Delay entre paradas de cada carrete (segundos) */
  stopDelay: 0.5,
  /** Pivot del SlotMachine para alineación con el background */
  slotMachinePivot: { x: 606, y: 740 },
  /** Velocidad de giro (px/segundo) */
  spinSpeed: 3000,
  /**
   * Zona Y donde se inyectan los símbolos para que "rueden" hacia la vista.
   * Centros entre 307.5 y 410 = justo encima del área visible.
   */
  injectionZoneTop: 307.5,
  injectionZoneBottom: 410,
} as const;

/** Resultado del tablero: array de columnas, cada columna tiene visibleRows símbolos por ID */
export type BoardResult = readonly (readonly number[])[];
