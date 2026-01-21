import { db } from '@/database/client';
import { users } from '@/database/schema/auth-schema';
import { feedbacks } from '@/database/schema/feedback-schema';
import { randomUUID } from 'crypto';
import { eq } from 'drizzle-orm';

interface SendFeedbackDto {
    category: string;
    feedback: string;
    receiverId: string;
    anonymous: boolean;
}

export class FeedbackService {
    async save(data: SendFeedbackDto, senderId: string) {
        await db
            .insert(feedbacks)
            .values({ ...data, senderId, id: randomUUID() });
    }

    async getFeedbacksById(userid: string) {
        return await db
            .select({
                id: feedbacks.id,
                feedback: feedbacks.feedback,
                category: feedbacks.category,
                receiver: users.name,
                isAnonymous: feedbacks.isAnonymous,
                createdAt: feedbacks.createdAt,
            })
            .from(feedbacks)
            .leftJoin(users, eq(feedbacks.senderId, users.id))
            .where(eq(feedbacks.receiverId, userid));
    }
}
