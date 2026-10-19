<?php

namespace App\Tests\Service;

use App\Model\Game;
use App\Model\Move;
use App\Model\Piece;
use App\Model\PiecePossibleMatrices;
use App\Service\GameRunner;
use App\Service\LinkxRules;
use App\Service\StateUpdater;
use PHPUnit\Framework\TestCase;

class GameRunnerTest extends TestCase
{

    public function testInitAGameFromEmptyState(): void
    {
        $stateUpdater = $this->createStub(StateUpdater::class);
        $rulesService = $this->createStub(LinkxRules::class);

        $stubPieceMatrix = (new PiecePossibleMatrices())
            ->setMatrix([[1]])
            ->setRotations([0, 1, 2, 3])
            ->setMirrored([false, true]);
        $stubPiece = (new Piece())
            ->setPiece("1")
            ->setPossibleMatrices([$stubPieceMatrix]);
        $stubGame = (new Game())
            ->setAvailablePieces([
                (new Piece())->setColor("white")->setPiece("1")->setCount(2),
                (new Piece())->setColor("blue")->setPiece("1")->setCount(2),
            ])
            ->setTurnOfPlayer('white')
            ->setGrid([['.', '.', '.'], ['.', '.', '.'], ['.', '.', '.']]);

        $rulesService
            ->method('getPiecesMatrices')
            ->willReturn([$stubPiece]);
        $rulesService
            ->method('getGameFromStringState')
            ->willReturn($stubGame);
        $rulesService
            ->method('getPossibleMoves')
            ->willReturn([new Move(false, "white", "1", 1, 0, false)]);

        $gameRunner = new GameRunner($stateUpdater, $rulesService);
        $game = $gameRunner->getGame(null);

        $this->assertEquals($stubGame->getGrid(), $game->getGrid());
        $this->assertEquals(2, $game->getAvailablePieces()[0]->getCount());
        $this->assertEquals($stubPieceMatrix, $game->getAvailablePieces()[0]->getPossibleMatrices()[0]);
        $this->assertSame('white', $game->getTurnOfPlayer());
        $this->assertEmpty($game->getLastMove());
        $this->assertEmpty($game->getVictory());
        $this->assertEquals(['blue' => true, 'white' => true], $game->getCanPlay());
        $this->assertEquals('W', $game->getState());
    }

    public function testPlayTurn(): void
    {
        $stateUpdater = $this->createStub(StateUpdater::class);
        $rulesService = $this->createStub(LinkxRules::class);

        $game = (new Game())
            ->setAvailablePieces([
                (new Piece())->setColor("white")->setPiece("1")->setCount(2),
                (new Piece())->setColor("blue")->setPiece("1")->setCount(2),
            ])
            ->setTurnOfPlayer('white')
            ->setGrid([['.', '.', '.'], ['.', '.', '.'], ['.', '.', '.']])
            ->setState("W");

        $stubPieceMatrix = (new PiecePossibleMatrices())
            ->setMatrix([[1]])
            ->setRotations([0, 1, 2, 3])
            ->setMirrored([false, true]);
        $stubPiece = (new Piece())
            ->setPiece("1")
            ->setPossibleMatrices([$stubPieceMatrix]);
        $stubGame = (new Game())
            ->setAvailablePieces([
                (new Piece())->setColor("white")->setPiece("1")->setCount(2),
                (new Piece())->setColor("blue")->setPiece("1")->setCount(2),
            ])
            ->setTurnOfPlayer('white')
            ->setGrid([['.', '.', '.'], ['.', '.', '.'], ['.', '.', '.']]);

        $rulesService
            ->method('getGameFromStringState')
            ->willReturn($stubGame);
        $stateUpdater
            ->method('stringifyMove')
            ->willReturn('1r1m3');
        $rulesService
            ->method('getPossibleMoves')
            ->willReturn([new Move(false, "white", "1", 1, 0, false)]);
        $rulesService
            ->method('getPiecesMatrices')
            ->willReturn([$stubPiece]);

        $gameRunner = new GameRunner($stateUpdater, $rulesService);
        $updatedGame = $gameRunner->playTurn($game, '1', 1, true, 3);

        $this->assertSame("W 1r1m3", $updatedGame->getState());
    }

    public function testSkipTurn()
    {
        $stateUpdater = $this->createStub(StateUpdater::class);
        $rulesService = $this->createStub(LinkxRules::class);

        $game = (new Game())
            ->setAvailablePieces([
                (new Piece())->setColor("white")->setPiece("1")->setCount(2),
                (new Piece())->setColor("blue")->setPiece("1")->setCount(2),
            ])
            ->setTurnOfPlayer('white')
            ->setGrid([['.', '.', '.'], ['.', '.', '.'], ['.', '.', '.']])
            ->setState("W")
            ->setCanPlay(['white' => false, 'blue' => false]);

        $stubPieceMatrix = (new PiecePossibleMatrices())
            ->setMatrix([[1]])
            ->setRotations([0, 1, 2, 3])
            ->setMirrored([false, true]);
        $stubPiece = (new Piece())
            ->setPiece("1")
            ->setPossibleMatrices([$stubPieceMatrix]);
        $stubGame = (new Game())
            ->setAvailablePieces([
                (new Piece())->setColor("white")->setPiece("1")->setCount(2),
                (new Piece())->setColor("blue")->setPiece("1")->setCount(2),
            ])
            ->setTurnOfPlayer('white')
            ->setGrid([['.', '.', '.'], ['.', '.', '.'], ['.', '.', '.']]);

        $rulesService
            ->method('getGameFromStringState')
            ->willReturn($stubGame);
        $rulesService
            ->method('getPiecesMatrices')
            ->willReturn([$stubPiece]);
        $stateUpdater
            ->method('stringifyMove')
            ->willReturn('Should not be here');

        $gameRunner = new GameRunner($stateUpdater, $rulesService);
        $updatedGame = $gameRunner->playTurn($game, '1', 1, true, 3);

        $this->assertSame("W --", $updatedGame->getState());
    }
}
