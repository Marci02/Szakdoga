CREATE TABLE `user` (
  `id` bigint PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `firstname` varchar(100) NOT NULL,
  `lastname` varchar(100) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created` timestamp,
  `remember_token` varchar(100),
  `phone_number` varchar(255) NOT NULL,
  `postcode` int NOT NULL,
  `image` varchar(255)
);

CREATE TABLE `city` (
  `postcode_id` int PRIMARY KEY NOT NULL,
  `name` varchar(255) NOT NULL,
  `county_id` int NOT NULL
);

CREATE TABLE `counties` (
  `id` int PRIMARY KEY NOT NULL,
  `name` varchar(255) NOT NULL
);

CREATE TABLE `admins` (
  `id` int PRIMARY KEY NOT NULL,
  `email` varchar(255) NOT NULL,
  `username` varchar(255) NOT NULL
);

ALTER TABLE `user` ADD FOREIGN KEY (`postcode`) REFERENCES `city` (`postcode_id`);

ALTER TABLE `city` ADD FOREIGN KEY (`county_id`) REFERENCES `counties` (`id`);
