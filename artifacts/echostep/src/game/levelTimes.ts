const BEST_TIMES_STORAGE_KEY = "echostep-best-times-v1";

export type LevelCompletion = {
  levelId: string;
  completionTimeMs: number;
  bestTimeMs: number;
  isNewBest: boolean;
};

function readBestTimes(): Record<string, number> {
  let stored: string | null;
  try {
    stored = localStorage.getItem(BEST_TIMES_STORAGE_KEY);
  } catch (error) {
    console.error("EchoStep could not read saved best times.", error);
    return {};
  }

  if (!stored) return {};

  try {
    const parsed: unknown = JSON.parse(stored);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      console.warn("EchoStep ignored invalid saved best times.");
      return {};
    }

    return Object.fromEntries(
      Object.entries(parsed).filter(
        (entry): entry is [string, number] =>
          typeof entry[1] === "number" && Number.isFinite(entry[1]) && entry[1] >= 0,
      ),
    );
  } catch (error) {
    console.warn("EchoStep ignored corrupted saved best times.", error);
    return {};
  }
}

export function recordLevelCompletion(levelId: string, completionTimeMs: number): LevelCompletion {
  const bestTimes = readBestTimes();
  const previousBest = bestTimes[levelId];
  const isNewBest = previousBest === undefined || completionTimeMs < previousBest;
  const bestTimeMs = previousBest === undefined
    ? completionTimeMs
    : Math.min(completionTimeMs, previousBest);

  if (isNewBest) {
    bestTimes[levelId] = completionTimeMs;
    try {
      localStorage.setItem(BEST_TIMES_STORAGE_KEY, JSON.stringify(bestTimes));
    } catch (error) {
      console.error("EchoStep could not save the level's best time.", error);
    }
  }

  return { levelId, completionTimeMs, bestTimeMs, isNewBest };
}

export function formatCompletionTime(milliseconds: number): string {
  const centiseconds = Math.floor(milliseconds / 10);
  const minutes = Math.floor(centiseconds / 6_000);
  const seconds = Math.floor((centiseconds % 6_000) / 100);
  const remainder = centiseconds % 100;

  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}.${String(remainder).padStart(2, "0")}`;
}
