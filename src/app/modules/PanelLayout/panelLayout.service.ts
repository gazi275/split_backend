import { Prisma } from "@prisma/client"
import prisma from "../../../shared/prisma"

const getLayoutByUserId = async (userId: string) => {
  const result = await prisma.panelLayout.findUnique({
    where: {
      userId,
    },
  })

  return result?.layout ?? null
}

const upsertLayout = async (userId: string, layout: Prisma.InputJsonValue) => {
  const result = await prisma.panelLayout.upsert({
    where: {
      userId,
    },
    update: {
      layout,
    },
    create: {
      userId,
      layout,
    },
  })

  return result.layout
}

export const PanelLayoutService = {
  getLayoutByUserId,
  upsertLayout,
}
