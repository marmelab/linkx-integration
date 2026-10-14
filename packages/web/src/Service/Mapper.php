<?php

namespace App\Service;

use JsonMapper;

class Mapper {
    
    public readonly JsonMapper $json;

    public function __construct()
    {
        $this->json = new JsonMapper();
    }
}