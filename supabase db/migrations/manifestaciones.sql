CREATE TABLE manifestaciones (
    id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    titulo TEXT NOT NULL,
    descripcion TEXT,
    fecha DATE,
    imagen TEXT,
    ubicacion TEXT,
    user_id UUID NOT NULL,
    CONSTRAINT fk_manif_user
        FOREIGN KEY (user_id)
        REFERENCES public.users(id)
);