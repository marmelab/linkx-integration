<?php

namespace App\Service;

use App\Model\Game;
use App\Model\Move;

class GameRunner
{

    public function __construct(
        private StateUpdater $stateUpdater,
        private LinkxRules $rulesService,
    ) {}

    public function getGame(?string $state): Game
    {
        $game = $this->rulesService->getGameFromStringState($state);
        $game->setState($state);

        // Anchoring the color of the first move
        if (is_null($state)) {
            $game->setState($game->getTurnOfPlayer() === "white" ? "W" : "");
        }
        $game->setCanPlay($this->canThePlayersPlay($game, $state));

        // Cross data from all possibles pieces with remaining pieces count
        $allMatrices = $this->rulesService->getPiecesMatrices();
        foreach ($game->getAvailablePieces() as $piece) {
            $pieceMatrices = array_find($allMatrices, function ($pieceMatricesEntry) use ($piece) {
                return $piece->getPiece() === $pieceMatricesEntry->getPiece();
            });
            $piece->setPossibleMatrices($pieceMatrices->getPossibleMatrices());
        }

        return $game;
    }

    public function playTurn(Game $game, ?string $selected, ?int $selectedRotation, ?bool $selectedMirrored, ?int $column): Game
    {
        $otherColor = $game->getTurnOfPlayer() === "blue" ? "white" : "blue";
        $state = $game->getState();


        if (!$game->getCanPlay()[$game->getTurnOfPlayer()] && $game->getCanPlay()[$otherColor]) {
            $state .= "--";
        } else if (isset($column) && !is_null($column) && $column >= 0) {
            if (!empty($state)) {
                $state .= " ";
            }
            $moveStr = $this->stateUpdater->stringifyMove(new Move(false, $game->getTurnOfPlayer(), $selected, $column, $selectedRotation, $selectedMirrored));
            $state .= $moveStr;
        }

        return $this->getGame($state);
    }

    public function undoTurn(Game $game, Move|string $moveToUndo)
    {
        // First move case
        if (empty($game->getState())) {
            return $game;
        }

        $game = clone $game;

        if (is_string($moveToUndo)) {
            $moveStr = $moveToUndo;
        } else {
            $moveStr = $this->stateUpdater->stringifyMove($moveToUndo);
        }

        $game->setState($this->stateUpdater->keepOnlyUntilMove($game->getState(), $moveStr));
        return $game;
    }

    function canThePlayersPlay(Game $game, ?string $state)
    {
        $canPlay = ["blue" => true, "white" => true];
        $currentPossibleMoves = $this->rulesService->getPossibleMoves($state);

        if ($game->getLastMove() && $game->getLastMove()->getColor() === "blue") {
            if ($game->getLastMove()->getSkipped()) {
                $canPlay["blue"] = false;
            }
            $canPlay["white"] = count($currentPossibleMoves) > 0;
        } else if ($game->getLastMove() && $game->getLastMove()->getColor() === "white") {
            if ($game->getLastMove()->getSkipped()) {
                $canPlay["white"] = false;
            }
            $canPlay["blue"] = count($currentPossibleMoves) > 0;
        } else if ($state === "W") {
            $canPlay["white"] = $currentPossibleMoves;
            $canPlay["blue"] = true;
        } else {
            $canPlay["blue"] = $currentPossibleMoves;
            $canPlay["white"] = true;
        }

        return $canPlay;
    }
}
