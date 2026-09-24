CREATE TYPE "public"."action" AS ENUM('create', 'get', 'update', 'delete');--> statement-breakpoint
CREATE TABLE "belonging" (
	"identity" uuid PRIMARY KEY DEFAULT uuidv7() NOT NULL,
	"subject" uuid NOT NULL,
	"tenant" uuid NOT NULL,
	"role" uuid NOT NULL,
	CONSTRAINT "unique_subject_tenant" UNIQUE("subject","tenant")
);
--> statement-breakpoint
CREATE TABLE "regulation" (
	"identity" uuid PRIMARY KEY DEFAULT uuidv7() NOT NULL,
	"role" uuid NOT NULL,
	"rule" uuid NOT NULL,
	CONSTRAINT "unique_role_rule" UNIQUE("role","rule")
);
--> statement-breakpoint
CREATE TABLE "role" (
	"identity" uuid PRIMARY KEY DEFAULT uuidv7() NOT NULL,
	"name" varchar(255) NOT NULL,
	"tenant" uuid NOT NULL,
	CONSTRAINT "unique_role_name_per_tenant" UNIQUE("name","tenant")
);
--> statement-breakpoint
CREATE TABLE "rule" (
	"identity" uuid PRIMARY KEY DEFAULT uuidv7() NOT NULL,
	"action" "action" NOT NULL,
	"resource" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "subject" (
	"identity" uuid PRIMARY KEY DEFAULT uuidv7() NOT NULL,
	"name" varchar(255) NOT NULL,
	"password" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	CONSTRAINT "subject_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "tenant" (
	"identity" uuid PRIMARY KEY DEFAULT uuidv7() NOT NULL,
	"name" varchar(255) NOT NULL,
	"owner" uuid NOT NULL,
	CONSTRAINT "unique_tenant_per_owner" UNIQUE("name","owner")
);
--> statement-breakpoint
ALTER TABLE "belonging" ADD CONSTRAINT "belonging_subject_subject_identity_fk" FOREIGN KEY ("subject") REFERENCES "public"."subject"("identity") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "belonging" ADD CONSTRAINT "belonging_tenant_tenant_identity_fk" FOREIGN KEY ("tenant") REFERENCES "public"."tenant"("identity") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "belonging" ADD CONSTRAINT "belonging_role_role_identity_fk" FOREIGN KEY ("role") REFERENCES "public"."role"("identity") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "regulation" ADD CONSTRAINT "regulation_role_role_identity_fk" FOREIGN KEY ("role") REFERENCES "public"."role"("identity") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "regulation" ADD CONSTRAINT "regulation_rule_rule_identity_fk" FOREIGN KEY ("rule") REFERENCES "public"."rule"("identity") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "role" ADD CONSTRAINT "role_tenant_tenant_identity_fk" FOREIGN KEY ("tenant") REFERENCES "public"."tenant"("identity") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tenant" ADD CONSTRAINT "tenant_owner_subject_identity_fk" FOREIGN KEY ("owner") REFERENCES "public"."subject"("identity") ON DELETE cascade ON UPDATE no action;