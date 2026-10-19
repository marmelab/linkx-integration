<?php

namespace App\Controller;

use App\Entity\User;
use App\Model\PublicUser;
use App\Service\AuthService;
use Doctrine\DBAL\Exception\UniqueConstraintViolationException;
use Exception;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\CurrentUser;
use Symfony\Component\Validator\Exception\ValidationFailedException;
use Symfony\Component\Validator\Validator\ValidatorInterface;

final class ApiLoginController extends AbstractController
{
    #[Route('/api/user/login', name: 'api_login')]
    public function login(#[CurrentUser] ?User $user): JsonResponse
    {
        if (empty($user)) {
            return $this->json([
                'message' => 'missing_credentials'
            ], Response::HTTP_UNAUTHORIZED);
        }

        $token = bin2hex(openssl_random_pseudo_bytes(32));
        $user->setCurrentToken($token);

        return $this->json([
            'username' => $user->getUsername(),
            'token' => $user->getCurrentToken(),
        ]);
    }

    #[Route('/api/user/register', methods: ['POST'])]
    public function register(Request $request, AuthService $authService): JsonResponse
    {
        try {
            $user = $authService->registerUser(
                $request->getPayload()->get('username'),
                $request->getPayload()->get('password'),
                $request->getPayload()->get('displayName'),
            );

            return $this->json(new PublicUser($user), Response::HTTP_CREATED);
        } catch (ValidationFailedException $exception) {
            $errorList = [];
            foreach ($exception->getViolations() as $violation) {
                $errorList[] = "{$violation->getPropertyPath()}: {$violation->getMessage()}";
            }
            return $this->json([
                'error' => 'The form validation failed.',
                'errorList' => $errorList,
            ], Response::HTTP_BAD_REQUEST);
        } catch (UniqueConstraintViolationException $exception) {
            return $this->json([
                'error' => "This username is already taken.",
            ]);
        }
    }
}
