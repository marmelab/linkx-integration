<?php

namespace App\Controller\Admin;

use App\Entity\User;
use App\Model\ListParams;
use App\Model\UserEdit;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Attribute\MapQueryString;
use Symfony\Component\HttpKernel\Attribute\MapRequestPayload;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\CurrentUser;

class AdminUsersController extends AbstractController
{

    public function __construct(
        private UserRepository $userRepository,
        private EntityManagerInterface $em,
    ) {}

    #[Route(path: "/api/admin/users", name: "admin_list_users")]
    public function adminListUsers(#[MapQueryString] ListParams $params)
    {
        if ($params->get_sort()) {
            $sort = gettype($params->get_sort()) === "string"
                ? [$params->get_sort() => $params->get_order() ?? "ASC"]
                : array_reduce($params->get_sort(), function ($accumulator, $sortElem) use ($params) {
                    return $accumulator[$sortElem] = $params->get_order() ?? "ASC";
                }, []);
        } else {
            $sort = [];
        }

        $filter = [];
        if (!empty($params->getQ())) {
            $filter["q"] = $params->getQ();
        }
        if (!empty($params->getId())) {
            $filter["id"] = $params->getId();
        }

        $limit = !is_null($params->get_end()) && !is_null($params->get_start())
            ? $params->get_end() - $params->get_start()
            : 10;
        if ($limit > 50) {
            $limit = 50;
        }

        $users = $this->userRepository->findFilteredBy(
            $filter,
            $sort,
            $limit,
            $params->get_start() ?? 0,
        );

        return $this->json($users, 200, [
            "X-Total-Count" => $this->userRepository->countFilteredBy($filter),
        ], ['groups' => ['admin-view']]);
    }

    #[Route(path: "/api/admin/users/{id}", methods: ['GET'], name: "admin_show_user")]
    public function adminShowUser(User $userToShow)
    {
        return $this->json($userToShow, 200, [], ['groups' => ['admin-view']]);
    }

    #[Route(path: "/api/admin/users/{id}", methods: ['PUT'], name: "admin_edit_user")]
    public function adminEditUser(User $userToEdit, #[MapRequestPayload] UserEdit $formData, #[CurrentUser] User $currentUser)
    {
        $roles = array_filter($formData->getRoles(), function ($role) {
            return $role !== "ROLE_USER";
        });

        if (
            $userToEdit->getId() === $currentUser->getId()
            && empty(array_intersect(['ROLE_ADMIN', 'ROLE_USER_MANAGER'], $roles))
        ) {
            return $this->json(['message' => 'You cannot remove this role from yourself.'], 400);
        }
        if (in_array("ROLE_ADMIN", $userToEdit->getRoles()) && !$this->isGranted("ROLE_ADMIN")) {
            return $this->json(['message' => 'You do not have the required role to edit an administrator.'], 403);
        }
        if (in_array("ROLE_ADMIN", $formData->getRoles()) && !$this->isGranted("ROLE_ADMIN")) {
            return $this->json(['message' => 'You do not have the required role to assign someone as a administrator.'], 403);
        }

        $userToEdit
            ->setDisplayName($formData->getDisplayName())
            ->setUsername($formData->getUsername())
            ->setEmail($formData->getEmail())
            ->setRoles($roles);

        $this->em->flush();

        return $this->json($userToEdit, 200, [], ['groups' => ['admin-view']]);
    }

    #[Route(path: "/api/admin/users/{id}", methods: ['DELETE'], name: 'admin_delete_user')]
    public function adminDeleteUser(User $userToDelete)
    {
        if (in_array("ROLE_ADMIN", $userToDelete->getRoles())) {
            return $this->json(['message' => 'You cannot delete the account of an administrator.'], 400);
        }

        $this->em->remove($userToDelete);
        $this->em->flush();

        return new Response('', Response::HTTP_NO_CONTENT);
    }
}
