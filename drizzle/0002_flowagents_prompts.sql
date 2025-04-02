DROP TABLE IF EXISTS "flowAgents_diagram_cache";

CREATE TABLE IF NOT EXISTS "flowAgents_diagrams" (
    "id" serial PRIMARY KEY,
    "prompt" varchar(1000) NOT NULL,
    "diagram" varchar(10000) NOT NULL,
    "title" varchar(256) DEFAULT 'Diagrama sem título' NOT NULL,
    "created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updated_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
); 