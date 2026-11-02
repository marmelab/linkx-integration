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

class AdminUsersController extends AbstractController
{

    public function __construct(
        private UserRepository $userRepository,
        private EntityManagerInterface $em,
    ) {}

    #[Route(path: "/api/admin/users", name: "admin_list_users")]
    public function adminListUsers(#[MapQueryString] ListParams $params)
    {
        $sort = gettype($params->get_sort()) === "string"
            ? [$params->get_sort() => $params->get_order()]
            : array_reduce($params->get_sort(), function ($accumulator, $sortElem) use ($params) {
                return $accumulator[$sortElem] = $params->get_order();
            }, []);

        $filter = []; // TODO in later ticket

        return $this->json($this->userRepository->findBy(
            $filter,
            $sort,
            $params->get_end() - $params->get_start(),
            $params->get_start()
        ), 200, [
            "X-Total-Count" => $this->userRepository->count($filter),
        ], ['groups' => ['admin-view']]);
    }

    #[Route(path: "/api/admin/users/{id}", methods: ['GET'], name: "admin_show_user")]
    public function adminShowUser(User $userToShow)
    {
        return $this->json($userToShow, 200, [], ['groups' => ['admin-view']]);
    }

    #[Route(path: "/api/admin/users/{id}", methods: ['PUT'], name: "admin_edit_user")]
    public function adminEditUser(User $userToEdit, #[MapRequestPayload] UserEdit $formData)
    {
        $userToEdit
            ->setDisplayName($formData->getDisplayName())
            ->setUsername($formData->getUsername())
            ->setEmail($formData->getEmail());

        $this->em->flush();

        return $this->json($userToEdit, 200, [], ['groups' => ['admin-view']]);
    }

    #[Route(path: "/api/admin/users/{id}", methods: ['DELETE'], name: 'admin_delete_user')]
    public function adminDeleteUser(User $userToDelete)
    {
        $this->em->remove($userToDelete);
        $this->em->flush();

        return new Response('', Response::HTTP_NO_CONTENT);
    }
}
