import { assetServices } from '@/services';
import { asyncHandler, HttpResponse } from '@/utils';
import { GetPresignedUrlBody } from '@/validations';
import { Request, Response } from 'express';
import { v4 as uuid } from 'uuid';

export const assetControllers = {
  getPresignedUrl: asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!._id;
    const { body } = req as { body: GetPresignedUrlBody };
    const { fileName, mimeType } = body;
    const key = `assets/${userId}/${uuid()}-${fileName}`;
    const presignedUrl = await assetServices.getPresignedUrl(key, mimeType, userId, fileName);
    const resPayload = {
      key,
      presignedUrl,
    };
    return HttpResponse(req, res, 200, 'Presigned URL fetched successfully', resPayload);
  }),
  createAsset: asyncHandler(async (req: Request, res: Response) => {
    return HttpResponse(req, res, 200, 'Asset created successfully');
  }),
  getAssetById: asyncHandler(async (req: Request, res: Response) => {
    return HttpResponse(req, res, 200, 'Asset fetched successfully');
  }),
  getAllProjectAssets: asyncHandler(async (req: Request, res: Response) => {
    return HttpResponse(req, res, 200, 'Assets fetched successfully');
  }),
  getAllWorkspaceAssets: asyncHandler(async (req: Request, res: Response) => {
    return HttpResponse(req, res, 200, 'Assets fetched successfully');
  }),
  updateAsset: asyncHandler(async (req: Request, res: Response) => {
    return HttpResponse(req, res, 200, 'Asset updated successfully');
  }),
  deleteAsset: asyncHandler(async (req: Request, res: Response) => {
    return HttpResponse(req, res, 200, 'Asset deleted successfully');
  }),
};
