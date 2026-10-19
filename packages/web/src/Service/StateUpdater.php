<?php

namespace App\Service;

class StateUpdater {

    public function stringifyMove(bool $skipped, string $piece, int $rotation, bool $mirrored, int $column) {
        if ($skipped) {
            return "--";
        }
        $mirroredStr = $mirrored ? "m" : "";
        return "{$piece}r{$rotation}{$mirroredStr}{$column}";
    }

    public function keepOnlyUntilMove(string $state, string $move) {
        $indexOfLastOccurence = mb_strrpos($state, $move);
        return mb_trim(mb_substr($state, 0, $indexOfLastOccurence, "utf8"));
    }
}