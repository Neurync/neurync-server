/*
  Warnings:

  - You are about to drop the column `is_favorited` on the `default_nonverbal_messages` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_default_nonverbal_messages" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "content" TEXT NOT NULL,
    "emoji_icon" TEXT NOT NULL,
    "type" TEXT NOT NULL
);
INSERT INTO "new_default_nonverbal_messages" ("content", "emoji_icon", "id", "type") SELECT "content", "emoji_icon", "id", "type" FROM "default_nonverbal_messages";
DROP TABLE "default_nonverbal_messages";
ALTER TABLE "new_default_nonverbal_messages" RENAME TO "default_nonverbal_messages";
CREATE TABLE "new_user_has_default_nonverbal_messages" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "user_id" TEXT NOT NULL,
    "default_nonverbal_message_id" TEXT NOT NULL,
    "user_has" BOOLEAN NOT NULL DEFAULT true,
    "is_favorited" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "user_has_default_nonverbal_messages_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "user_has_default_nonverbal_messages_default_nonverbal_message_id_fkey" FOREIGN KEY ("default_nonverbal_message_id") REFERENCES "default_nonverbal_messages" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_user_has_default_nonverbal_messages" ("default_nonverbal_message_id", "id", "user_has", "user_id") SELECT "default_nonverbal_message_id", "id", "user_has", "user_id" FROM "user_has_default_nonverbal_messages";
DROP TABLE "user_has_default_nonverbal_messages";
ALTER TABLE "new_user_has_default_nonverbal_messages" RENAME TO "user_has_default_nonverbal_messages";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
