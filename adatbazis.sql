CREATE TABLE `user` (
  `id` bigint PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `firstname` varchar(100) NOT NULL,
  `lastname` varchar(100) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created` timestamp,
  `phone_number` varchar(255) NOT NULL,
  `postcode` int NOT NULL,
  `image` varchar(255)
);

CREATE TABLE `city` (
  `id` int PRIMARY KEY NOT NULL,
  `postcode` varchar(255) NOT NULL,
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
  `db` int NOT NULL,
  PRIMARY KEY (`saler_id`, `buyer_id`)
);

CREATE TABLE `admins` (
  `id` int PRIMARY KEY NOT NULL,
  `email` varchar(255) NOT NULL,
  `username` varchar(255) NOT NULL
);

CREATE TABLE `products` (
  `id` int PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `category_id` int NOT NULL,
  `brand_id` int NOT NULL,
  `price` int NOT NULL,
  `description` varchar(255) NOT NULL,
  `image_id` varchar(255) NOT NULL,
  `uploaded_at` datetime NOT NULL,
  `db` int NOT NULL
);

CREATE TABLE `brand` (
  `id` int PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `brand_name` varchar(255) NOT NULL
);

CREATE TABLE `category` (
  `id` int PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `category_name` varchar(255) NOT NULL
);

CREATE TABLE `image` (
  `id` int PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `img_url` varchar(255) NOT NULL
);

CREATE TABLE `auction` (
  `id` int PRIMARY KEY NOT NULL,
  `user_id` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `price` int NOT NULL,
  `stair` int NOT NULL,
  `image_id` int NOT NULL,
  `uploaded_at` int NOT NULL,
  `auction_start` datetime NOT NULL,
  `auction_end` datetime NOT NULL
);

ALTER TABLE `user` ADD FOREIGN KEY (`postcode`) REFERENCES `city` (`id`);

ALTER TABLE `city` ADD FOREIGN KEY (`county_id`) REFERENCES `counties` (`id`);

ALTER TABLE `sales` ADD FOREIGN KEY (`saler_id`) REFERENCES `user` (`id`);

ALTER TABLE `sales` ADD FOREIGN KEY (`buyer_id`) REFERENCES `user` (`id`);

ALTER TABLE `products` ADD FOREIGN KEY (`user_id`) REFERENCES `user` (`id`);

ALTER TABLE `category` ADD FOREIGN KEY (`id`) REFERENCES `products` (`category_id`);

ALTER TABLE `brand` ADD FOREIGN KEY (`id`) REFERENCES `products` (`brand_id`);

ALTER TABLE `sales` ADD FOREIGN KEY (`product_id`) REFERENCES `products` (`id`);

ALTER TABLE `image` ADD FOREIGN KEY (`id`) REFERENCES `products` (`image_id`);
