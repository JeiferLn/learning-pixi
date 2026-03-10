/**
 * Configuración centralizada del slot.
 * Re-exporta layout (visual) y game (lógico) para compatibilidad.
 */
import { SLOT_GAME_CONFIG } from './slotGameConfig';
import { SLOT_LAYOUT_CONFIG } from './slotLayoutConfig';

export { SLOT_GAME_CONFIG } from './slotGameConfig';
export { SLOT_LAYOUT_CONFIG } from './slotLayoutConfig';

/** Config unificada (layout + game) para imports existentes */
export const SLOT_CONFIG = {
  ...SLOT_LAYOUT_CONFIG,
  ...SLOT_GAME_CONFIG,
} as const;

/** Resultado del tablero: array de columnas, cada columna tiene visibleRows símbolos por ID */
export type BoardResult = readonly (readonly number[])[];
