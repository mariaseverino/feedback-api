import { pgTable, text, boolean, timestamp } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { users } from './auth-schema';

export const feedbacks = pgTable('feedbacks', {
    id: text('id').primaryKey(),
    feedback: text('feedback').notNull(),
    category: text('category').notNull(),
    senderId: text('sender_id').references(() => users.id, {
        onDelete: 'cascade',
    }),
    receiverId: text('receiver_id')
        .notNull()
        .references(() => users.id, {
            onDelete: 'cascade',
        }),
    isAnonymous: boolean('is_anonymous').default(false),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
        .defaultNow()
        .$onUpdate(() => new Date())
        .notNull(),
});

export const feedbacksRelations = relations(feedbacks, ({ one }) => ({
    sender: one(users, {
        fields: [feedbacks.senderId],
        references: [users.id],
        relationName: 'sender',
    }),
    receiver: one(users, {
        fields: [feedbacks.receiverId],
        references: [users.id],
        relationName: 'receiver',
    }),
}));
