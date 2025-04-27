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
  `product_id` bigint NULL,
  `auction_id` bigint NULL,
  `quantity` int NOT NULL,
  `sold_at` datetime NOT NULL
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
  `quantity` int NOT NULL,
  `size` varchar(255) NOT NULL,
  `condition` varchar(255) NOT NULL,
  `isSold` tinyint(1) NOT NULL
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
  `id` bigint PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `user_id` bigint NOT NULL,
  `name` varchar(255) NOT NULL,
  `price` int NOT NULL,
  `stair` int NOT NULL,
  `image_id` int NOT NULL,
  `uploaded_at` datetime NOT NULL,
  `auction_start` datetime NOT NULL,
  `auction_end` datetime NOT NULL,
  `category_id` int NOT NULL,
  `brand_id` int NOT NULL,
  `size` varchar(255) NOT NULL,
  `description` varchar(255) NOT NULL,
  `condition` varchar(255) NOT NULL,
  `ho` int NOT NULL,
  `ho_id` bigint NOT NULL
);

ALTER TABLE `auction` 
ADD CONSTRAINT `fk_auction_ho_id_user_id`
FOREIGN KEY (`ho_id`) REFERENCES `user` (`id`);

ALTER TABLE `sales`
ADD CONSTRAINT `fk_sales_auction_id`
FOREIGN KEY (`auction_id`) REFERENCES `auction` (`id`);

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

ALTER TABLE `auction` ADD FOREIGN KEY (`category_id`) REFERENCES `category` (`id`);

ALTER TABLE `auction` ADD FOREIGN KEY (`brand_id`) REFERENCES `brand` (`id`);

INSERT INTO category (id, category_name) VALUES
(1, 'Ruhák'),
(2, 'Cipő'),
(3, 'Kiegészítők');

INSERT INTO brand (id, brand_name) VALUES
(1, 'Nike'),
(2, 'Adidas'),
(3, 'New Balance'),
(4, 'Balenciaga'),
(5, 'Gucci'),
(6, 'Bape'),
(7, 'Palace'),
(8, 'Supreme'),
(9, 'Louis Vuitton'),
(10, 'Dior'),
(11, 'Ralph Lauren'),
(12, 'Zara');

