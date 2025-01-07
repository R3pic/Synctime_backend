-- CreateTable
CREATE TABLE "meeting" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "starttime" TEXT NOT NULL,
    "endtime" TEXT NOT NULL,
    "dates" TEXT NOT NULL,
    "created" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "schedule" (
    "meeting_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "data" TEXT NOT NULL,

    PRIMARY KEY ("meeting_id", "name"),
    CONSTRAINT "schedule_meeting_id_fkey" FOREIGN KEY ("meeting_id") REFERENCES "meeting" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "meeting_id_key" ON "meeting"("id");
