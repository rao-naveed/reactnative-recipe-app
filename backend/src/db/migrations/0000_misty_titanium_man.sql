CREATE TABLE "favorites" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"recipe_id" integer NOT NULL,
	"title" varchar(255) NOT NULL,
	"image" text,
	"cook_time" integer,
	"servings" integer,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "recipe_views" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"recipe_id" integer NOT NULL,
	"viewed_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "recipe_views_user_id_recipe_id_unique" UNIQUE("user_id","recipe_id")
);
--> statement-breakpoint
CREATE TABLE "recipes" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"ingredients" text NOT NULL,
	"instructions" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"password" text NOT NULL,
	"verification_code" varchar(6),
	"is_verified" boolean DEFAULT false NOT NULL,
	"verified_at" timestamp,
	"subscription_tier" varchar(20) DEFAULT 'FREE' NOT NULL,
	"subscription_expires_at" timestamp,
	"free_views_used" integer DEFAULT 0 NOT NULL,
	"free_views_month" varchar(7),
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "favorites" ADD CONSTRAINT "favorites_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recipe_views" ADD CONSTRAINT "recipe_views_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;