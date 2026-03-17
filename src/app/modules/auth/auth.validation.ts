import z from 'zod';

const registerValidation = z.object({
    body: z.object({
        email:    z.email('Invalid email'),
        password: z.string().min(6, 'Min 6 characters'),
        name:     z.string().min(1, 'Name is required').max(30, 'Name too long'),
    })
})

const loginValidation = z.object({
    body: z.object({
        email:    z.email('Invalid email'),
        password: z.string().min(1, 'Password is required'),
    })
})

export const authValidation = {
    registerValidation,
    loginValidation,
}