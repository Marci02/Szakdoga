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

CREATE TABLE `products` (
  `id` int PRIMARY KEY NOT NULL,
  `user_id` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `category_id` int NOT NULL,
  `brand_id` int NOT NULL,
  `price` int NOT NULL,
  `description` varchar(255) NOT NULL,
  `image` varchar(255) NOT NULL,
  `uploaded_at` datetime NOT NULL
);

CREATE TABLE `brand` (
  `id` int PRIMARY KEY NOT NULL,
  `brand_name` varchar(255) NOT NULL
);

CREATE TABLE `category` (
  `id` int PRIMARY KEY NOT NULL,
  `category_name` varchar(255) NOT NULL
);

ALTER TABLE `city` ADD FOREIGN KEY (`postcode_id`) REFERENCES `user` (`postcode`);

ALTER TABLE `city` ADD FOREIGN KEY (`county_id`) REFERENCES `counties` (`id`);

ALTER TABLE `sales` ADD FOREIGN KEY (`saler_id`) REFERENCES `user` (`id`);

ALTER TABLE `sales` ADD FOREIGN KEY (`buyer_id`) REFERENCES `user` (`id`);

ALTER TABLE `user` ADD FOREIGN KEY (`id`) REFERENCES `products` (`user_id`);

ALTER TABLE `products` ADD FOREIGN KEY (`category_id`) REFERENCES `category` (`id`);

ALTER TABLE `products` ADD FOREIGN KEY (`brand_id`) REFERENCES `brand` (`id`);

ALTER TABLE `sales` ADD FOREIGN KEY (`product_id`) REFERENCES `products` (`id`);
