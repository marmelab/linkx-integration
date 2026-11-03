<?php

namespace App\Security;

use Lexik\Bundle\JWTAuthenticationBundle\Security\Authenticator\JWTAuthenticator;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Security\Core\Exception\AuthenticationException;

class CustomAuthenticator extends JWTAuthenticator
{

    public function onAuthenticationFailure(Request $request, AuthenticationException $exception): ?Response
    {
        dd($exception);
    }
}
