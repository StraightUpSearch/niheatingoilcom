-- Add performance indexes for NI Heating Oil database
-- These indexes will significantly improve query performance

-- Index on oil_prices for supplier lookups
CREATE INDEX idx_oil_prices_supplier_id ON oil_prices(supplier_id);

-- Index on oil_prices for postcode searches
CREATE INDEX idx_oil_prices_postcode ON oil_prices(postcode);

-- Composite index for price queries by supplier and volume
CREATE INDEX idx_oil_prices_supplier_volume ON oil_prices(supplier_id, volume);

-- Index on saved_quotes for user lookups
CREATE INDEX idx_saved_quotes_user_id ON saved_quotes(user_id);

-- Index on saved_quotes for date-based queries
CREATE INDEX idx_saved_quotes_created_at ON saved_quotes(created_at DESC);

-- Index on price_alerts for user lookups
CREATE INDEX idx_price_alerts_user_id ON price_alerts(user_id);

-- Index on price_alerts for active alert queries
CREATE INDEX idx_price_alerts_active ON price_alerts(is_active, postcode) WHERE is_active = true;

-- Index on leads for status-based queries
CREATE INDEX idx_leads_status ON leads(status);

-- Index on leads for date-based queries
CREATE INDEX idx_leads_created_at ON leads(created_at DESC);

-- Index on tickets for user lookups
CREATE INDEX idx_tickets_user_id ON tickets(user_id);

-- Index on tickets for status queries
CREATE INDEX idx_tickets_status ON tickets(status);

-- Index on search_queries for analytics
CREATE INDEX idx_search_queries_created_at ON search_queries(created_at DESC);
CREATE INDEX idx_search_queries_postcode ON search_queries(postcode);

-- Index on suppliers for active supplier queries
CREATE INDEX idx_suppliers_active ON suppliers(is_active) WHERE is_active = true;

-- Index on price_history for trend analysis
CREATE INDEX idx_price_history_date_volume ON price_history(date DESC, volume);

-- Add constraint to ensure postcode field length is appropriate for NI postcodes
-- Note: This would require data migration if existing data exceeds the limit
-- ALTER TABLE oil_prices ALTER COLUMN postcode TYPE varchar(10);
-- ALTER TABLE price_alerts ALTER COLUMN postcode TYPE varchar(10);
-- ALTER TABLE leads ALTER COLUMN postcode TYPE varchar(10);
-- ALTER TABLE search_queries ALTER COLUMN postcode TYPE varchar(10);
-- ALTER TABLE saved_quotes ALTER COLUMN postcode TYPE varchar(10);