-- CreateTable
CREATE TABLE "areas" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "capacity" INTEGER NOT NULL,

    CONSTRAINT "areas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "crowds" (
    "id" SERIAL NOT NULL,
    "status" TEXT NOT NULL,
    "count" INTEGER NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "area_id" INTEGER NOT NULL,

    CONSTRAINT "crowds_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "crowds" ADD CONSTRAINT "crowds_area_id_fkey" FOREIGN KEY ("area_id") REFERENCES "areas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
