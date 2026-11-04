<?php

namespace App\Enum;

enum GameStatus: string
{
    /**
     * When the game is still going on.
     */
    case RUNNING = 'running';

    /**
     * When a player linked two edges and won
     */
    case EDGES_LINKED = 'edges_linked';

    /**
     * When neither player can play a legal move
     */
    case BLOCKED = 'blocked';
}
