<?php

namespace App\Service;

use App\Model\Move;

class StateUpdater
{

    public function stringifyMove(Move $move)
    {
        if ($move->getSkipped()) {
            return "--";
        }
        $mirroredStr = $move->getMirrored() ? "m" : "";
        $column = $move->getColumn() + 1; // String format is 1-based index
        return "{$move->getPiece()}r{$move->getRotation()}{$mirroredStr}{$column}";
    }

    public function keepOnlyUntilMove(string $state, string $move)
    {
        $indexOfLastOccurence = mb_strrpos($state, $move);
        return mb_trim(mb_substr($state, 0, $indexOfLastOccurence, "utf8"));
    }
}
