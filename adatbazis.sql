CREATE TABLE `user` (
  `id` bigint NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `firstname` varchar(100) NOT NULL,
  `lastname` varchar(100) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created` timestamp DEFAULT CURRENT_TIMESTAMP,
  `phone_number` varchar(255) NOT NULL,
  `postcode` int NOT NULL,
  `image_id` int DEFAULT NULL
);

CREATE TABLE `city` (
  `id` int NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `postcode` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `county_id` int NOT NULL
);

CREATE TABLE `counties` (
  `id` int NOT NULL AUTO_INCREMENT PRIMARY KEY,
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
  `id` int NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `email` varchar(255) NOT NULL,
  `username` varchar(255) NOT NULL
);

CREATE TABLE `products` (
  `id` bigint NOT NULL AUTO_INCREMENT PRIMARY KEY,
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
  `id` int NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `brand_name` varchar(255) NOT NULL
);

CREATE TABLE `category` (
  `id` int NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `category_name` varchar(255) NOT NULL
);

CREATE TABLE `image` (
  `id` int NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `img_url` varchar(255) NOT NULL
);

CREATE TABLE `auction` (
  `id` int NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `user_id` bigint NOT NULL,
  `name` varchar(255) NOT NULL,
  `price` int NOT NULL,
  `stair` int NOT NULL,
  `image_id` int NOT NULL,
  `uploaded_at` datetime NOT NULL,
  `auction_start` datetime NOT NULL,
  `auction_end` datetime NOT NULL
);

ALTER TABLE `user` ADD FOREIGN KEY (`postcode`) REFERENCES `city` (`id`);
ALTER TABLE `user` ADD FOREIGN KEY (`image_id`) REFERENCES `image` (`id`);

ALTER TABLE `city` ADD FOREIGN KEY (`county_id`) REFERENCES `counties` (`id`);

ALTER TABLE `sales` ADD FOREIGN KEY (`saler_id`) REFERENCES `user` (`id`);
ALTER TABLE `sales` ADD FOREIGN KEY (`buyer_id`) REFERENCES `user` (`id`);
ALTER TABLE `sales` ADD FOREIGN KEY (`product_id`) REFERENCES `products` (`id`);

ALTER TABLE `products` ADD FOREIGN KEY (`user_id`) REFERENCES `user` (`id`);
ALTER TABLE `products` ADD FOREIGN KEY (`category_id`) REFERENCES `category` (`id`);
ALTER TABLE `products` ADD FOREIGN KEY (`brand_id`) REFERENCES `brand` (`id`);
ALTER TABLE `products` ADD FOREIGN KEY (`image_id`) REFERENCES `image` (`id`);

ALTER TABLE `auction` ADD FOREIGN KEY (`user_id`) REFERENCES `user` (`id`);
ALTER TABLE `auction` ADD FOREIGN KEY (`image_id`) REFERENCES `image` (`id`);