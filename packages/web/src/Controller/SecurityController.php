<?php

namespace App\Controller;

use App\Service\AuthService;
use Doctrine\DBAL\Exception\UniqueConstraintViolationException;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Authentication\AuthenticationUtils;
use Symfony\Component\Validator\Exception\ValidationFailedException;

class SecurityController extends AbstractController
{

    #[Route(path: '/login', name: 'app_login')]
    public function login(AuthenticationUtils $authenticationUtils): Response
    {
        // get the login error if there is one
        $error = $authenticationUtils->getLastAuthenticationError();

        // last username entered by the user
        $lastUsername = $authenticationUtils->getLastUsername();

        return $this->render('security/login.html.twig', [
            'last_username' => $lastUsername,
            'error' => $error,
        ]);
    }

    #[Route(path: '/logout', name: 'app_logout')]
    public function logout(): void
    {
        throw new \LogicException('This method can be blank - it will be intercepted by the logout key on your firewall.');
    }

    #[Route(path: '/register', name: 'app_register', methods: ['GET', 'POST'])]
    public function register(Request $request, AuthService $authService): Response
    {
        $error = '';
        $errorList = [];

        try {
            if ($request->getMethod() === 'POST') {
                $authService->registerUser(
                    $request->getPayload()->get('_username'),
                    $request->getPayload()->get('_password'),
                    $request->getPayload()->get('display-name'),
                );
                return $this->redirect('/login');
            }
        } catch (ValidationFailedException $exception) {
            $error = "The form was not completed correctly.";
            $errorList = $exception->getViolations();
        } catch (UniqueConstraintViolationException $exception) {
            $error = "This username is already taken";
        }

        return $this->render("security/register.html.twig", [
            'error' => $error,
            'errorList' => $errorList,
        ]);
    }
}
