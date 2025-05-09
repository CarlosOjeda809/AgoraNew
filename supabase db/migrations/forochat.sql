CREATE TABLE forochat (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ,
    texto TEXT,
    user_id UUID NOT NULL,
    foro_id UUID NOT NULL,
    CONSTRAINT fk_forochat_user
        FOREIGN KEY (user_id)
        REFERENCES public.users(id),
    CONSTRAINT fk_forochat_foro
        FOREIGN KEY (foro_id)
        REFERENCES public.foros(id)
);