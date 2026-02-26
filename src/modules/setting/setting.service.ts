import { Prisma } from "../../../generated/prisma/client";
import { prisma } from "../../../lib/prisma";

export const getSettingByKey = async (key: string) => {
  return prisma.setting.findUnique({
    where: { key },
  });
};

export const getAllSettings = async () => {
  const settings = await prisma.setting.findMany();
  const result: Record<string, string | null> = {};
  for (const setting of settings) {
    result[setting.key] = setting.value;
  }
  return result;
};

export const upsertSetting = async (
  key: string,
  value: string | null,
  description?: string,
  userId?: number
) => {
  return prisma.setting.upsert({
    where: { key },
    update: { value, description, updatedById: userId },
    create: { key, value, description, createdById: userId, updatedById: userId },
  });
};

export const upsertSettings = async (data: Record<string, string | null>, userId?: number) => {
  const results = await Promise.all(
    Object.entries(data).map(([key, value]) => upsertSetting(key, value, undefined, userId))
  );
  return results;
};

export const deleteSetting = async (key: string) => {
  return prisma.setting.delete({
    where: { key },
  });
};