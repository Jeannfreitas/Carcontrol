-- Esquema do banco da portaria. Idempotente: pode ser executado várias vezes.
CREATE TABLE IF NOT EXISTS movements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    plate VARCHAR(7) NOT NULL,
    model VARCHAR(40) NOT NULL,
    color VARCHAR(40) NOT NULL,
    driver VARCHAR(60) NOT NULL,
    company VARCHAR(80),
    observation VARCHAR(300),
    entry_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    exit_at TIMESTAMPTZ,
    CONSTRAINT chk_movement_exit_after_entry CHECK (exit_at IS NULL OR exit_at >= entry_at)
);

CREATE INDEX IF NOT EXISTS idx_movements_entry_at ON movements (entry_at DESC);
CREATE INDEX IF NOT EXISTS idx_movements_exit_at ON movements (exit_at);
CREATE INDEX IF NOT EXISTS idx_movements_plate ON movements (plate);
-- Impede duas entradas abertas para a mesma placa.
CREATE UNIQUE INDEX IF NOT EXISTS uq_movements_present_plate ON movements (plate) WHERE exit_at IS NULL;
