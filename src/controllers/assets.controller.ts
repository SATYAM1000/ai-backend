import { asyncHandler, HttpResponse } from '@/utils';
import { Request, Response } from 'express';

export const assetControllers = {
  getPresignedUrl: asyncHandler(async (req: Request, res: Response) => {
    return HttpResponse(req, res, 200, 'Presigned URL fetched successfully');
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
