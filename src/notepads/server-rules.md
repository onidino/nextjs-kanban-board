# SERVER RULES
- If you are generating validation schemas, forms, actions, working with the db, then ALWAYS use the database from @lib/db/schema.ts as a SINGLE SOURCE OF TRUTH.
- NEVER MODIFY OR REMOVE ANYTHING FROM THE DATABASE SCHEMA, UNLESS I EXPLICITLY TELL YOU TO DO SO.
- Server action files should always start with the "use server" directive