
-- Check if the user already exists and has admin role
DO $$
DECLARE
    existing_user_id uuid;
    existing_role text;
BEGIN
    -- Get the existing user ID
    SELECT id INTO existing_user_id
    FROM auth.users 
    WHERE email = 'crashespad@gmail.com';
    
    IF existing_user_id IS NOT NULL THEN
        -- Check if user already has admin role
        SELECT role INTO existing_role
        FROM public.user_roles 
        WHERE user_id = existing_user_id AND role = 'admin';
        
        -- If no admin role exists, assign it
        IF existing_role IS NULL THEN
            INSERT INTO public.user_roles (user_id, role, created_by)
            VALUES (existing_user_id, 'admin', existing_user_id);
            
            RAISE NOTICE 'Admin role assigned to existing user: %', existing_user_id;
        ELSE
            RAISE NOTICE 'User already has admin role: %', existing_user_id;
        END IF;
    ELSE
        RAISE NOTICE 'User with email crashespad@gmail.com does not exist';
    END IF;
END $$;
