-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "cpfCnpj" VARCHAR(14) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "whitelabelId" UUID NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "whitelabel" (
    "id" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "url" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "whitelabel_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_cpfCnpj_whitelabelId_key" ON "users"("cpfCnpj", "whitelabelId");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_whitelabelId_key" ON "users"("email", "whitelabelId");

-- CreateIndex
CREATE UNIQUE INDEX "whitelabel_url_key" ON "whitelabel"("url");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_whitelabelId_fkey" FOREIGN KEY ("whitelabelId") REFERENCES "whitelabel"("id") ON DELETE CASCADE ON UPDATE CASCADE;
