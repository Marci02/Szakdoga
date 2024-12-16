CREATE TABLE `user` (
  `id` bigint PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `firstname` varchar(100) NOT NULL,
  `lastname` varchar(100) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created` timestamp,
  `remember_token` bool,
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

CREATE TABLE `sales` (
  `saler_id` bigint NOT NULL,
  `buyer_id` bigint NOT NULL,
  `product_id` bigint NOT NULL,
  PRIMARY KEY (`saler_id`, `buyer_id`)
);

CREATE TABLE `admins` (
  `id` int PRIMARY KEY NOT NULL,
  `email` varchar(255) NOT NULL,
  `username` varchar(255) NOT NULL
);

ALTER TABLE `user` ADD FOREIGN KEY (`postcode`) REFERENCES `city` (`postcode_id`);

ALTER TABLE `city` ADD FOREIGN KEY (`county_id`) REFERENCES `counties` (`id`);

ALTER TABLE `user` ADD FOREIGN KEY (`id`) REFERENCES `sales` (`saler_id`);

ALTER TABLE `user` ADD FOREIGN KEY (`id`) REFERENCES `sales` (`buyer_id`);
