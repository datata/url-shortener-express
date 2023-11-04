-- CREATE TABLE urlShortened (
--   id INT AUTO_INCREMENT PRIMARY KEY,
--   url VARCHAR(255) NOT NULL,
--   url_shorted VARCHAR(255) UNIQUE NOT NULL,
--   usage_counter BIGINT UNSIGNED NOT NULL DEFAULT 1,
--   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--   updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
-- );

CREATE TABLE urlShortened (
  id SERIAL PRIMARY KEY, -- SERIAL se utiliza para campos autoincrementales en PostgreSQL
  url VARCHAR(255) NOT NULL,
  url_shorted VARCHAR(255) UNIQUE NOT NULL,
  usage_counter BIGINT NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW() -- No es necesario ON UPDATE en PostgreSQL
);