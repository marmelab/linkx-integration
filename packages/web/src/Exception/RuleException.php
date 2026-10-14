<?php 

namespace App\Exception;

use Exception;

class RuleException extends Exception {
    public function __construct(
        string $message,
        private string $ruleMessage,
    )
    {
       parent::__construct($message);
    }

    public function getRuleMessage() {
        return $this->ruleMessage;
    }
}