-- CreateTable
CREATE TABLE "default_nonverbal_messages" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "content" TEXT NOT NULL,
    "emoji_icon" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "is_favorited" BOOLEAN NOT NULL DEFAULT false
);

-- CreateTable
CREATE TABLE "user_has_default_nonverbal_messages" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "user_id" TEXT NOT NULL,
    "default_nonverbal_message_id" TEXT NOT NULL,
    "user_has" BOOLEAN NOT NULL DEFAULT true,
    CONSTRAINT "user_has_default_nonverbal_messages_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "user_has_default_nonverbal_messages_default_nonverbal_message_id_fkey" FOREIGN KEY ("default_nonverbal_message_id") REFERENCES "default_nonverbal_messages" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
