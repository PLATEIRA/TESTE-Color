create database if not exists testevaga;

use testevaga;

create table if not exists mensagem (
	id int not null auto_increment,
    nome varchar(255),
    email varchar(255),
    mensagem LONGTEXT,
    primary key(id)
);
    