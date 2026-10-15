import { GRID_MAX_HEIGHT } from "../game/game.ts";
import {
  POSSIBLE_PIECES,
  type Color,
  type Move,
  type Piece,
  type Rotation,
} from "../game/move.ts";

/**
 * Transform a string describing the state of the game into an ordered array of moves.
 * The index 0 corresponds to the first move.
 * @param input The state string to be parsed. Format is described in notation.md. Can be undefined or null to obtain a blank state.
 * @returns An ordered array containing Move objects normalized.
 */
export function parseSaveFile(input?: string): Array<Move> {
  if (!input || input.length === 0) {
    return [];
  }

  const parts = input.split(" ");
  return parts
    .map((moveInput, index) => {
      // If Blue starts : first move is at index 0.
      // If White starts : first move is at index 1 (index 0 is the "W")
      const color = index % 2 === 0 ? "blue" : "white";
      if (moveInput.toUpperCase() === "W") {
        return undefined;
      }
      if (!moveInput) {
        throw new Error(
          "Blank moves are not allowed. Please verify you do not have a double whitespace in the given state.",
        );
      }

      return parseSingularMove(color, moveInput);
    })
    .filter((m) => !!m); // Necessary to exclude the undefined value from the white start flag if present
}

export function parseSingularMove(color: Color, moveInput: string) {
  try {
    if (moveInput === "--") {
      return {
        skipped: true,
        color,
      } satisfies Move;
    }

    return {
      skipped: false,
      color,
      piece: extractPiece(moveInput),
      column: extractColumn(moveInput),
      rotation: extractRotation(moveInput),
      mirrored: /m/i.test(moveInput),
    } satisfies Move;
  } catch (error: any) {
    error.additionalContext = {
      move: moveInput,
    };
    throw error;
  }
}

function extractPiece(moveInput: string): Piece {
  if (moveInput[0] === "1" || moveInput[0] === "2") {
    return moveInput[0];
  } else if (moveInput[0] === "3" || moveInput[0] === "4") {
    if (moveInput.length <= 1) {
      throw new Error(
        `The move "${moveInput}" is too short and does not contains the required information.`,
      );
    }
    const piece = moveInput[0] + moveInput[1]?.toUpperCase();
    if (POSSIBLE_PIECES.includes(piece)) {
      return piece as Piece;
    }
  }
  throw new Error(`Piece ${moveInput[0]} not recognized.`);
}

function extractRotation(moveInput: string): Rotation {
  const rotationInput = moveInput.match(/r\d/i);
  if (rotationInput && rotationInput[0]) {
    const rotationNumber = Number.parseInt(rotationInput[0].charAt(1));
    if (Number.isNaN(rotationNumber)) {
      throw new Error(
        `Rotation not recognized.\nThe rotation is indicated by a 'r' followed by a number between 0 and 3.`,
      );
    }
    return (rotationNumber % 4) as Rotation;
  }
  return 0;
}

function extractColumn(moveInput: string): number {
  const columnChar = moveInput[moveInput.length - 1];
  if (columnChar && /\d/.test(columnChar)) {
    const inputedNumber = Number.parseInt(columnChar) - 1; // -1 to adjust between 0-starting index in js and 1-starting index in file
    if (inputedNumber < 0 || inputedNumber > GRID_MAX_HEIGHT) {
      throw new Error(`Column number ranges from 1 to ${GRID_MAX_HEIGHT + 1}`);
    }
    return inputedNumber;
  }
  throw new Error(
    "The last character of a move must be a number corresponding to the column in which the piece is played.",
  );
}
