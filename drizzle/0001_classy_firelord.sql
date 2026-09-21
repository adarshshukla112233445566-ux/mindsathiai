CREATE TABLE `activity_results` (
	`id` varchar(64) NOT NULL,
	`patientId` varchar(64) NOT NULL,
	`type` varchar(32) NOT NULL,
	`score` int NOT NULL,
	`accuracy` int NOT NULL,
	`responseTime` int NOT NULL,
	`difficulty` varchar(32) NOT NULL,
	`completedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `activity_results_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `app_users` (
	`id` varchar(64) NOT NULL,
	`name` varchar(160) NOT NULL,
	`email` varchar(320) NOT NULL,
	`password` varchar(255) NOT NULL,
	`role` enum('patient','caregiver','admin') NOT NULL,
	`age` int,
	`language` varchar(8) NOT NULL DEFAULT 'en',
	`connectionCode` varchar(32),
	`caregiverId` varchar(64),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `app_users_id` PRIMARY KEY(`id`),
	CONSTRAINT `app_users_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
CREATE TABLE `caregiver_connections` (
	`id` varchar(64) NOT NULL,
	`patientId` varchar(64) NOT NULL,
	`caregiverId` varchar(64) NOT NULL,
	`status` varchar(32) NOT NULL DEFAULT 'pending',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `caregiver_connections_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `reminders` (
	`id` varchar(64) NOT NULL,
	`patientId` varchar(64) NOT NULL,
	`createdBy` varchar(64) NOT NULL,
	`title` varchar(160) NOT NULL,
	`description` text,
	`scheduledTime` timestamp NOT NULL,
	`repeat` varchar(32) NOT NULL DEFAULT 'once',
	`status` varchar(32) NOT NULL DEFAULT 'upcoming',
	CONSTRAINT `reminders_id` PRIMARY KEY(`id`)
);
