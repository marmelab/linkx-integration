<?php

namespace App\Tests\Service;

use App\Model\Move;
use App\Service\StateUpdater;
use PHPUnit\Framework\TestCase;

class StateUpdaterTest extends TestCase
{

    public function testStringifyMove()
    {
        $stateUpdater = new StateUpdater();

        $this->assertEquals("12", $stateUpdater->stringifyMove(new Move(
            false,
            'white',
            '1',
            1,
            0,
            false
        )));
        $this->assertEquals("4Lr3m7", $stateUpdater->stringifyMove(new Move(
            false,
            'blue',
            '4L',
            6,
            3,
            true
        )));
        $this->assertEquals("4Sr11", $stateUpdater->stringifyMove(new Move(
            false,
            'white',
            '4S',
            0,
            1,
            false
        )));
        $this->assertEquals("--", $stateUpdater->stringifyMove(new Move(
            true,
            'white',
            '4S',
            1,
            1,
            false
        )));
        $this->assertEquals("--", $stateUpdater->stringifyMove(new Move(
            true,
            'white',
            null,
            null,
            null,
            null
        )));
    }

    public function testRemoveMoveFromState()
    {
        $stateUpdater = new StateUpdater();

        $this->assertSame("W", $stateUpdater->keepOnlyUntilMove("W 4Sr11", "4Sr11"));
        $this->assertSame("W 14 4Lr16", $stateUpdater->keepOnlyUntilMove("W 14 4Lr16", "4Sr11"));
        $this->assertSame("", $stateUpdater->keepOnlyUntilMove("", "4Sr11"));
        $this->assertSame("", $stateUpdater->keepOnlyUntilMove("4Sr11", "4Sr11"));
    }
}
