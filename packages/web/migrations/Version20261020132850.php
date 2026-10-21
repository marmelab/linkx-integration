<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20261020132850 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Swap player uniqid for foreign keys + added a completed field.';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE game ADD completed BOOLEAN NOT NULL DEFAULT true');
        $this->addSql('ALTER TABLE game ADD first_player_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE game ADD second_player_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE game DROP player_1_sessid');
        $this->addSql('ALTER TABLE game DROP player_2_sessid');
        $this->addSql('ALTER TABLE game ADD CONSTRAINT FK_232B318C65EB6591 FOREIGN KEY (first_player_id) REFERENCES "user" (id)');
        $this->addSql('ALTER TABLE game ADD CONSTRAINT FK_232B318CA40D7457 FOREIGN KEY (second_player_id) REFERENCES "user" (id)');
        $this->addSql('CREATE INDEX IDX_232B318C65EB6591 ON game (first_player_id)');
        $this->addSql('CREATE INDEX IDX_232B318CA40D7457 ON game (second_player_id)');
        $this->addSql('DROP INDEX uniq_identifier_username');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE game DROP CONSTRAINT FK_232B318C65EB6591');
        $this->addSql('ALTER TABLE game DROP CONSTRAINT FK_232B318CA40D7457');
        $this->addSql('DROP INDEX IDX_232B318C65EB6591');
        $this->addSql('DROP INDEX IDX_232B318CA40D7457');
        $this->addSql('ALTER TABLE game ADD player_1_sessid VARCHAR(255) NOT NULL');
        $this->addSql('ALTER TABLE game ADD player_2_sessid VARCHAR(255) DEFAULT NULL');
        $this->addSql('ALTER TABLE game DROP completed');
        $this->addSql('ALTER TABLE game DROP first_player_id');
        $this->addSql('ALTER TABLE game DROP second_player_id');
        $this->addSql('CREATE UNIQUE INDEX uniq_identifier_username ON "user" (username)');
    }
}
