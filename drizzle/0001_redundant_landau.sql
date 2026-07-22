CREATE TABLE `telegram_answers` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`telegram_id` text NOT NULL,
	`task_key` text NOT NULL,
	`answer_index` integer NOT NULL,
	`is_correct` integer NOT NULL,
	`answered_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `telegram_students` (
	`telegram_id` text PRIMARY KEY NOT NULL,
	`chat_id` text NOT NULL,
	`first_name` text NOT NULL,
	`username` text,
	`weak_topics` text DEFAULT '[]' NOT NULL,
	`last_score` integer DEFAULT 0 NOT NULL,
	`reminders_enabled` integer DEFAULT true NOT NULL,
	`reminder_hour` integer DEFAULT 10 NOT NULL,
	`last_daily_sent` text,
	`updated_at` text NOT NULL
);
