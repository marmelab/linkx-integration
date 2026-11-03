<?php

namespace App\Controller;

use App\Entity\User;
use App\Service\AuthService;
use Doctrine\ORM\EntityManagerInterface;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Cookie;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\CurrentUser;
use Symfony\Component\Validator\Exception\ValidationFailedException;

final class ApiLoginController extends AbstractController
{
    #[Route('/api/user/login', name: 'api_user_login', methods: ['POST'])]
    public function login(#[CurrentUser] ?User $user, EntityManagerInterface $em, JWTTokenManagerInterface $JWTManager): JsonResponse
    {
        if (empty($user)) {
            return $this->json([
                'message' => 'missing_credentials'
            ], Response::HTTP_UNAUTHORIZED);
        }

        $expiration = new \DateTimeImmutable('+1 hour');

        $token = $JWTManager->createFromPayload($user, [
            'exp' => ($expiration)->getTimestamp(),
            'id' => $user->getId(),
            'displayName' => $user->getDisplayName(),
            'email' => $user->getEmail(),
            'roles' => $user->getRoles(),
            'domain' => $_ENV['DEFAULT_URI'],
        ]);

        $em->flush();

        $cookie = Cookie::create('BEARER')
            ->withValue($token)
            ->withExpires($expiration)
            ->withDomain($_ENV['DEFAULT_URI'])
            ->withSecure($_ENV['APP_ENV'] !== "dev")
            ->withHttpOnly(true)
            ->withSameSite(Cookie::SAMESITE_LAX);

        $response = $this->json([
            'username' => $user->getUsername(),
            'token' => $token,
        ]);

        $response->headers->setCookie($cookie);

        return $response;
    }

    #[Route('/api/user/logout', methods: ['POST'])]
    public function logout(#[CurrentUser] User $user, EntityManagerInterface $em): JsonResponse
    {
        // No ban functionality (yet), so we just have to remove the token from the client.

        $response = $this->json(['message' => 'Token removed.'], 200, [$cookie]);

        $response->headers->clearCookie("BEARER");

        return $response;
    }

    #[Route('/api/user/register', methods: ['POST'])]
    public function register(Request $request, AuthService $authService): JsonResponse
    {
        try {
            $user = $authService->registerUser(
                $request->getPayload()->get('username'),
                $request->getPayload()->get('password'),
                $request->getPayload()->get('displayName'),
                $request->getPayload()->get('email'),
            );

            return $this->json($user, Response::HTTP_CREATED, [], ['groups' => 'self']);
        } catch (ValidationFailedException $exception) {
            $errorList = [];
            foreach ($exception->getViolations() as $violation) {
                $errorList[] = [
                    'field' => $violation->getPropertyPath(),
                    'message' => $violation->getMessage()
                ];
            }
            return $this->json([
                'error' => 'The form validation failed.',
                'errorList' => $errorList,
            ], Response::HTTP_BAD_REQUEST);
        }
    }
}
