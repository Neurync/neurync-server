/*
  Warnings:

  - Added the required column `type` to the `nonverbal_messages` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_nonverbal_messages" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "content" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "emoji_icon" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "is_favorited" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "nonverbal_messages_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_nonverbal_messages" ("content", "emoji_icon", "id", "is_favorited", "user_id") SELECT "content", "emoji_icon", "id", "is_favorited", "user_id" FROM "nonverbal_messages";
DROP TABLE "nonverbal_messages";
ALTER TABLE "new_nonverbal_messages" RENAME TO "nonverbal_messages";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
