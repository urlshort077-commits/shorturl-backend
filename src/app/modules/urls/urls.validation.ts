import z from 'zod';

const createUrlValidation = z.object({
    body: z.object({
        originalUrl: z.url('Invalid URL'),
        customUrl:   z.string()
                      .min(3, 'Min 3 characters')
                      .max(20, 'Max 20 characters')
                      .regex(/^[a-zA-Z0-9-_]+$/, 'Only letters, numbers, - and _ allowed')
                      .optional(),
    })
})

const updateUrlValidation = z.object({
    body: z.object({
        customUrl: z.string()
                    .min(3, 'Min 3 characters')
                    .max(20, 'Max 20 characters')
                    .regex(/^[a-zA-Z0-9-_]+$/, 'Only letters, numbers, - and _ allowed')
                    .optional(),
    })
})

export const urlValidation = {
    createUrlValidation,
    updateUrlValidation,
}