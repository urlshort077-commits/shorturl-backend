import z from 'zod';

const updateUserStatusValidation = z.object({
    body: z.object({
        status: z.enum(['ACTIVE', 'SUSPENDED']),
    })
})

const updateUrlStatusValidation = z.object({
    body: z.object({
        urlStatus: z.enum(['AVAILABLE', 'RESTRICTED']),
    })
})

export const adminValidation = {
    updateUserStatusValidation,
    updateUrlStatusValidation,
}