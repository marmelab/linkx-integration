import type { Victory } from "../game/game.ts";
import type { Color } from "../game/move.ts";
import type { Grid } from "./grid.ts";

import { getAdjacencies, getNodeTag } from "./detect-victory.ts";

type LargestArea = {
  visited: boolean[][];
  largestWhiteArea: string[];
  largestBlueArea: string[];
};

/**
 *
 * @param grid
 * @returns The path with every block of the largest area, false in case of a draw.
 */
export function largestArea(grid: Grid): Victory {
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

        const fullArea = getFullArea(
          grid,
          gridX,
          gridY,
          colResult.visited,
          color,
        );
        const visited = mergeBooleanArrayWithLogicalOr(
          colResult.visited,
          fullArea,
        );
        const areaPath = areaToPath(fullArea);

        return {
          visited,
          largestWhiteArea:
            color === "white" &&
            areaPath.length > colResult.largestWhiteArea.length
              ? areaPath
              : colResult.largestWhiteArea,
          largestBlueArea:
            color === "blue" &&
            areaPath.length > colResult.largestBlueArea.length
              ? areaPath
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
    return false;
  } else if (
    largestAreas.largestWhiteArea.length > largestAreas.largestBlueArea.length
  ) {
    return {
      color: "white",
      path: largestAreas.largestWhiteArea,
    };
  } else {
    return {
      color: "blue",
      path: largestAreas.largestBlueArea,
    };
  }
}

function getFullArea(
  grid: Grid,
  gridX: number,
  gridY: number,
  visited: boolean[][],
  color: Color,
): boolean[][] {
  const isBlockOfSameColor =
    color === "blue"
      ? (c: string) => /b/i.test(c)
      : (c: string) => /w/i.test(c);

  const emptyVisitedForArea = getEmptyVisited(grid);

  return visitAdjacencies(
    grid,
    gridX,
    gridY,
    visited,
    emptyVisitedForArea,
    isBlockOfSameColor,
  );
}

function visitAdjacencies(
  grid: Grid,
  gridX: number,
  gridY: number,
  totalVisited: boolean[][],
  visitedForArea: boolean[][],
  isBlockOfSameColor: Function,
): boolean[][] {
  if (totalVisited[gridX] && totalVisited[gridX][gridY]) {
    return visitedForArea;
  }

  const adjacencies = getAdjacencies(grid, gridX, gridY, isBlockOfSameColor);

  const updatedTotalVisited = totalVisited.map((column, x) =>
    column.map((isVisited, y) => {
      return isVisited || (x === gridX && y === gridY);
    }),
  );

  let updatedVisitedForArea = visitedForArea.map((column, x) =>
    column.map((isVisited, y) => {
      return isVisited || (x === gridX && y === gridY);
    }),
  );

  if (adjacencies?.targetNodes) {
    for (let adjacencyTag in adjacencies.targetNodes) {
      const coords = tagToCoordinates(adjacencyTag);
      updatedVisitedForArea = visitAdjacencies(
        grid,
        coords.x,
        coords.y,
        updatedTotalVisited,
        updatedVisitedForArea,
        isBlockOfSameColor,
      );
    }
  }

  return updatedVisitedForArea;
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

function mergeBooleanArrayWithLogicalOr(
  arrayA: boolean[][],
  arrayB: boolean[][],
): boolean[][] {
  return arrayA.map((visitedCol, visitedX) =>
    visitedCol.map((visitedValue, visitedY) => {
      return visitedValue || (arrayB[visitedX]?.at(visitedY) ?? false);
    }),
  );
}

function areaToPath(area: boolean[][]): string[] {
  return area.reduce(
    (colPath: string[], column, gridX) =>
      column.reduce((path, cellValue, gridY) => {
        if (cellValue) {
          return [...path, getNodeTag(gridX, gridY)];
        }
        return path;
      }, colPath),
    [],
  );
}
