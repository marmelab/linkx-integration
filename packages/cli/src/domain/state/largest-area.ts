import type { VictoryByArea } from "../game/game.ts";
import type { Color } from "../game/move.ts";
import type { Grid } from "./grid.ts";

import { getAdjacencies, getNodeTag } from "./detect-victory.ts";

type LargestArea = {
  visited: boolean[][];
  largestWhiteArea: string[];
  largestBlueArea: string[];
};

type AreaResult = {
  visited: boolean[][];
  path: string[];
};

/**
 *
 * @param grid
 * @returns The path with every block of the largest area, null in case of a draw.
 */
export function largestArea(grid: Grid): VictoryByArea {
  const largestAreas: LargestArea = grid.reduce(
    (rowResult: LargestArea, column, gridX) => {
      return column.reduce((colResult: LargestArea, cell, gridY) => {
        if (
          cell === "." ||
          (colResult.visited[gridX] && colResult.visited[gridX][gridY])
        ) {
          return colResult;
        }
        const color = /b/i.test(cell) ? "blue" : "white";

        const areaResult = getAreaResult(
          grid,
          gridX,
          gridY,
          colResult.visited,
          color,
        );

        return {
          visited: areaResult.visited,
          largestWhiteArea:
            color === "white" &&
            areaResult.path.length > colResult.largestWhiteArea.length
              ? areaResult.path
              : colResult.largestWhiteArea,
          largestBlueArea:
            color === "blue" &&
            areaResult.path.length > colResult.largestBlueArea.length
              ? areaResult.path
              : colResult.largestBlueArea,
        } satisfies LargestArea;
      }, rowResult);
    },
    {
      visited: getEmptyVisited(grid),
      largestWhiteArea: [],
      largestBlueArea: [],
    } satisfies LargestArea,
  );

  if (
    largestAreas.largestWhiteArea.length === largestAreas.largestBlueArea.length
  ) {
    return null;
  } else if (
    largestAreas.largestWhiteArea.length > largestAreas.largestBlueArea.length
  ) {
    return {
      color: "white",
      path: largestAreas.largestWhiteArea.sort(),
    };
  } else {
    return {
      color: "blue",
      path: largestAreas.largestBlueArea.sort(),
    };
  }
}

function getAreaResult(
  grid: Grid,
  startX: number,
  startY: number,
  visited: boolean[][],
  color: Color,
): AreaResult {
  const isBlockOfSameColor =
    color === "blue"
      ? (c: string) => /b/i.test(c)
      : (c: string) => /w/i.test(c);

  const updatedVisited = visited.map((c) => c.map((e) => e));
  const area: string[] = [];
  const toVisit = [getNodeTag(startX, startY)];
  updatedVisited[startX]![startY] = true;

  while (toVisit.length) {
    const tag = toVisit.pop()!;
    area.push(tag);
    const { x, y } = tagToCoordinates(tag);
    const neighbours =
      getAdjacencies(grid, x, y, isBlockOfSameColor)?.targetNodes ?? {};
    for (const neighbour of Object.keys(neighbours)) {
      const n = tagToCoordinates(neighbour);
      if (!updatedVisited[n.x]![n.y]) {
        updatedVisited[n.x]![n.y] = true;
        toVisit.push(neighbour);
      }
    }
  }
  return {
    path: area,
    visited: updatedVisited,
  };
}

function tagToCoordinates(tag: string): { x: number; y: number } {
  const xStr = tag[0];
  const yStr = tag[2];
  if (!xStr || !yStr) {
    throw new Error(
      `Malformed tag "${tag}". Should be "X.Y", with x and y the coordinates within the grid.`,
    );
  }
  return {
    x: Number.parseInt(xStr),
    y: Number.parseInt(yStr),
  };
}

function getEmptyVisited(grid: Grid) {
  return grid.map((column) => column.map(() => false));
}
