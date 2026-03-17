import z from 'zod';

const updateProfileValidation = z.object({
    body: z.object({
        name:      z.string().min(1, 'Name is required').max(30, 'Name too long').optional(),
        avatarUrl: z.url('Invalid URL').optional(),
    })
})

export const userValidation = {
    updateProfileValidation,
}