CREATE DATABASE cobre_bem;


CREATE TABLE IF NOT EXISTS users (
  	id serial primary key,
  	name text not null,
  	email varchar(80) not null unique,
  	password text not null,
	cpf varchar(11) unique,
	phone varchar(11)
);

CREATE TABLE IF NOT EXISTS clients (
  	id serial primary key,
	user_id serial references users(id),
  	name text not null,
  	email varchar(80) not null unique,
  	password text not null,
	cpf varchar(11) not null unique,
	phone varchar(11),
	adrress text,
	cep varchar(8),
	complement text,
	district text,
	city text not null,
	uf varchar(2) not null,
	defaulter boolean default false
);

CREATE TABLE IF NOT EXISTS charges (
	id serial primary key,    
	user_id serial not null references users(id),
	client_id serial not null references clients(id),
  	value integer not null,
	paid boolean default false,
	due_date date not null
);
