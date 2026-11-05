<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20261105095002 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Re-set admins to add newly created accounts.';
    }

    public function up(Schema $schema): void
    {
        $this->addSql("UPDATE \"user\" SET roles = '[\"ROLE_ADMIN\"]' WHERE email IN ('alexandra@marmelab.com', 'maxime@marmelab.com', 'benoit@marmelab.com', 'thiery@marmelab.com')");
    }

    public function down(Schema $schema): void {}
}
