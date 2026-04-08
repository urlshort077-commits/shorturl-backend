import { Request, Response } from 'express'
import { generateAIResponse } from './ai.service'

export const chatWithAI = async (req: Request, res: Response) => {
    try {
        const { message } = req.body

        if (!message) {
            return res.status(400).json({
                success: false,
                message: 'Message is required',
            })
        }

        const reply = await generateAIResponse(message)

        res.status(200).json({
            success: true,
            message: 'AI response generated successfully',
            data: reply,
        })
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message || 'AI request failed',
        })
    }
}