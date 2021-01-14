-- phpMyAdmin SQL Dump
-- version 4.9.5deb2
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Jan 05, 2021 at 09:49 AM
-- Server version: 8.0.22-0ubuntu0.20.04.3
-- PHP Version: 7.4.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `boldo`
--

-- --------------------------------------------------------

--
-- Table structure for table `chat_rooms`
--

CREATE TABLE `chat_rooms` (
  `id` bigint UNSIGNED NOT NULL,
  `pending_id` int DEFAULT NULL,
  `room` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `state1` int DEFAULT NULL,
  `state2` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `chat_rooms`
--

INSERT INTO `chat_rooms` (`id`, `pending_id`, `room`, `state1`, `state2`, `created_at`, `updated_at`) VALUES
(1, 1, 'room1609834530', 1, 1, '2021-01-05 08:15:30', '2021-01-05 08:15:30'),
(2, 2, 'room1609840080', 1, 1, '2021-01-05 09:48:00', '2021-01-05 09:48:00'),
(3, 3, 'room1609840137', 1, 1, '2021-01-05 09:48:57', '2021-01-05 09:48:57');

-- --------------------------------------------------------

--
-- Table structure for table `cooking_styles`
--

CREATE TABLE `cooking_styles` (
  `id` bigint UNSIGNED NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sort` int DEFAULT NULL,
  `etc` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `cooking_styles`
--

INSERT INTO `cooking_styles` (`id`, `name`, `description`, `sort`, `etc`, `created_at`, `updated_at`) VALUES
(1, 'American', NULL, 0, NULL, '2021-01-05 07:06:30', '2021-01-05 07:06:30'),
(2, 'Asian Fusion', NULL, 2, NULL, '2021-01-05 07:06:30', '2021-01-05 07:06:30'),
(3, 'Cajun', NULL, 3, NULL, '2021-01-05 07:06:30', '2021-01-05 07:06:30'),
(4, 'Canadian', NULL, 4, NULL, '2021-01-05 07:06:30', '2021-01-05 07:06:30'),
(5, 'Carribean', NULL, 5, NULL, '2021-01-05 07:06:30', '2021-01-05 07:06:30'),
(6, 'Chinese', NULL, 6, NULL, '2021-01-05 07:06:30', '2021-01-05 07:06:30'),
(7, 'European', NULL, 7, NULL, '2021-01-05 07:06:30', '2021-01-05 07:06:30'),
(8, 'Filipino', NULL, 8, NULL, '2021-01-05 07:06:30', '2021-01-05 07:06:30'),
(9, 'French', NULL, 9, NULL, '2021-01-05 07:06:30', '2021-01-05 07:06:30'),
(10, 'Fusion', NULL, 10, NULL, '2021-01-05 07:06:30', '2021-01-05 07:06:30'),
(11, 'Greek', NULL, 11, NULL, '2021-01-05 07:06:30', '2021-01-05 07:06:30'),
(12, 'Hungarian', NULL, 12, NULL, '2021-01-05 07:06:30', '2021-01-05 07:06:30'),
(13, 'Indian', NULL, 13, NULL, '2021-01-05 07:06:30', '2021-01-05 07:06:30'),
(14, 'Italian', NULL, 14, NULL, '2021-01-05 07:06:30', '2021-01-05 07:06:30'),
(15, 'Jamaican', NULL, 15, NULL, '2021-01-05 07:06:30', '2021-01-05 07:06:30'),
(16, 'Japanese', NULL, 16, NULL, '2021-01-05 07:06:30', '2021-01-05 07:06:30'),
(17, 'Jewish', NULL, 17, NULL, '2021-01-05 07:06:30', '2021-01-05 07:06:30'),
(18, 'Korean', NULL, 18, NULL, '2021-01-05 07:06:30', '2021-01-05 07:06:30'),
(19, 'Mediterranean', NULL, 19, NULL, '2021-01-05 07:06:30', '2021-01-05 07:06:30'),
(20, 'Mexican', NULL, 20, NULL, '2021-01-05 07:06:30', '2021-01-05 07:06:30'),
(21, 'Middle Eastern', NULL, 21, NULL, '2021-01-05 07:06:30', '2021-01-05 07:06:30'),
(22, 'Modern', NULL, 22, NULL, '2021-01-05 07:06:30', '2021-01-05 07:06:30'),
(23, 'Russian', NULL, 23, NULL, '2021-01-05 07:06:30', '2021-01-05 07:06:30'),
(24, 'Spanish', NULL, 24, NULL, '2021-01-05 07:06:30', '2021-01-05 07:06:30'),
(25, 'Swedish', NULL, 25, NULL, '2021-01-05 07:06:30', '2021-01-05 07:06:30'),
(26, 'Thai', NULL, 26, NULL, '2021-01-05 07:06:30', '2021-01-05 07:06:30'),
(27, 'Turkish', NULL, 27, NULL, '2021-01-05 07:06:30', '2021-01-05 07:06:30'),
(28, 'Vegan', NULL, 28, NULL, '2021-01-05 07:06:30', '2021-01-05 07:06:30'),
(29, 'Vegetarian', NULL, 29, NULL, '2021-01-05 07:06:30', '2021-01-05 07:06:30'),
(30, 'Vietnamese', NULL, 30, NULL, '2021-01-05 07:06:30', '2021-01-05 07:06:30'),
(31, 'Other', NULL, 31, NULL, '2021-01-05 07:06:30', '2021-01-05 07:06:30'),
(32, 'All', NULL, 32, NULL, '2021-01-05 07:06:30', '2021-01-05 07:06:30');

-- --------------------------------------------------------

--
-- Table structure for table `failed_jobs`
--

CREATE TABLE `failed_jobs` (
  `id` bigint UNSIGNED NOT NULL,
  `uuid` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `connection` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `queue` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `exception` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `histories`
--

CREATE TABLE `histories` (
  `id` bigint UNSIGNED NOT NULL,
  `user_id` int DEFAULT NULL,
  `company` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `years` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `conent` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `etc` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `histories`
--

INSERT INTO `histories` (`id`, `user_id`, `company`, `title`, `years`, `conent`, `etc`, `created_at`, `updated_at`) VALUES
(1, 2, 'c', 't', 'y', NULL, NULL, '2021-01-05 07:13:50', '2021-01-05 07:13:50'),
(2, 4, 'c', 't', 'y', NULL, NULL, '2021-01-05 07:19:19', '2021-01-05 07:19:19'),
(3, 5, 'c', 't', 'y', NULL, NULL, '2021-01-05 07:27:47', '2021-01-05 07:27:47'),
(4, 7, 'c', 't', 'y', NULL, NULL, '2021-01-05 07:31:01', '2021-01-05 07:31:01'),
(5, 8, 'c', 't', 'y', NULL, NULL, '2021-01-05 07:32:36', '2021-01-05 07:32:36'),
(6, 9, 'c', 't', 'y', NULL, NULL, '2021-01-05 07:34:14', '2021-01-05 07:34:14');

-- --------------------------------------------------------

--
-- Table structure for table `migrations`
--

CREATE TABLE `migrations` (
  `id` int UNSIGNED NOT NULL,
  `migration` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `batch` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '2014_10_12_000000_create_users_table', 1),
(2, '2014_10_12_100000_create_password_resets_table', 1),
(3, '2016_06_01_000001_create_oauth_auth_codes_table', 1),
(4, '2016_06_01_000002_create_oauth_access_tokens_table', 1),
(5, '2016_06_01_000003_create_oauth_refresh_tokens_table', 1),
(6, '2016_06_01_000004_create_oauth_clients_table', 1),
(7, '2016_06_01_000005_create_oauth_personal_access_clients_table', 1),
(8, '2019_08_19_000000_create_failed_jobs_table', 1),
(9, '2020_11_10_210844_create_posts_table', 1),
(10, '2020_11_12_214433_create_pendings_table', 1),
(11, '2020_11_16_043159_create_recipes_table', 1),
(12, '2020_11_17_202300_create_chat_rooms_table', 1),
(13, '2020_12_09_062658_create_histories_table', 1),
(14, '2020_12_09_090632_create_reviews_table', 1),
(15, '2020_12_11_030750_create_reports_table', 1),
(16, '2020_12_25_134926_create_types_table', 1),
(17, '2020_12_26_013359_create_cooking_styles_table', 1);

-- --------------------------------------------------------

--
-- Table structure for table `oauth_access_tokens`
--

CREATE TABLE `oauth_access_tokens` (
  `id` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` bigint UNSIGNED DEFAULT NULL,
  `client_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `scopes` text COLLATE utf8mb4_unicode_ci,
  `revoked` tinyint(1) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `expires_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `oauth_access_tokens`
--

INSERT INTO `oauth_access_tokens` (`id`, `user_id`, `client_id`, `name`, `scopes`, `revoked`, `created_at`, `updated_at`, `expires_at`) VALUES
('02781cc1ed2af593dd7e79642b605289e912dcdfcb4f06577818dd705edc4bbf8b0743d52257bd69', 12, '9269c8f3-af7a-4cc3-992d-c39f0f8412cc', '12', '[]', 0, '2021-01-05 09:48:47', '2021-01-05 09:48:47', '2022-01-05 09:48:47'),
('1b4281adc34d7c882e9871f8957dce5a073d5716c67ead30c9e3ed2b77bd893905a2e01f96a30195', 13, '9269c8f3-af7a-4cc3-992d-c39f0f8412cc', '13', '[]', 0, '2021-01-05 09:47:54', '2021-01-05 09:47:54', '2022-01-05 09:47:54'),
('23304e29e1105d283569773923af6226a8625f7b9de99b0ba9346a8ed6f6c27ab171fa6e8de87243', 2, '9269c8f3-af7a-4cc3-992d-c39f0f8412cc', '2', '[]', 0, '2021-01-05 09:49:33', '2021-01-05 09:49:33', '2022-01-05 09:49:33'),
('2aa27b748ad73c03b620ffebc2c8e6b3d1998d912d51d747f36cbff5c0b4dc6c7101f17488533617', 2, '9269c8f3-af7a-4cc3-992d-c39f0f8412cc', '2', '[]', 0, '2021-01-05 09:46:30', '2021-01-05 09:46:30', '2022-01-05 09:46:30'),
('2c78b28363fc4cf4345dd001cd6de42e1ef4f9f14e3836fa0b24e9e4084ba482b3551f3dc44033bc', 3, '9269c8f3-af7a-4cc3-992d-c39f0f8412cc', '3', '[]', 0, '2021-01-05 09:40:11', '2021-01-05 09:40:11', '2022-01-05 09:40:11'),
('3888c64e110e5132a13ddee20c8d7530d948d3f2372581e03f67a0551a880c68ef640045dfe51d53', 3, '9269c8f3-af7a-4cc3-992d-c39f0f8412cc', '3', '[]', 0, '2021-01-05 09:40:29', '2021-01-05 09:40:29', '2022-01-05 09:40:29'),
('4111a2c38cc6ee0c4372693c7fc450789d119f51544aa7eb30fa578515f893858f85f4d014872fed', 3, '9269c8f3-af7a-4cc3-992d-c39f0f8412cc', '3', '[]', 0, '2021-01-05 08:12:31', '2021-01-05 08:12:31', '2022-01-05 08:12:31'),
('429b626feec2d16871665614aab10ecb6fd2fe5820d190ee7c2619b91235c9b6e4b873bc9ccd1b1e', 2, '9269c8f3-af7a-4cc3-992d-c39f0f8412cc', '2', '[]', 0, '2021-01-05 08:34:17', '2021-01-05 08:34:17', '2022-01-05 08:34:17'),
('444a7e17f8eb7a73512442b416bf1301efb5567188de84660169f77f0033e191d881176daea64e50', 3, '9269c8f3-af7a-4cc3-992d-c39f0f8412cc', '3', '[]', 0, '2021-01-05 07:47:09', '2021-01-05 07:47:09', '2022-01-05 07:47:09'),
('4a84a62ded48938129ec6e9d98ac89e975060ef023f1e3b7b71fa2d9e3f85d6a058f47412896cfa7', 2, '9269c8f3-af7a-4cc3-992d-c39f0f8412cc', '2', '[]', 0, '2021-01-05 07:44:34', '2021-01-05 07:44:34', '2022-01-05 07:44:34'),
('4fb3c826a45e2be814a702bbf97bad7dd6141abc4c67452f8e893d78ec5b3ae85a082a3ae5b440c2', 2, '9269c8f3-af7a-4cc3-992d-c39f0f8412cc', '2', '[]', 0, '2021-01-05 07:43:10', '2021-01-05 07:43:10', '2022-01-05 07:43:10'),
('5551bc954ca2791de79d4f7344fe377c3490a893728e580dd092bd435565f46b889403ef7cf3d7e4', 11, '9269c8f3-af7a-4cc3-992d-c39f0f8412cc', '11', '[]', 0, '2021-01-05 08:50:29', '2021-01-05 08:50:29', '2022-01-05 08:50:29'),
('5a53c3983895178cb4ce0fc597132755a11b0b19af491264bb5a774d02802d2181244d34c35a182e', 3, '9269c8f3-af7a-4cc3-992d-c39f0f8412cc', '3', '[]', 0, '2021-01-05 07:47:17', '2021-01-05 07:47:17', '2022-01-05 07:47:17'),
('5bca4a6c36f093248e30a709e127433660dfc393155ef3a3fcfe24e96ad61abbd9957332b26f0194', 11, '9269c8f3-af7a-4cc3-992d-c39f0f8412cc', '11', '[]', 0, '2021-01-05 08:36:46', '2021-01-05 08:36:46', '2022-01-05 08:36:46'),
('64d24b6d530e1716f90064955fd6b3e5cdbe0f91522eeb1a2814a058a92dde5b51ae18345e812ee8', 11, '9269c8f3-af7a-4cc3-992d-c39f0f8412cc', '11', '[]', 0, '2021-01-05 08:35:52', '2021-01-05 08:35:52', '2022-01-05 08:35:52'),
('6c748764c6a13b8e80ea6082b3dd7b5f85eb9f1cc16651011620622d6565e99cb5eb2b3bd44a83af', 12, '9269c8f3-af7a-4cc3-992d-c39f0f8412cc', '12', '[]', 0, '2021-01-05 09:49:04', '2021-01-05 09:49:04', '2022-01-05 09:49:04'),
('6fd4f9a9f7a470c7db9d91e51f7610bf397f96251c49935b0de0ca508f8f7ef3b325747916c537fc', 3, '9269c8f3-af7a-4cc3-992d-c39f0f8412cc', '3', '[]', 0, '2021-01-05 08:12:43', '2021-01-05 08:12:43', '2022-01-05 08:12:43'),
('77cd7d6d5a67e6511cd903329e8456c1a3dce207d07ceed5c9c596d7d9fd9cdbabc44f88e4d46b63', 11, '9269c8f3-af7a-4cc3-992d-c39f0f8412cc', '11', '[]', 0, '2021-01-05 08:36:00', '2021-01-05 08:36:00', '2022-01-05 08:36:00'),
('7a4d38d09a0a3e55b96f5a0ab1167ebf53503cbf0c9fca526dfdc67a1d8b9900f93eb0f2693c1e8f', 11, '9269c8f3-af7a-4cc3-992d-c39f0f8412cc', '11', '[]', 0, '2021-01-05 08:38:32', '2021-01-05 08:38:32', '2022-01-05 08:38:32'),
('811dbc38f2d922eb0e4d7cdeb8e2122d7fa227c95b07b132232f32dfa746c4b0ec162ad8d3cddee5', 12, '9269c8f3-af7a-4cc3-992d-c39f0f8412cc', '12', '[]', 0, '2021-01-05 09:48:46', '2021-01-05 09:48:46', '2022-01-05 09:48:46'),
('855b462db2c6b90c2fa70159cb5e781f3e64cbf7d7f1e7bc912d12238947ec24ba9e58213cfc20f9', 11, '9269c8f3-af7a-4cc3-992d-c39f0f8412cc', '11', '[]', 0, '2021-01-05 09:07:48', '2021-01-05 09:07:48', '2022-01-05 09:07:48'),
('8a671432240476d1fa43db13ef61884ccaa76a68ea2baf5068df2a2d26915ab2817a80b7bed19c55', 7, '9269c8f3-af7a-4cc3-992d-c39f0f8412cc', '7', '[]', 0, '2021-01-05 09:43:08', '2021-01-05 09:43:08', '2022-01-05 09:43:08'),
('99a17261797e54dd31583864ff00e74c8901540e5fe1aa218c302eb94410b1e3ec30ae7a403e4c29', 9, '9269c8f3-af7a-4cc3-992d-c39f0f8412cc', '9', '[]', 0, '2021-01-05 09:40:59', '2021-01-05 09:40:59', '2022-01-05 09:40:59'),
('a5fed7ba5d6ba0b6ad799a8332f371d24e6c67afe49923e174dd82448b1e3917f73574497b243617', 2, '9269c8f3-af7a-4cc3-992d-c39f0f8412cc', '2', '[]', 0, '2021-01-05 07:43:18', '2021-01-05 07:43:18', '2022-01-05 07:43:18'),
('d6a37d20d63ffd3fed967fdbf24639dca5aa07dbcac3b3c090c4ddf7e5317f4c7b5f0fd883b35e63', 9, '9269c8f3-af7a-4cc3-992d-c39f0f8412cc', '9', '[]', 0, '2021-01-05 09:41:06', '2021-01-05 09:41:06', '2022-01-05 09:41:06'),
('d85c7f8961d91cce5ca366c7f27872783241b16d0cd34496beff05747a0ac53fe1ec198c10bbc031', 13, '9269c8f3-af7a-4cc3-992d-c39f0f8412cc', '13', '[]', 0, '2021-01-05 09:47:46', '2021-01-05 09:47:46', '2022-01-05 09:47:46'),
('d97b36170de9dc3275c1c2cf8bce102fb248e57f7874a19f97ff4fc84ab2eb258d90cc9ec3c0d0bd', 12, '9269c8f3-af7a-4cc3-992d-c39f0f8412cc', '12', '[]', 0, '2021-01-05 09:48:53', '2021-01-05 09:48:53', '2022-01-05 09:48:53'),
('e28823d4e8c30b4fa3d34e7b07fba78c7bbe3401bd28b4fcc701816efb3f7c61d3f46a19bd90f0a6', 3, '9269c8f3-af7a-4cc3-992d-c39f0f8412cc', '3', '[]', 0, '2021-01-05 07:48:23', '2021-01-05 07:48:23', '2022-01-05 07:48:23'),
('eaa6860fb11448d813c5d4534fc281eb797a5953fc7030408d09250e38e33f3d57ef59420f6bcffa', 1, '9269c8f3-af7a-4cc3-992d-c39f0f8412cc', '1', '[]', 0, '2021-01-05 08:24:25', '2021-01-05 08:24:25', '2022-01-05 08:24:25'),
('eb046c12cb64779605bee9620a3d4b75be36844f19a548f6dfa41543ea1a73d0932cb5ee65917109', 7, '9269c8f3-af7a-4cc3-992d-c39f0f8412cc', '7', '[]', 0, '2021-01-05 09:43:15', '2021-01-05 09:43:15', '2022-01-05 09:43:15'),
('f2e7cabf7d9861404e38ad040583a8124218a10c5cbe57a22cc32475135b3fac563b40bba4a9b4fa', 2, '9269c8f3-af7a-4cc3-992d-c39f0f8412cc', '2', '[]', 0, '2021-01-05 09:46:36', '2021-01-05 09:46:36', '2022-01-05 09:46:36'),
('fc8e41367f33aeb718a4c17b6c7d8ba814f4a305b33f2d53e7c9021d8a6c422d8bc0ed1c792e82f7', 11, '9269c8f3-af7a-4cc3-992d-c39f0f8412cc', '11', '[]', 0, '2021-01-05 08:39:13', '2021-01-05 08:39:13', '2022-01-05 08:39:13'),
('fd4f8642e4044d61aeca2db8c2cb92efc7a49316a8e0e9ed12802dfbd7a0f2f21b9b524772998457', 11, '9269c8f3-af7a-4cc3-992d-c39f0f8412cc', '11', '[]', 0, '2021-01-05 09:06:15', '2021-01-05 09:06:15', '2022-01-05 09:06:15');

-- --------------------------------------------------------

--
-- Table structure for table `oauth_auth_codes`
--

CREATE TABLE `oauth_auth_codes` (
  `id` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` bigint UNSIGNED NOT NULL,
  `client_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `scopes` text COLLATE utf8mb4_unicode_ci,
  `revoked` tinyint(1) NOT NULL,
  `expires_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `oauth_clients`
--

CREATE TABLE `oauth_clients` (
  `id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` bigint UNSIGNED DEFAULT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `secret` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `provider` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `redirect` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `personal_access_client` tinyint(1) NOT NULL,
  `password_client` tinyint(1) NOT NULL,
  `revoked` tinyint(1) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `oauth_clients`
--

INSERT INTO `oauth_clients` (`id`, `user_id`, `name`, `secret`, `provider`, `redirect`, `personal_access_client`, `password_client`, `revoked`, `created_at`, `updated_at`) VALUES
('9269c8f3-af7a-4cc3-992d-c39f0f8412cc', NULL, 'Laravel Personal Access Client', 'Pfk3QWfpMndIoy25Qcj8BBK67yMIHLkHjqWghkLW', NULL, 'http://localhost', 1, 0, 0, '2021-01-05 07:06:46', '2021-01-05 07:06:46'),
('9269c8f3-b676-4d13-908b-240413c41031', NULL, 'Laravel Password Grant Client', 'xTCKSI0DOwM3dFtXNeeid5o0bpg63wV8Xz2LbAUW', 'users', 'http://localhost', 0, 1, 0, '2021-01-05 07:06:46', '2021-01-05 07:06:46');

-- --------------------------------------------------------

--
-- Table structure for table `oauth_personal_access_clients`
--

CREATE TABLE `oauth_personal_access_clients` (
  `id` bigint UNSIGNED NOT NULL,
  `client_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `oauth_personal_access_clients`
--

INSERT INTO `oauth_personal_access_clients` (`id`, `client_id`, `created_at`, `updated_at`) VALUES
(1, '9269c8f3-af7a-4cc3-992d-c39f0f8412cc', '2021-01-05 07:06:46', '2021-01-05 07:06:46');

-- --------------------------------------------------------

--
-- Table structure for table `oauth_refresh_tokens`
--

CREATE TABLE `oauth_refresh_tokens` (
  `id` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `access_token_id` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `revoked` tinyint(1) NOT NULL,
  `expires_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `password_resets`
--

CREATE TABLE `password_resets` (
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `pendings`
--

CREATE TABLE `pendings` (
  `id` bigint UNSIGNED NOT NULL,
  `user_id` int NOT NULL,
  `connect_id` int NOT NULL,
  `state` int NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `pendings`
--

INSERT INTO `pendings` (`id`, `user_id`, `connect_id`, `state`, `created_at`, `updated_at`) VALUES
(1, 3, 2, 1, '2021-01-05 08:15:30', '2021-01-05 08:15:30'),
(2, 13, 2, 1, '2021-01-05 09:48:00', '2021-01-05 09:48:00'),
(3, 12, 2, 1, '2021-01-05 09:48:57', '2021-01-05 09:48:57');

-- --------------------------------------------------------

--
-- Table structure for table `posts`
--

CREATE TABLE `posts` (
  `id` bigint UNSIGNED NOT NULL,
  `user_id` int NOT NULL,
  `photo` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `content` text COLLATE utf8mb4_unicode_ci,
  `count` int DEFAULT NULL,
  `review_id` int DEFAULT NULL,
  `share` text COLLATE utf8mb4_unicode_ci,
  `etc` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `posts`
--

INSERT INTO `posts` (`id`, `user_id`, `photo`, `title`, `content`, `count`, `review_id`, `share`, `etc`, `active`, `created_at`, `updated_at`) VALUES
(1, 2, 'http://54.163.177.131/uploads/post/post0.79397300 1609832718.jpeg', NULL, 'Fruit & 🍰', NULL, NULL, NULL, NULL, 1, '2021-01-05 07:45:18', '2021-01-05 07:45:18'),
(2, 9, 'http://54.163.177.131/uploads/post/post0.86979000 1609839700.jpeg', NULL, 'Sushi Roll', NULL, NULL, NULL, NULL, 1, '2021-01-05 09:41:41', '2021-01-05 09:41:41'),
(3, 7, 'http://54.163.177.131/uploads/post/post0.76695300 1609839877.jpeg', NULL, 'G & Cake', NULL, NULL, NULL, NULL, 1, '2021-01-05 09:44:37', '2021-01-05 09:44:37'),
(4, 7, 'http://54.163.177.131/uploads/post/post0.06164400 1609839911.jpeg', NULL, 'Fry Rice cake', NULL, NULL, NULL, NULL, 1, '2021-01-05 09:45:11', '2021-01-05 09:45:11');

-- --------------------------------------------------------

--
-- Table structure for table `recipes`
--

CREATE TABLE `recipes` (
  `id` bigint UNSIGNED NOT NULL,
  `user_id` int NOT NULL,
  `photo` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `content` text COLLATE utf8mb4_unicode_ci,
  `review` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `count` int DEFAULT NULL,
  `active` tinyint(1) DEFAULT '1',
  `etc` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `recipes`
--

INSERT INTO `recipes` (`id`, `user_id`, `photo`, `title`, `content`, `review`, `count`, `active`, `etc`, `created_at`, `updated_at`) VALUES
(1, 2, 'http://54.163.177.131/uploads/recipe/recipe0.51504200 1609832761.jpeg', 'Fruit and Cake.', 'As much as possible.\nFlexible & Weight Loss', NULL, NULL, 1, NULL, '2021-01-05 07:46:01', '2021-01-05 07:46:01'),
(2, 9, 'http://54.163.177.131/uploads/recipe/recipe0.91208700 1609839744.jpeg', 'Sushi Roll', 'With oil and fruit', NULL, NULL, 1, NULL, '2021-01-05 09:42:25', '2021-01-05 09:42:25'),
(3, 7, 'http://54.163.177.131/uploads/recipe/recipe0.61153400 1609839951.jpeg', 'Fry Rice Cake', 'Price 1.99$', NULL, NULL, 1, NULL, '2021-01-05 09:45:51', '2021-01-05 09:45:51');

-- --------------------------------------------------------

--
-- Table structure for table `reports`
--

CREATE TABLE `reports` (
  `id` bigint UNSIGNED NOT NULL,
  `post_id` int DEFAULT NULL,
  `user_id` int DEFAULT NULL,
  `review` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `etc` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `reviews`
--

CREATE TABLE `reviews` (
  `id` bigint UNSIGNED NOT NULL,
  `user_id` int DEFAULT NULL,
  `recipe_id` int DEFAULT NULL,
  `conent` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `etc` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `types`
--

CREATE TABLE `types` (
  `id` bigint UNSIGNED NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sort` int DEFAULT NULL,
  `etc` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `types`
--

INSERT INTO `types` (`id`, `name`, `description`, `sort`, `etc`, `created_at`, `updated_at`) VALUES
(1, 'Chef', NULL, 0, NULL, '2021-01-05 07:06:30', '2021-01-05 07:06:30'),
(2, 'Pastry Chef', NULL, 1, NULL, '2021-01-05 07:06:30', '2021-01-05 07:06:30'),
(3, 'Baker', NULL, 2, NULL, '2021-01-05 07:06:30', '2021-01-05 07:06:30'),
(4, 'Caterer', NULL, 3, NULL, '2021-01-05 07:06:30', '2021-01-05 07:06:30'),
(5, 'Bartender', NULL, 4, NULL, '2021-01-05 07:06:30', '2021-01-05 07:06:30'),
(6, 'Mixologist', NULL, 5, NULL, '2021-01-05 07:06:30', '2021-01-05 07:06:30'),
(7, 'Sommelier', NULL, 6, NULL, '2021-01-05 07:06:30', '2021-01-05 07:06:30'),
(8, 'Wait Staff', NULL, 7, NULL, '2021-01-05 07:06:30', '2021-01-05 07:06:30');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint UNSIGNED NOT NULL,
  `fname` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `lname` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `photo` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bio` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `references` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT '',
  `liquorServingCertification` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT '',
  `company` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT '',
  `title` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT '',
  `years` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT '',
  `location` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT '',
  `geolocation` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT '',
  `postalCode` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT '',
  `typeOfProfessional` text COLLATE utf8mb4_unicode_ci,
  `styleOfCooking` text COLLATE utf8mb4_unicode_ci,
  `role` int DEFAULT NULL,
  `device_token` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `active` tinyint(1) DEFAULT '1',
  `etc` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT '',
  `remember_token` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `fname`, `lname`, `email`, `password`, `photo`, `bio`, `references`, `liquorServingCertification`, `company`, `title`, `years`, `location`, `geolocation`, `postalCode`, `typeOfProfessional`, `styleOfCooking`, `role`, `device_token`, `email_verified_at`, `active`, `etc`, `remember_token`, `created_at`, `updated_at`) VALUES
(1, 'Ryan', '', 'boldo@boldo.com', '$2y$10$ZB88bQCOjHohMePVs/UbP.Xc.WP3rizulld26PMfKBPVTEwIELhFS', NULL, NULL, '', '', '', '', '', '', '', '', NULL, NULL, 2, NULL, NULL, 1, '', NULL, '2021-01-05 07:06:30', '2021-01-05 07:06:30'),
(2, 'Apple', 'Master', 'apple@apple.com', '$2y$10$xAS1hqPXhwnMZ7do.jC5e.BhKOdeYJ8h4xM3ixaFoqqO9DXX0Wh16', 'http://54.163.177.131/uploads/logo/user0.05162100 1609830830.jpeg', 'Hey, I will review this app.', 'Mr.Apple', 'yes', '', '', '', 'Thornton Avenue, Newark, CA, USA', '{\"lat\":37.5400564,\"lng\":-122.0281375}', '220003', '[1]', '[10,25,29,23,14,7]', 1, NULL, NULL, 1, '', NULL, '2021-01-05 07:13:50', '2021-01-05 09:47:29'),
(3, 'Ask', 'Ohmani', 'ask@ohmani.com', '$2y$10$8H84yXsqL4JUUzdrlZAkZ.FqEGcgHSya0lubrrzwFFRrETfIaZuJO', 'http://54.163.177.131/uploads/logo/user0.07054100 1609830943.jpeg', NULL, NULL, 'yes', '', '', '', NULL, '[]', NULL, '[]', '[]', 0, NULL, NULL, 1, '', NULL, '2021-01-05 07:15:43', '2021-01-05 09:40:41'),
(4, 'Simson', 'Emma', 'emma.simson@gmail.com', '$2y$10$tYOco/xwoZGFEhgXv4kD/OYbzqBLndI/n8afRM3/NkqZciolCNKy.', 'http://54.163.177.131/uploads/logo/user0.48066600 1609831159.jpeg', 'Hey I am professional 😎', 'Mr.S', 'yes', '', '', '', 'Home Depot, San Mateo, CA, USA', '{\"lat\":37.5636873,\"lng\":-122.28063}', '123456', '[4]', '[10,5]', 1, NULL, NULL, 1, '', NULL, '2021-01-05 07:19:19', '2021-01-05 07:19:19'),
(5, 'Tim', 'Smith', 'tim.david.smith@gmail.com', '$2y$10$TfWBrYcDas3GjWlmU7jwEuewxwcRGzXhO0Vi99ewlXzhmZcMTK/VC', 'http://54.163.177.131/uploads/logo/user0.05602300 1609831667.jpeg', 'I am pro.', 'Mr.Smith', 'yes', '', '', '', 'San Jose, CA, USA', '{\"lat\":37.3382082,\"lng\":-121.8863286}', '220003', '[6]', '[]', 1, NULL, NULL, 1, '', NULL, '2021-01-05 07:27:47', '2021-01-05 07:27:47'),
(6, 'Britt', 'Lake', 'britt_lake@yahoo.com', '$2y$10$zkZ6ckfw.LZYBKluAtMVBu3ZcYpTgPyB6gnyAIDZhckBzbmQNLvf.', 'http://54.163.177.131/uploads/logo/user0.70261900 1609831744.jpeg', NULL, NULL, 'yes', '', '', '', NULL, '[]', NULL, '[]', '[]', 0, NULL, NULL, 1, '', NULL, '2021-01-05 07:29:04', '2021-01-05 07:29:04'),
(7, 'Federico', 'Beckley', 'becks584@gmail.com', '$2y$10$F.CDZuvmOxFnGT9DtkAfAu9.d1AUYrmpFItUDhKamPq6GLYI6NW0S', 'http://54.163.177.131/uploads/logo/user0.57110400 1609831861.jpeg', 'I am pro', 'Mr.J', 'yes', '', '', '', 'Santa Clara County, CA, USA', '{\"lat\":37.3336581,\"lng\":-121.8907041}', '2000', '[6]', '[]', 1, NULL, NULL, 1, '', NULL, '2021-01-05 07:31:01', '2021-01-05 09:46:10'),
(8, 'Meek', 'Kendrick', 'kendrickbmeek@gmail.com', '$2y$10$I5ff1/3jwHinUuSPHDPnOu9ZSq6RVaan6qDJhc9qbHY3xCPTGktDe', 'http://54.163.177.131/uploads/logo/user0.32308200 1609831956.jpeg', 'I am pro', 'Mr', 'yes', '', '', '', 'Sunnyvale, CA, USA', '{\"lat\":37.36883,\"lng\":-122.0363496}', '2222', '[5]', '[]', 1, NULL, NULL, 1, '', NULL, '2021-01-05 07:32:36', '2021-01-05 07:32:36'),
(9, 'Markus', 'Meier', 'markusmarkman@hotmail.com', '$2y$10$i33zxY6ODdMdCV5bdiJ4n.RaH2JjgZn.l0NQObTRQp0sgwwjhyIY.', 'http://54.163.177.131/uploads/logo/user0.01946600 1609832054.jpeg', 'Hello', 'M', 'yes', '', '', '', 'Alum Rock, CA, USA', '{\"lat\":37.370829,\"lng\":-121.8206743}', '2', '[4,5]', '[4,12]', 1, NULL, NULL, 1, '', NULL, '2021-01-05 07:34:14', '2021-01-05 09:42:38'),
(10, 'Celia', 'Celia', 'celiadoherty@gmail.com', '$2y$10$3R9uBbdq0YzhH3IkSmbVuuYvyce5p14K61ZztsujCig7Nxe8sxfJm', 'http://54.163.177.131/uploads/logo/user0.69339200 1609832138.jpeg', NULL, NULL, 'yes', '', '', '', NULL, '[]', NULL, '[]', '[]', 0, NULL, NULL, 1, '', NULL, '2021-01-05 07:35:38', '2021-01-05 07:35:38'),
(11, 'Mimi', 'Mimi', 'mimihoang03@gmail.com', '$2y$10$7sq4H/IZvjim23m46JHXUOyelG2dEz90JAdsCguOnkFZX6bQFxsea', 'http://54.163.177.131/uploads/logo/user0.57550500 1609832173.jpeg', NULL, NULL, 'yes', '', '', '', NULL, '[]', NULL, '[]', '[]', 0, NULL, NULL, 1, '', NULL, '2021-01-05 07:36:13', '2021-01-05 09:11:37'),
(12, 'William', 'Pross', 'taylor.pross29@gmail.com', '$2y$10$7TBfPZ216rnreMgvVGqoCODiFsAgaAcVdKz5q9j6rGrWh/B67CM/m', 'http://54.163.177.131/uploads/logo/default.png', NULL, NULL, 'yes', '', '', '', NULL, '[]', NULL, '[]', '[]', 0, NULL, NULL, 1, '', NULL, '2021-01-05 07:36:40', '2021-01-05 09:49:11'),
(13, 'Oksana', 'Bihun', 'obihun4@gmail.com', '$2y$10$rE6c7FoKYKsoO0E8Bic/xetNhlx8JsaEAzHlJEhJ09nRxP0EFT5kS', 'http://54.163.177.131/uploads/logo/user0.00224600 1609832539.jpeg', NULL, NULL, 'yes', '', '', '', NULL, '[]', NULL, '[]', '[]', 0, NULL, NULL, 1, '', NULL, '2021-01-05 07:42:19', '2021-01-05 09:48:18');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `chat_rooms`
--
ALTER TABLE `chat_rooms`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `cooking_styles`
--
ALTER TABLE `cooking_styles`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`);

--
-- Indexes for table `histories`
--
ALTER TABLE `histories`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `oauth_access_tokens`
--
ALTER TABLE `oauth_access_tokens`
  ADD PRIMARY KEY (`id`),
  ADD KEY `oauth_access_tokens_user_id_index` (`user_id`);

--
-- Indexes for table `oauth_auth_codes`
--
ALTER TABLE `oauth_auth_codes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `oauth_auth_codes_user_id_index` (`user_id`);

--
-- Indexes for table `oauth_clients`
--
ALTER TABLE `oauth_clients`
  ADD PRIMARY KEY (`id`),
  ADD KEY `oauth_clients_user_id_index` (`user_id`);

--
-- Indexes for table `oauth_personal_access_clients`
--
ALTER TABLE `oauth_personal_access_clients`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `oauth_refresh_tokens`
--
ALTER TABLE `oauth_refresh_tokens`
  ADD PRIMARY KEY (`id`),
  ADD KEY `oauth_refresh_tokens_access_token_id_index` (`access_token_id`);

--
-- Indexes for table `password_resets`
--
ALTER TABLE `password_resets`
  ADD KEY `password_resets_email_index` (`email`);

--
-- Indexes for table `pendings`
--
ALTER TABLE `pendings`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `posts`
--
ALTER TABLE `posts`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `recipes`
--
ALTER TABLE `recipes`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `reports`
--
ALTER TABLE `reports`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `reviews`
--
ALTER TABLE `reviews`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `types`
--
ALTER TABLE `types`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_unique` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `chat_rooms`
--
ALTER TABLE `chat_rooms`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `cooking_styles`
--
ALTER TABLE `cooking_styles`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;

--
-- AUTO_INCREMENT for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `histories`
--
ALTER TABLE `histories`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `oauth_personal_access_clients`
--
ALTER TABLE `oauth_personal_access_clients`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `pendings`
--
ALTER TABLE `pendings`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `posts`
--
ALTER TABLE `posts`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `recipes`
--
ALTER TABLE `recipes`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `reports`
--
ALTER TABLE `reports`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `reviews`
--
ALTER TABLE `reviews`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `types`
--
ALTER TABLE `types`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
