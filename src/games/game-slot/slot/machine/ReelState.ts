export const ReelState = {
  IDLE: 0,
  SPINNING: 1,
  STOPPING: 2,
  STOPPED: 3,
} as const;

export type ReelState = (typeof ReelState)[keyof typeof ReelState];
