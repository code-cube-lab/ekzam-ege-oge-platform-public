CREATE TABLE `demo_sessions` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`role` text NOT NULL,
	`entitlement` text NOT NULL,
	`diagnostic_score` integer DEFAULT 0 NOT NULL,
	`weak_topics` text DEFAULT '[]' NOT NULL,
	`updated_at` text NOT NULL
);
