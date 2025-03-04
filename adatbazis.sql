CREATE TABLE `user` (
  `id` bigint PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `firstname` varchar(100) NOT NULL,
  `lastname` varchar(100) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created` timestamp DEFAULT (CURRENT_TIMESTAMP),
  `phone_number` varchar(255),
  `city_id` int,
  `image_url` varchar(255) DEFAULT null,
  `street` varchar(255) DEFAULT null,
  `address` varchar(255) DEFAULT null
);

CREATE TABLE `settlement` (
  `id` int PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `postcode` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `county_id` int NOT NULL
);

CREATE TABLE `counties` (
  `id` int PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL
);

CREATE TABLE `sales` (
  `saler_id` bigint NOT NULL,
  `buyer_id` bigint NOT NULL,
  `product_id` bigint NOT NULL,
  `db` int NOT NULL,
  PRIMARY KEY (`saler_id`, `buyer_id`, `product_id`)
);

CREATE TABLE `admins` (
  `id` int PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `username` varchar(255) NOT NULL
);

CREATE TABLE `products` (
  `id` bigint PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `user_id` bigint NOT NULL,
  `name` varchar(255) NOT NULL,
  `category_id` int NOT NULL,
  `brand_id` int NOT NULL,
  `price` int NOT NULL,
  `description` varchar(255) NOT NULL,
  `image_id` int NOT NULL,
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
  `id` int PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `user_id` bigint NOT NULL,
  `name` varchar(255) NOT NULL,
  `price` int NOT NULL,
  `stair` int NOT NULL,
  `image_id` int NOT NULL,
  `uploaded_at` datetime NOT NULL,
  `auction_start` datetime NOT NULL,
  `auction_end` datetime NOT NULL
);

ALTER TABLE `user` ADD FOREIGN KEY (`city_id`) REFERENCES `settlement` (`id`);

ALTER TABLE `settlement` ADD FOREIGN KEY (`county_id`) REFERENCES `counties` (`id`);

ALTER TABLE `sales` ADD FOREIGN KEY (`saler_id`) REFERENCES `user` (`id`);

ALTER TABLE `sales` ADD FOREIGN KEY (`buyer_id`) REFERENCES `user` (`id`);

ALTER TABLE `sales` ADD FOREIGN KEY (`product_id`) REFERENCES `products` (`id`);

ALTER TABLE `products` ADD FOREIGN KEY (`user_id`) REFERENCES `user` (`id`);

ALTER TABLE `products` ADD FOREIGN KEY (`category_id`) REFERENCES `category` (`id`);

ALTER TABLE `products` ADD FOREIGN KEY (`brand_id`) REFERENCES `brand` (`id`);

ALTER TABLE `products` ADD FOREIGN KEY (`image_id`) REFERENCES `image` (`id`);

ALTER TABLE `auction` ADD FOREIGN KEY (`user_id`) REFERENCES `user` (`id`);

ALTER TABLE `auction` ADD FOREIGN KEY (`image_id`) REFERENCES `image` (`id`);
