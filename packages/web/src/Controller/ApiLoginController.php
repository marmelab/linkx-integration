<?php

namespace App\Controller;

use App\Entity\User;
use App\Service\AuthService;
use Doctrine\ORM\EntityManager;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\CurrentUser;
use Symfony\Component\Validator\Exception\ValidationFailedException;

final class ApiLoginController extends AbstractController
{
    #[Route('/api/user/login', name: 'api_login')]
    public function login(#[CurrentUser] ?User $user, EntityManagerInterface $em): JsonResponse
    {
        if (empty($user)) {
            return $this->json([
                'message' => 'missing_credentials'
            ], Response::HTTP_UNAUTHORIZED);
        }

        $token = bin2hex(openssl_random_pseudo_bytes(32));
        $user->setCurrentToken($token);

        $em->flush();

        return $this->json([
            'username' => $user->getUsername(),
            'token' => $user->getCurrentToken(),
        ]);
    }

    #[Route('/api/user/logout', methods: ['POST'])]
    public function logout(#[CurrentUser] User $user, EntityManagerInterface $em): JsonResponse
    {
        $user->setCurrentToken(null);
        $em->flush();

        return $this->json(['message' => 'Token removed.']);
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
