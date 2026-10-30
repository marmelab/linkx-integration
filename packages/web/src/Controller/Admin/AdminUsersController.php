<?php

namespace App\Controller\Admin;

use App\Model\ListParams;
use App\Repository\UserRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpKernel\Attribute\MapQueryString;
use Symfony\Component\Routing\Attribute\Route;

class AdminUsersController extends AbstractController
{

    public function __construct(
        private UserRepository $userRepository,
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
}
