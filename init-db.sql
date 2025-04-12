-- Garante que o usuário tem todas as permissões necessárias
GRANT ALL PRIVILEGES ON `nestdb`.* TO 'nestuser'@'%';
GRANT CREATE, ALTER, DROP, REFERENCES ON *.* TO 'nestuser'@'%';
FLUSH PRIVILEGES;
