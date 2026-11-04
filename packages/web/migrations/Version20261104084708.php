<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20261104084708 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Added status, dates and victor to online games. Removed completed boolean, replaced by status.';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('ALTER TABLE game ADD status VARCHAR(255) NOT NULL DEFAULT \'blocked\'');
        $this->addSql('ALTER TABLE game ADD created_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP');
        $this->addSql('ALTER TABLE game ADD updated_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP');
        $this->addSql('ALTER TABLE game ADD victor_id INT DEFAULT NULL');
        $this->addSql("UPDATE game SET status = CASE WHEN completed = TRUE THEN 'blocked' ELSE 'running' END");
        $this->addSql('ALTER TABLE game DROP completed');
        $this->addSql('ALTER TABLE game ADD CONSTRAINT FK_232B318CC3AD9867 FOREIGN KEY (victor_id) REFERENCES "user" (id)');
        $this->addSql('CREATE INDEX IDX_232B318CC3AD9867 ON game (victor_id)');

        // This part is leftovers from the authentication PR
        $this->addSql('ALTER TABLE "user" DROP current_token');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE game DROP CONSTRAINT FK_232B318CC3AD9867');
        $this->addSql('DROP INDEX IDX_232B318CC3AD9867');
        $this->addSql('ALTER TABLE game ADD completed BOOLEAN DEFAULT false NOT NULL');
        $this->addSql('ALTER TABLE game DROP status');
        $this->addSql('ALTER TABLE game DROP created_at');
        $this->addSql('ALTER TABLE game DROP updated_at');
        $this->addSql('ALTER TABLE game DROP victor_id');

        // This part is leftovers from the authentication PR
        $this->addSql('ALTER TABLE "user" ADD current_token VARCHAR(64) DEFAULT NULL');
    }
}
