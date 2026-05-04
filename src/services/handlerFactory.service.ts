import AppError from "../utils/AppError";
// import logger from "../Config/winston";

interface ServiceOptions {
  ownerField?: string;
  include?: any;
}

export const getAll =
  (model: any, options: ServiceOptions = {}) =>
  async (userId?: string, query: any = {}) => {
    const { page = 1, limit = 10, ...filters } = query;
    const skip = (page - 1) * limit;

    const where: any = { ...filters };
    if (options.ownerField && userId) {
      where[options.ownerField] = userId;
    }

    const [data, total] = await Promise.all([
      model.findMany({
        where,
        include: options.include,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      model.count({ where }),
    ]);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  };

export const getOne =
  (model: any, options: ServiceOptions = {}) =>
  async (id: string, userId?: string) => {
    const where: any = { id };
    if (options.ownerField && userId) {
      where[options.ownerField] = userId;
    }

    const doc = await model.findFirst({
      where,
      include: options.include,
    });

    if (!doc) {
      throw new AppError("Document not found", 404);
    }

    return doc;
  };

export const createOne =
  (model: any, options: ServiceOptions = {}) =>
  async (data: any, userId?: string) => {
    const createData = { ...data };
    if (options.ownerField && userId) {
      createData[options.ownerField] = userId;
    }

    return await model.create({
      data: createData,
      include: options.include,
    });
  };

export const updateOne =
  (model: any, options: ServiceOptions = {}) =>
  async (id: string, data: any, userId?: string) => {
    const where: any = { id };
    if (options.ownerField && userId) {
      where[options.ownerField] = userId;
    }

    const existingDoc = await model.findFirst({ where });
    if (!existingDoc) {
      throw new AppError("Document not found or access denied", 404);
    }

    return await model.update({
      where: { id },
      data,
      include: options.include,
    });
  };

export const deleteOne =
  (model: any, options: ServiceOptions = {}) =>
  async (id: string, userId?: string) => {
    const where: any = { id };
    if (options.ownerField && userId) {
      where[options.ownerField] = userId;
    }

    const existingDoc = await model.findFirst({ where });
    if (!existingDoc) {
      throw new AppError("Document not found or access denied", 404);
    }

    await model.delete({ where: { id } });
    return true;
  };
