CREATE TABLE `pages` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `media_id` int(11) DEFAULT NULL,
  `layout_id` int(10) unsigned NOT NULL DEFAULT '1',
  `featured_gallery_id` int(11) DEFAULT NULL,
  `featured_page_id` int(11) DEFAULT NULL,
  `slug` varchar(64) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `title` varchar(64) COLLATE utf8_unicode_ci NOT NULL DEFAULT '',
  `content` mediumtext COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
