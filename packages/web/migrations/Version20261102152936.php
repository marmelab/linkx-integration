<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20261102152936 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Adds ';
    }

    public function up(Schema $schema): void
    {
        $this->addSql("UPDATE \"user\" SET roles = {'ROLE_ADMIN'} WHERE email IN ('alexandra@marmelab.com', 'maxime@marmelab.com', 'benoit@marmelab.com', 'thiery@marmelab.com')");
    }

    public function down(Schema $schema): void {}
}
