CREATE TABLE `page_galleries` (
  `page_id` int(11) unsigned NOT NULL,
  `gallery_id` int(11) NOT NULL,
  `order` int(11) NOT NULL DEFAULT '0',
  UNIQUE KEY `composite_id` (`gallery_id`,`page_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
