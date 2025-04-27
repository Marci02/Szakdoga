-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Gép: 127.0.0.1
-- Létrehozás ideje: 2025. Ápr 27. 21:07
-- Kiszolgáló verziója: 10.4.32-MariaDB
-- PHP verzió: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Adatbázis: `tesztadat`
--

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `auction`
--

CREATE TABLE `auction` (
  `id` bigint(20) NOT NULL,
  `user_id` bigint(20) NOT NULL,
  `name` varchar(255) NOT NULL,
  `price` int(11) NOT NULL,
  `stair` int(11) NOT NULL,
  `image_id` int(11) NOT NULL,
  `uploaded_at` datetime NOT NULL,
  `auction_start` datetime NOT NULL,
  `auction_end` datetime NOT NULL,
  `category_id` int(11) NOT NULL,
  `brand_id` int(11) NOT NULL,
  `size` varchar(255) NOT NULL,
  `description` varchar(255) NOT NULL,
  `condition` varchar(255) NOT NULL,
  `ho` int(11) NOT NULL,
  `ho_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

--
-- A tábla adatainak kiíratása `auction`
--

INSERT INTO `auction` (`id`, `user_id`, `name`, `price`, `stair`, `image_id`, `uploaded_at`, `auction_start`, `auction_end`, `category_id`, `brand_id`, `size`, `description`, `condition`, `ho`, `ho_id`) VALUES
(1, 1, 'Nike Air Jordan 1', 120000, 1500, 1, '2025-04-27 18:36:13', '2025-04-27 18:36:13', '2025-04-27 00:36:00', 2, 1, '43', 'Nagyon jó állapotba lévő sneaker', 'Újszerű', 120000, 1),
(2, 1, 'Nike Air Jordan 1', 120000, 1500, 2, '2025-04-27 18:37:39', '2025-04-27 18:37:39', '2025-08-01 18:37:00', 2, 1, '43', 'Nagyon szép állapotba lévő sneaker', 'Újszerű', 123000, 3),
(3, 1, 'Nike Air Jordan 4', 45000, 1000, 3, '2025-04-27 18:38:51', '2025-04-27 18:38:51', '2025-08-01 18:38:00', 2, 1, '43', 'Elégé használt', 'Nagyon használt', 48000, 3),
(4, 1, 'Zara farmer nadrág', 7000, 300, 4, '2025-04-27 18:40:43', '2025-04-27 18:40:43', '2025-08-01 18:40:00', 1, 12, 'M', 'Teljesen új, címkével', 'Új', 7900, 3),
(5, 1, 'Bape pulcsi', 80000, 1200, 5, '2025-04-27 18:46:01', '2025-04-27 18:46:01', '2025-08-01 18:45:00', 1, 6, 'XL', 'Egyszer se volt rajtam', 'Új', 83600, 3),
(6, 1, 'Nike papucs', 8000, 200, 6, '2025-04-27 18:47:40', '2025-04-27 18:47:40', '2025-08-01 18:47:00', 2, 1, '40', 'Teljesen új', 'Új', 8600, 3),
(7, 1, 'Supreme kabát', 40000, 500, 7, '2025-04-27 18:49:35', '2025-04-27 18:49:35', '2025-08-01 18:49:00', 1, 8, 'M', 'Tavaly egész télen hordtam, de semmi nagyobb baja nincsen', 'Használt', 41000, 3),
(8, 1, 'Nike Air Force 1', 40000, 50, 8, '2025-04-27 18:52:28', '2025-04-27 18:52:28', '2025-08-01 18:52:00', 2, 1, '44', 'Most vettem nem rég nikeból de sajna rossz lett a méret', 'Új', 40150, 3),
(9, 1, 'Balenciaga pulcsi', 10000, 1000, 9, '2025-04-27 18:54:19', '2025-04-27 18:54:19', '2025-08-01 18:54:00', 1, 4, 'L', 'Szét van hordva', 'Nagyon használt', 17000, 2),
(10, 1, 'Palace pulcsi', 40000, 2000, 10, '2025-04-27 18:55:45', '2025-04-27 18:55:45', '2025-07-01 18:55:00', 1, 7, 'XXL', 'Nagyon szép állapotba van ahoz képest hogy sokszor volt rajtam, vigyáztam rá', 'Újszerű', 84000, 2);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `brand`
--

CREATE TABLE `brand` (
  `id` int(11) NOT NULL,
  `brand_name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

--
-- A tábla adatainak kiíratása `brand`
--

INSERT INTO `brand` (`id`, `brand_name`) VALUES
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
(12, 'Zara'),
(13, 'North Face'),
(14, 'Calvin Klein'),
(15, 'Levi\'s'),
(16, 'asdasd');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `category`
--

CREATE TABLE `category` (
  `id` int(11) NOT NULL,
  `category_name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

--
-- A tábla adatainak kiíratása `category`
--

INSERT INTO `category` (`id`, `category_name`) VALUES
(1, 'Ruhák'),
(2, 'Cipő'),
(3, 'Kiegészítők'),
(4, 'cipők');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `counties`
--

CREATE TABLE `counties` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `image`
--

CREATE TABLE `image` (
  `id` int(11) NOT NULL,
  `img_url` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

--
-- A tábla adatainak kiíratása `image`
--

INSERT INTO `image` (`id`, `img_url`) VALUES
(1, '1745771773_jordan12.jpg'),
(2, '1745771859_jordan12.jpg'),
(3, '1745771931_jordan4.jpg'),
(4, '1745772043_Zaranadrág.jpg'),
(5, '1745772361_Bape.jpg'),
(6, '1745772460_letöltés.jpg'),
(7, '1745772575_supreme.jpg'),
(8, '1745772748_AirForce.jpg'),
(9, '1745772859_balenciaga.jpg'),
(10, '1745772945_Palace.jpg'),
(11, 'product_680e62ae0de90.jpg'),
(12, '1745779108_Palace.jpg'),
(13, 'product_680e316fc4c9f.jpg'),
(14, 'product_680e318ea89db.jpg'),
(15, 'product_680e31aa300bf.jpg'),
(16, 'product_680e31d15e5a7.jpg'),
(17, 'product_680e31fdbad55.jpg'),
(18, 'product_680e322357498.jpg'),
(19, 'product_680e324fbd0be.jpg'),
(20, 'product_680e3288dc0e6.jpg'),
(21, 'product_680e32ac3013f.jpg');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `products`
--

CREATE TABLE `products` (
  `id` bigint(20) NOT NULL,
  `user_id` bigint(20) NOT NULL,
  `name` varchar(255) NOT NULL,
  `category_id` int(11) NOT NULL,
  `brand_id` int(11) NOT NULL,
  `price` int(11) NOT NULL,
  `description` varchar(255) NOT NULL,
  `image_id` int(11) NOT NULL,
  `uploaded_at` datetime NOT NULL,
  `quantity` int(11) NOT NULL,
  `size` varchar(255) NOT NULL,
  `condition` varchar(255) NOT NULL,
  `isSold` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

--
-- A tábla adatainak kiíratása `products`
--

INSERT INTO `products` (`id`, `user_id`, `name`, `category_id`, `brand_id`, `price`, `description`, `image_id`, `uploaded_at`, `quantity`, `size`, `condition`, `isSold`) VALUES
(1, 1, 'Adidas UltraBoost', 4, 2, 312412, 'asdasd asd as dasd das d', 1, '2025-04-27 14:28:36', 1, '44', 'Újszerű', 1),
(2, 1, 'Nike Air force 1', 4, 1, 132, 'asdasd as das', 2, '2025-04-27 14:55:53', 1, '44', 'Újszerű', 1),
(3, 2, 'Nike Air force 1', 4, 1, 45000, 'Eladó egy szép állapotú Nike air Force 1.', 13, '2025-04-27 15:30:23', 1, '43', 'Újszerű', 0),
(4, 2, 'Adidas UltraBoost', 4, 2, 54350, 'Eladó bontatlan adidas UltraBoost!', 14, '2025-04-27 15:30:54', 1, '40', 'Új', 0),
(5, 2, 'North Face póló', 1, 13, 12000, 'Eladó North Face poló M-es méretben!', 15, '2025-04-27 15:31:22', 1, 'M', 'Újszerű', 0),
(6, 2, 'Nike Air Jordan 1', 4, 1, 65500, 'Eladó Nike Air Jordan 1! 44-es minden tartozékkal', 16, '2025-04-27 15:32:01', 1, '44', 'Új', 0),
(7, 2, 'Calvin Klein alsónemű', 3, 14, 16000, '4 darab Clavin Klein alsónemű eladó', 17, '2025-04-27 15:32:45', 1, '', 'Új', 0),
(8, 2, 'Levi\'s skinny jeans eladó', 1, 15, 4000, 'Levi\'s Skinny Jeans eladó. Kicsit kopott azért ennyi az ára', 18, '2025-04-27 15:33:23', 1, 'L', 'Nagyon használt', 0),
(9, 2, 'Gucci öv', 3, 5, 97000, 'Gucci öv eladó. Pár napot volt hordtam. Dobozzal együtt eladó', 19, '2025-04-27 15:34:07', 1, '', 'Újszerű', 0),
(10, 2, 'Yeezy Slide', 4, 2, 25990, 'Nyár indító Akció! Yeezy Slide olcsón', 20, '2025-04-27 15:35:04', 1, '43', 'Újszerű', 0),
(11, 2, 'Nike zoknik eladók', 3, 1, 14590, '6 pár nike zokni eladó bontatlan csomagolás', 21, '2025-04-27 15:35:40', 1, '', 'Új', 0);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `sales`
--

CREATE TABLE `sales` (
  `saler_id` bigint(20) NOT NULL,
  `buyer_id` bigint(20) NOT NULL,
  `product_id` bigint(20) DEFAULT NULL,
  `auction_id` bigint(20) DEFAULT NULL,
  `quantity` int(11) NOT NULL,
  `sold_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `settlement`
--

CREATE TABLE `settlement` (
  `id` int(11) NOT NULL,
  `postcode` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `county_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `user`
--

CREATE TABLE `user` (
  `id` bigint(20) NOT NULL,
  `firstname` varchar(100) NOT NULL,
  `lastname` varchar(100) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created` timestamp NOT NULL DEFAULT current_timestamp(),
  `phone_number` varchar(255) DEFAULT NULL,
  `city_id` int(11) DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `street` varchar(255) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

--
-- A tábla adatainak kiíratása `user`
--

INSERT INTO `user` (`id`, `firstname`, `lastname`, `email`, `password`, `created`, `phone_number`, `city_id`, `image_url`, `street`, `address`) VALUES
(1, 'Konderla', 'mama', 'samuelkonderla@gmail.com', '$2y$10$VdGuftEQABYaitAwbRUWeekymHNtwNxcb35POYmS2dsb6SoHyWHfe', '2025-04-27 16:34:22', NULL, NULL, NULL, NULL, NULL),
(2, 'ido', 'bab', 'samuelkonderla1@gmail.com', '$2y$10$ZfZCSYnGRac1.MCjayT1RejFb67gVUbUvamILjoYRzxkM6S48B7U6', '2025-04-27 17:07:12', NULL, NULL, NULL, NULL, NULL),
(3, 'lala', 'kaka', 'samuelkonderla2@gmail.com', '$2y$10$UUwpK0IChRbRtnyxLAVEpeBwHzYMqSFjr9R5.Hi6K3wmeeHL.BJ1S', '2025-04-27 17:33:15', NULL, NULL, NULL, NULL, NULL);

--
-- Indexek a kiírt táblákhoz
--

--
-- A tábla indexei `auction`
--
ALTER TABLE `auction`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_auction_ho_id_user_id` (`ho_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `image_id` (`image_id`),
  ADD KEY `category_id` (`category_id`),
  ADD KEY `brand_id` (`brand_id`);

--
-- A tábla indexei `brand`
--
ALTER TABLE `brand`
  ADD PRIMARY KEY (`id`);

--
-- A tábla indexei `category`
--
ALTER TABLE `category`
  ADD PRIMARY KEY (`id`);

--
-- A tábla indexei `counties`
--
ALTER TABLE `counties`
  ADD PRIMARY KEY (`id`);

--
-- A tábla indexei `image`
--
ALTER TABLE `image`
  ADD PRIMARY KEY (`id`);

--
-- A tábla indexei `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `category_id` (`category_id`),
  ADD KEY `brand_id` (`brand_id`),
  ADD KEY `image_id` (`image_id`);

--
-- A tábla indexei `sales`
--
ALTER TABLE `sales`
  ADD KEY `fk_sales_auction_id` (`auction_id`),
  ADD KEY `saler_id` (`saler_id`),
  ADD KEY `buyer_id` (`buyer_id`),
  ADD KEY `product_id` (`product_id`);

--
-- A tábla indexei `settlement`
--
ALTER TABLE `settlement`
  ADD PRIMARY KEY (`id`),
  ADD KEY `county_id` (`county_id`);

--
-- A tábla indexei `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`),
  ADD KEY `city_id` (`city_id`);

--
-- A kiírt táblák AUTO_INCREMENT értéke
--

--
-- AUTO_INCREMENT a táblához `auction`
--
ALTER TABLE `auction`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT a táblához `brand`
--
ALTER TABLE `brand`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT a táblához `category`
--
ALTER TABLE `category`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT a táblához `counties`
--
ALTER TABLE `counties`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT a táblához `image`
--
ALTER TABLE `image`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT a táblához `products`
--
ALTER TABLE `products`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT a táblához `settlement`
--
ALTER TABLE `settlement`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT a táblához `user`
--
ALTER TABLE `user`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Megkötések a kiírt táblákhoz
--

--
-- Megkötések a táblához `auction`
--
ALTER TABLE `auction`
  ADD CONSTRAINT `auction_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`),
  ADD CONSTRAINT `auction_ibfk_2` FOREIGN KEY (`image_id`) REFERENCES `image` (`id`),
  ADD CONSTRAINT `auction_ibfk_3` FOREIGN KEY (`category_id`) REFERENCES `category` (`id`),
  ADD CONSTRAINT `auction_ibfk_4` FOREIGN KEY (`brand_id`) REFERENCES `brand` (`id`),
  ADD CONSTRAINT `fk_auction_ho_id_user_id` FOREIGN KEY (`ho_id`) REFERENCES `user` (`id`);

--
-- Megkötések a táblához `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `products_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`),
  ADD CONSTRAINT `products_ibfk_2` FOREIGN KEY (`category_id`) REFERENCES `category` (`id`),
  ADD CONSTRAINT `products_ibfk_3` FOREIGN KEY (`brand_id`) REFERENCES `brand` (`id`),
  ADD CONSTRAINT `products_ibfk_4` FOREIGN KEY (`image_id`) REFERENCES `image` (`id`);

--
-- Megkötések a táblához `sales`
--
ALTER TABLE `sales`
  ADD CONSTRAINT `fk_sales_auction_id` FOREIGN KEY (`auction_id`) REFERENCES `auction` (`id`),
  ADD CONSTRAINT `sales_ibfk_1` FOREIGN KEY (`saler_id`) REFERENCES `user` (`id`),
  ADD CONSTRAINT `sales_ibfk_2` FOREIGN KEY (`buyer_id`) REFERENCES `user` (`id`),
  ADD CONSTRAINT `sales_ibfk_3` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`);

--
-- Megkötések a táblához `settlement`
--
ALTER TABLE `settlement`
  ADD CONSTRAINT `settlement_ibfk_1` FOREIGN KEY (`county_id`) REFERENCES `counties` (`id`);

--
-- Megkötések a táblához `user`
--
ALTER TABLE `user`
  ADD CONSTRAINT `user_ibfk_1` FOREIGN KEY (`city_id`) REFERENCES `settlement` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
