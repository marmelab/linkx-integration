import Graph from "node-dijkstra";

import type { Move } from "../game/move.ts";
import type { Adjacencies, Grid } from "./grid.ts";

import { GRID_MAX_HEIGHT } from "../game/game.ts";

const SIDE_UP = "UP";
const SIDE_DOWN = "DOWN";
const SIDE_LEFT = "LEFT";
const SIDE_RIGHT = "RIGHT";

// TODO : switch from boolean to path + color in next ticket
export function detectVictory(grid: Grid, lastMove: Move): false | string[] {
  if (!lastMove || lastMove?.skipped) {
    return false;
  }

  const color = lastMove.color;
  const isBlockOfCurrentColor =
    color === "blue"
      ? (cell: string) => /b/i.test(cell)
      : (cell: string) => /w/i.test(cell);

  const route = new Graph();

  const adjacenciesWithLeftEdge: Adjacencies = {
    sourceTag: SIDE_LEFT,
    targetNodes: {},
  };
  grid[0]?.forEach((cell, gridY) => {
    if (isBlockOfCurrentColor(cell)) {
      adjacenciesWithLeftEdge.targetNodes[getNodeTag(0, gridY)] = 1;
    }
  });
  route.addNode(
    adjacenciesWithLeftEdge.sourceTag,
    adjacenciesWithLeftEdge.targetNodes,
  );

  const adjacenciesWithBottomEdge: Adjacencies = {
    sourceTag: SIDE_DOWN,
    targetNodes: {},
  };
  grid.forEach((column, gridX) => {
    if (isBlockOfCurrentColor(column[0] ?? ".")) {
      adjacenciesWithBottomEdge.targetNodes[getNodeTag(gridX, 0)] = 1;
    }
  });
  route.addNode(
    adjacenciesWithBottomEdge.sourceTag,
    adjacenciesWithBottomEdge.targetNodes,
  );

  grid.forEach((column, gridX) => {
    // Cannot use flatMap because we want to have specific keys
    column.forEach((cell, gridY) => {
      if (isBlockOfCurrentColor(cell)) {
        const adjacencies = getAdjacencies(
          grid,
          gridX,
          gridY,
          isBlockOfCurrentColor,
        );

        if (adjacencies) {
          route.addNode(adjacencies.sourceTag, adjacencies.targetNodes);
        }
      }
    });
  }, route);

  const pathOptions = { trim: true };

  const leftToRightPath = route.path(SIDE_LEFT, SIDE_RIGHT, pathOptions);
  if (leftToRightPath) {
    return leftToRightPath;
  }
  return route.path(SIDE_DOWN, SIDE_UP, pathOptions) ?? false;
}

export function getNodeTag(x: number, y: number): string {
  return `${x}.${y}`;
}

function getAdjacencies(
  grid: Grid,
  gridX: number,
  gridY: number,
  isBlockOfSameColor: Function,
): Adjacencies | null {
  const adjacencies: Adjacencies = {
    sourceTag: getNodeTag(gridX, gridY),
    targetNodes: {},
  };
  for (let x = gridX - 1; x <= gridX + 1; x++) {
    for (let y = gridY - 1; y <= gridY + 1; y++) {
      const col = grid[x];
      if (col && col[y] && isAdjacent(grid, x, y, isBlockOfSameColor)) {
        const nodeTag = getNodeTag(x, y);
        adjacencies.targetNodes[nodeTag] = 1;
      }
    }
  }
  if (gridX === GRID_MAX_HEIGHT) {
    adjacencies.targetNodes[SIDE_RIGHT] = 1;
  }
  if (gridY === GRID_MAX_HEIGHT) {
    adjacencies.targetNodes[SIDE_UP] = 1;
  }

  if (Object.entries(adjacencies.targetNodes).length === 0) {
    return null;
  }

  return adjacencies;
}

function isAdjacent(
  grid: Grid,
  gridX: number,
  gridY: number,
  isBlockOfSameColor: Function,
): boolean {
  return (
    grid[gridX] && grid[gridX][gridY] && isBlockOfSameColor(grid[gridX][gridY])
  );
}
