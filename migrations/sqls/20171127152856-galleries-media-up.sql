CREATE TABLE `galleries_media` (
  `media_id` int(11) unsigned NOT NULL,
  `gallery_id` int(11) NOT NULL,
  `order` int(11) NOT NULL,
  PRIMARY KEY (`media_id`),
  KEY `gallery-media` (`gallery_id`,`media_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
