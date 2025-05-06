CREATE TABLE manifchat   (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ
    texto TEXT,
    user_id UUID NOT NULL,
    CONSTRAINT fk_user
        FOREIGN KEY (user_id)
        REFERENCES public.users(id)
    manif_id INT NOT NULL
    CONSTRAINT fk_manif
        FOREIGN KEY (manif_id)
        REFERENCES public.manifestaciones(id)
);