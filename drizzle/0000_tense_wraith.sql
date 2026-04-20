CREATE TABLE `applications` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`company` text NOT NULL,
	`category` text NOT NULL,
	`date` text NOT NULL,
	`count` integer DEFAULT 0 NOT NULL
);
